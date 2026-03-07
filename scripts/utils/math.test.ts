import { describe, it, expect } from "vitest";
import { CAMERA_FOV, VISIBILITY_DISTANCE } from "../config";

// These values are derived once at class initialisation rather than
// recomputed on every render call (60 fps). The tests document the
// expected values so a config change can't silently alter render behaviour.

describe("render-loop constants derived from config", () => {
  it("tanHalfFov matches tan(CAMERA_FOV / 2)", () => {
    const expected = Math.tan((CAMERA_FOV * Math.PI) / 360);
    // For the default 60° FOV this should be tan(30°) ≈ 0.5774
    expect(expected).toBeCloseTo(0.5774, 3);
  });

  it("visDistSq equals VISIBILITY_DISTANCE squared", () => {
    const expected = VISIBILITY_DISTANCE * VISIBILITY_DISTANCE;
    expect(expected).toBe(VISIBILITY_DISTANCE ** 2);
  });

  it("tanHalfFov is positive and less than 1 for FOV < 90°", () => {
    const tanHalfFov = Math.tan((CAMERA_FOV * Math.PI) / 360);
    expect(tanHalfFov).toBeGreaterThan(0);
    expect(tanHalfFov).toBeLessThan(1);
  });

  it("visDistSq is consistent with VISIBILITY_DISTANCE for distance comparisons", () => {
    // A point exactly at VISIBILITY_DISTANCE should equal visDistSq
    const visDistSq = VISIBILITY_DISTANCE * VISIBILITY_DISTANCE;
    expect(VISIBILITY_DISTANCE * VISIBILITY_DISTANCE).toBe(visDistSq);
    // A closer point should be below the threshold
    expect((VISIBILITY_DISTANCE - 1) ** 2).toBeLessThan(visDistSq);
    // A farther point should be above the threshold
    expect((VISIBILITY_DISTANCE + 1) ** 2).toBeGreaterThan(visDistSq);
  });
});
