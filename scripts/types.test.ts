import { describe, it, expect } from "vitest";
import { buildSystemIdSet, validateData } from "./types";
import type { System, Jump } from "./types";

const mockSystems: System[] = [
  { id: 1, x: 0, y: 0, z: 0, type: ["G V"], sysName: "Sol" },
  { id: 2, x: 1, y: 0, z: 0, type: ["M V"], sysName: "Proxima" },
  { id: 3, x: 2, y: 0, z: 0, type: ["K V"], sysName: "Alpha" },
];

describe("buildSystemIdSet", () => {
  it("contains all system IDs", () => {
    const result = buildSystemIdSet(mockSystems);
    expect(result.size).toBe(3);
    expect(result.has(1)).toBe(true);
    expect(result.has(2)).toBe(true);
    expect(result.has(3)).toBe(true);
  });

  it("does not contain unlisted IDs", () => {
    const result = buildSystemIdSet(mockSystems);
    expect(result.has(99)).toBe(false);
  });

  it("returns empty Set for empty array", () => {
    expect(buildSystemIdSet([]).size).toBe(0);
  });
});

describe("validateData", () => {
  it("returns valid when all jump endpoints exist", () => {
    const jumps: Jump[] = [
      { bridge: [1, 2], type: "D", year: 2100 },
      { bridge: [2, 3], type: "G", year: 2101 },
    ];
    const result = validateData(mockSystems, jumps);
    expect(result.valid).toBe(true);
    expect(result.invalidCount).toBe(0);
    expect(result.invalidJumps).toHaveLength(0);
  });

  it("flags a jump with a missing from-ID", () => {
    const jumps: Jump[] = [{ bridge: [99, 2], type: "D", year: 2100 }];
    const result = validateData(mockSystems, jumps);
    expect(result.valid).toBe(false);
    expect(result.invalidCount).toBe(1);
    expect(result.invalidJumps[0].fromFound).toBe(false);
    expect(result.invalidJumps[0].toFound).toBe(true);
  });

  it("flags a jump with a missing to-ID", () => {
    const jumps: Jump[] = [{ bridge: [1, 99], type: "D", year: 2100 }];
    const result = validateData(mockSystems, jumps);
    expect(result.valid).toBe(false);
    expect(result.invalidCount).toBe(1);
    expect(result.invalidJumps[0].fromFound).toBe(true);
    expect(result.invalidJumps[0].toFound).toBe(false);
  });

  it("flags a jump where both IDs are missing", () => {
    const jumps: Jump[] = [{ bridge: [98, 99], type: "A", year: 2100 }];
    const result = validateData(mockSystems, jumps);
    expect(result.valid).toBe(false);
    expect(result.invalidJumps[0].fromFound).toBe(false);
    expect(result.invalidJumps[0].toFound).toBe(false);
  });

  it("counts multiple invalid jumps correctly", () => {
    const jumps: Jump[] = [
      { bridge: [1, 2], type: "D", year: 2100 },
      { bridge: [99, 2], type: "D", year: 2101 },
      { bridge: [1, 98], type: "D", year: 2102 },
    ];
    const result = validateData(mockSystems, jumps);
    expect(result.valid).toBe(false);
    expect(result.invalidCount).toBe(2);
  });

  it("returns valid for an empty jumps array", () => {
    const result = validateData(mockSystems, []);
    expect(result.valid).toBe(true);
    expect(result.invalidCount).toBe(0);
  });

  it("preserves bridge, type and year on invalid jump entries", () => {
    const jumps: Jump[] = [{ bridge: [99, 1], type: "E", year: 2150 }];
    const result = validateData(mockSystems, jumps);
    const bad = result.invalidJumps[0];
    expect(bad.bridge).toEqual([99, 1]);
    expect(bad.type).toBe("E");
    expect(bad.year).toBe(2150);
  });
});
