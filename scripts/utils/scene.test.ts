import { describe, it, expect, vi, beforeEach, afterEach, type MockInstance } from "vitest";
import { computeLabelMarginTop, labelStyleChanged, buildStarSprite } from "./scene";
import * as THREE from "three";
import type { System } from "../types";

const tanHalfFov = Math.tan((60 * Math.PI) / 360); // tan(30°) ≈ 0.577

describe("buildStarSprite", () => {
  let mockContext: Partial<CanvasRenderingContext2D>;
  let getContextSpy: MockInstance;

  beforeEach(() => {
    mockContext = {
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillRect: vi.fn(),
    } as unknown as Partial<CanvasRenderingContext2D>;
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(mockContext);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("creates a sprite and label for a basic system", () => {
    const system: System = {
      id: 1,
      x: 0,
      y: 0,
      z: 0,
      type: ["G V"],
      sysName: "Sol",
    };
    const onClick = vi.fn();

    const { sprite, label, planetLabel } = buildStarSprite(system, onClick);

    expect(sprite).toBeInstanceOf(THREE.Sprite);
    expect(sprite.scale.x).toBe(120); // 'G' type size

    expect(label).toBeDefined();
    expect(label.element.textContent).toBe("Sol");
    expect(label.element.className).toBe("starLabel");

    expect(planetLabel).toBeUndefined();

    // Test click listener
    label.element.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    // Test keyboard listener
    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
    label.element.dispatchEvent(enterEvent);
    expect(onClick).toHaveBeenCalledTimes(2);

    const spaceEvent = new KeyboardEvent("keydown", { key: " " });
    label.element.dispatchEvent(spaceEvent);
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it("creates a planet label when planetName is provided", () => {
    const system: System = {
      id: 2,
      x: 0,
      y: 0,
      z: 0,
      type: ["M V"],
      sysName: "Proxima Centauri",
      planetName: "Proxima b",
    };
    const onClick = vi.fn();

    const { planetLabel } = buildStarSprite(system, onClick);

    expect(planetLabel).toBeDefined();
    expect(planetLabel!.element.textContent).toBe("Proxima b");
    expect(planetLabel!.element.className).toBe("planetLabel");

    // Test click listener on planet label
    planetLabel!.element.click();
    expect(onClick).toHaveBeenCalledTimes(1);

    // Test keyboard listener
    const enterEvent = new KeyboardEvent("keydown", { key: "Enter" });
    planetLabel!.element.dispatchEvent(enterEvent);
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it("handles unknown star types", () => {
    const system: System = {
      id: 3,
      x: 0,
      y: 0,
      z: 0,
      type: ["Unknown"],
      sysName: "Mystery Star",
    };
    const onClick = vi.fn();

    const { sprite } = buildStarSprite(system, onClick);

    expect(sprite.scale.x).toBe(80); // DEFAULT_STAR_SIZE
  });

  it("throws if canvas 2D context is not available", () => {
    getContextSpy.mockReturnValue(null);
    const system: System = {
      id: 4,
      x: 0,
      y: 0,
      z: 0,
      // Use a new star type to avoid hitting the cache
      type: ["Z V"],
      sysName: "Test",
    };
    expect(() => buildStarSprite(system, vi.fn())).toThrow(/Failed to obtain 2D rendering context/);
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

describe("labelStyleChanged", () => {
  it("returns true when there is no cached value", () => {
    expect(labelStyleChanged(undefined, "12px")).toBe(true);
  });

  it("returns true when the value has changed", () => {
    expect(labelStyleChanged("10px", "12px")).toBe(true);
  });

  it("returns false when the value is unchanged", () => {
    expect(labelStyleChanged("12px", "12px")).toBe(false);
  });

  it("treats different numeric representations as changed", () => {
    expect(labelStyleChanged("12.0px", "12px")).toBe(true);
  });
});
