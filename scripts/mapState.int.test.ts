/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach } from "vitest";
import { MapStateImpl } from "./mapState";
import type { System, Jump, JumpType } from "./types";
import { VISIBILITY_DISTANCE } from "./config";

// Minimal DOM container expected by init()
beforeEach(() => {
  document.body.innerHTML = '<div id="container"></div>';
});

function makeSystem(id: number, x: number, y: number, z: number, name: string): System {
  return { id, x, y, z, type: ["G V"], sysName: name } as System;
}

function makeJump(from: number, to: number, t: JumpType, year = 0): Jump {
  return { bridge: [from, to], type: t, year };
}

describe("MapStateImpl integration", () => {
  it("init builds stars and links; render toggles label visibility by distance", () => {
    const systems: System[] = [makeSystem(1, 0, 0, 0, "A"), makeSystem(2, 1, 0, 0, "B")];
    const jumps: Jump[] = [makeJump(1, 2, "A")];

    const map = new MapStateImpl(systems, jumps);
    map.init();

    // Systems and one link are created
    expect(map.systems.length).toBe(2);
    expect(map.links.length).toBe(1);

    // Position camera near the first system (closer than VISIBILITY_DISTANCE)
    const nearZ = systems[0].z + (VISIBILITY_DISTANCE - 1);
    map.camera.position.set(systems[0].x, systems[0].y, nearZ);

    map.render();

    // First system's labels should be invis, second should be visible (starText/planetText)
    type LabelEntry = { nameEl: HTMLDivElement; planetEl?: HTMLDivElement };
    type LabelRefs = WeakMap<object, LabelEntry>;
    const labelRefs = (map as unknown as { labelRefs: LabelRefs }).labelRefs;
    const firstLabels = labelRefs.get(map.systems[0])!;
    const secondLabels = labelRefs.get(map.systems[1])!;
    expect(firstLabels.nameEl.className).toBe("invis");
    if (firstLabels.planetEl) expect(firstLabels.planetEl.className).toBe("invis");
    expect(secondLabels.nameEl.className).toBe("starText");
    if (secondLabels.planetEl) expect(secondLabels.planetEl.className).toBe("planetText");

    // Move camera far away so both are visible
    map.camera.position.set(0, 0, VISIBILITY_DISTANCE * 10);
    map.render();
    const firstLabels2 = labelRefs.get(map.systems[0])!;
    const secondLabels2 = labelRefs.get(map.systems[1])!;
    expect(firstLabels2.nameEl.className).toBe("starText");
    if (firstLabels2.planetEl) expect(firstLabels2.planetEl.className).toBe("planetText");
    expect(secondLabels2.nameEl.className).toBe("starText");
    if (secondLabels2.planetEl) expect(secondLabels2.planetEl.className).toBe("planetText");
  });
});
