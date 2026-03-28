/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi } from "vitest";
import { computeLabelMarginTop, buildStarSprite, clearSceneCache } from "./scene";
import type { System } from "../types";

const tanHalfFov = Math.tan((60 * Math.PI) / 360); // tan(30°) ≈ 0.577

describe("buildStarSprite caching", () => {
  beforeEach(() => {
    // Mock canvas context
    const contextMock = {
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillRect: vi.fn(),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(contextMock);
  });

  const mockSystemG: System = {
    id: 1,
    x: 0,
    y: 0,
    z: 0,
    type: ["G V"],
    sysName: "Sol",
  };
  const mockSystemG2: System = {
    id: 2,
    x: 10,
    y: 0,
    z: 0,
    type: ["G V"],
    sysName: "Alpha Centauri",
  };
  const mockSystemM: System = {
    id: 3,
    x: 0,
    y: 10,
    z: 0,
    type: ["M V"],
    sysName: "Barnard's Star",
  };

  const onClick = vi.fn();

  it("reuses the same material for systems with the same spectral type", () => {
    const res1 = buildStarSprite(mockSystemG, onClick);
    const res2 = buildStarSprite(mockSystemG2, onClick);

    expect(res1.sprite.material).toBe(res2.sprite.material);
  });

  it("uses different materials for different spectral types", () => {
    const resG = buildStarSprite(mockSystemG, onClick);
    const resM = buildStarSprite(mockSystemM, onClick);

    expect(resG.sprite.material).not.toBe(resM.sprite.material);
  });

  it("clears cache and creates new materials after clearSceneCache", () => {
    const res1 = buildStarSprite(mockSystemG, onClick);
    const material1 = res1.sprite.material;

    clearSceneCache();

    const res2 = buildStarSprite(mockSystemG, onClick);
    const material2 = res2.sprite.material;

    expect(material1).not.toBe(material2);
  });
});

describe("computeLabelMarginTop", () => {
  it("returns a larger margin for a larger sprite", () => {
    const large = computeLabelMarginTop(400, 800, 3000, tanHalfFov);
    const small = computeLabelMarginTop(90, 800, 3000, tanHalfFov);
    expect(large).toBeGreaterThan(small);
  });

  it("returns a smaller margin when further from the camera", () => {
    const near = computeLabelMarginTop(200, 800, 2000, tanHalfFov);
    const far = computeLabelMarginTop(200, 800, 6000, tanHalfFov);
    expect(near).toBeGreaterThan(far);
  });

  it("includes a minimum 4px base gap even at extreme distance", () => {
    const margin = computeLabelMarginTop(10, 1, 1_000_000, tanHalfFov);
    expect(margin).toBeGreaterThanOrEqual(4);
  });

  it("returns whole-pixel (integer) values", () => {
    const margin = computeLabelMarginTop(200, 800, 3000, tanHalfFov);
    expect(Number.isInteger(margin)).toBe(true);
  });

  it("scales proportionally with viewport height", () => {
    const small = computeLabelMarginTop(200, 400, 3000, tanHalfFov);
    const large = computeLabelMarginTop(200, 800, 3000, tanHalfFov);
    expect(large).toBeGreaterThan(small);
  });
});
