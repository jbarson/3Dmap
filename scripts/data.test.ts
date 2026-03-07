import { describe, it, expect } from "vitest";
import { validateData } from "./types";
import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";

describe("data integrity", () => {
  it("all jump endpoints reference valid system IDs", () => {
    const result = validateData(systemsArr, jumpList);
    if (!result.valid) {
      const details = result.invalidJumps
        .map(
          (j) =>
            `  [${j.bridge}] type=${j.type} year=${j.year} (from=${j.fromFound ? "ok" : "MISSING"}, to=${j.toFound ? "ok" : "MISSING"})`,
        )
        .join("\n");
      throw new Error(`${result.invalidCount} invalid jump(s):\n${details}`);
    }
    expect(result.valid).toBe(true);
  });

  it("system IDs are unique", () => {
    const ids = systemsArr.map((s) => s.id);
    const unique = new Set(ids);
    expect(unique.size).toBe(ids.length);
  });

  it("all systems have valid coordinates (finite numbers)", () => {
    for (const s of systemsArr) {
      expect(Number.isFinite(s.x), `${s.sysName} x`).toBe(true);
      expect(Number.isFinite(s.y), `${s.sysName} y`).toBe(true);
      expect(Number.isFinite(s.z), `${s.sysName} z`).toBe(true);
    }
  });

  it("all jumps have a year between 2100 and 2300", () => {
    for (const j of jumpList) {
      expect(j.year, `jump [${j.bridge}]`).toBeGreaterThanOrEqual(2100);
      expect(j.year, `jump [${j.bridge}]`).toBeLessThanOrEqual(2300);
    }
  });

  it("all jump types are valid", () => {
    const validTypes = new Set(["A", "B", "G", "D", "E"]);
    for (const j of jumpList) {
      expect(validTypes.has(j.type), `jump [${j.bridge}] type="${j.type}"`).toBe(true);
    }
  });
});
