import { describe, it, expect, vi } from "vitest";
import { buildSystemIdSet, validateData, JUMP_TYPE_CLASS, type JumpType } from "./types";

describe("types utils", () => {
  it("buildSystemIdSet returns a set of ids", () => {
    const ids = buildSystemIdSet([
      { id: 1, x: 0, y: 0, z: 0, type: ["G"], sysName: "A" },
      { id: 2, x: 0, y: 0, z: 0, type: ["K"], sysName: "B" },
    ]);
    expect(ids.has(1)).toBe(true);
    expect(ids.has(2)).toBe(true);
    expect(ids.has(3)).toBe(false);
  });

  it("validateData marks valid when all jump endpoints exist", () => {
    const systems = [
      { id: 1, x: 0, y: 0, z: 0, type: ["G"], sysName: "A" },
      { id: 2, x: 0, y: 0, z: 0, type: ["K"], sysName: "B" },
    ];
    const jumps = [{ bridge: [1, 2] as [number, number], type: "A" as JumpType, year: 1000 }];
    const res = validateData(systems, jumps);
    expect(res.valid).toBe(true);
    expect(res.invalidCount).toBe(0);
    expect(res.invalidJumps).toHaveLength(0);
  });

  it("validateData reports invalid with structured detail and warns", () => {
    const systems = [{ id: 1, x: 0, y: 0, z: 0, type: ["G"], sysName: "A" }];
    const jumps = [{ bridge: [1, 3] as [number, number], type: "B" as JumpType, year: 1001 }];
    const spy = vi.spyOn(console, "warn").mockImplementation(() => { });
    const res = validateData(systems, jumps);
    expect(res.valid).toBe(false);
    expect(res.invalidCount).toBe(1);
    expect(res.invalidJumps[0]).toMatchObject({
      bridge: [1, 3],
      fromFound: true,
      toFound: false,
      type: "B",
      year: 1001,
    });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("JUMP_TYPE_CLASS maps each JumpType to a class", () => {
    const all: JumpType[] = ["A", "B", "G", "D", "E"];
    for (const t of all) {
      expect(JUMP_TYPE_CLASS[t]).toBeTruthy();
    }
  });
});
