import { describe, it, expect } from "vitest";
import { jumpList } from "./jumpLinks";
import type { Jump, JumpType } from "./types";

const TYPES: ReadonlyArray<JumpType> = ["A", "B", "G", "D", "E"] as const;

describe("jumpLinks data", () => {
  it("is non-empty and has valid shapes", () => {
    expect(Array.isArray(jumpList)).toBe(true);
    expect(jumpList.length).toBeGreaterThan(0);
    for (const j of jumpList) {
      // structure checks
      expect(Array.isArray(j.bridge)).toBe(true);
      expect(j.bridge.length).toBe(2);
      expect(typeof j.bridge[0]).toBe("number");
      expect(typeof j.bridge[1]).toBe("number");
      expect(TYPES.includes(j.type)).toBe(true);
      expect(Number.isFinite(j.year)).toBe(true);
    }
  });

  it("has reasonable year bounds", () => {
    const years = jumpList.map((j) => j.year);
    const min = Math.min(...years);
    const max = Math.max(...years);
    // dataset years should be plausible sci-fi timeline
    expect(min).toBeGreaterThanOrEqual(2000);
    expect(max).toBeLessThanOrEqual(2300);
  });

  it("does not contain self-referential bridges", () => {
    const bad: Jump[] = jumpList.filter((j) => j.bridge[0] === j.bridge[1]);
    expect(bad.length).toBe(0);
  });
});
