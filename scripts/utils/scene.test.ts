import { describe, it, expect } from "vitest";
import { computeLabelMarginTop } from "./scene";

const tanHalfFov = Math.tan((60 * Math.PI) / 360); // tan(30°) ≈ 0.577

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
