import { describe, it, expect } from "vitest";
import { systemsArr } from "./systemsList";

function isFiniteNumber(n: unknown): n is number {
  return typeof n === "number" && Number.isFinite(n);
}

describe("systemsList data", () => {
  it("is non-empty and has valid shapes", () => {
    expect(Array.isArray(systemsArr)).toBe(true);
    expect(systemsArr.length).toBeGreaterThan(0);
    for (const s of systemsArr) {
      expect(isFiniteNumber(s.id)).toBe(true);
      expect(isFiniteNumber(s.x)).toBe(true);
      expect(isFiniteNumber(s.y)).toBe(true);
      expect(isFiniteNumber(s.z)).toBe(true);
      expect(Array.isArray(s.type)).toBe(true);
      expect(typeof s.sysName).toBe("string");
      if (s.planetName !== undefined) {
        expect(typeof s.planetName).toBe("string");
      }
    }
  });

  it("has unique ids", () => {
    const ids = new Set<number>();
    for (const s of systemsArr) {
      expect(ids.has(s.id)).toBe(false);
      ids.add(s.id);
    }
  });
});
