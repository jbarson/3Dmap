/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { System, Jump } from "./types";

// Mock TrackballControls with a lightweight test double that can emit events
vi.mock("three/examples/jsm/controls/TrackballControls.js", () => {
  class TrackballControlsMock {
    rotateSpeed = 0;
    dynamicDampingFactor = 0;
    maxDistance = 0;
    private handlers = new Map<string, EventListener>();
    constructor() {}
    addEventListener(ev: string, handler: EventListener) {
      this.handlers.set(ev, handler);
    }
    update() {}
    trigger(ev: string) {
      const h = this.handlers.get(ev);
      if (h) h(new Event(ev));
    }
  }
  return { TrackballControls: TrackballControlsMock };
});

import { MapStateImpl } from "./mapState";

const systems: System[] = [
  { id: 1, x: 0, y: 0, z: 0, type: ["G V"], sysName: "A" },
  { id: 2, x: 0, y: 0, z: 1, type: ["K V"], sysName: "B" },
  { id: 3, x: 0, y: 0, z: 2, type: ["M V"], sysName: "C" },
];

const jumps: Jump[] = [
  { bridge: [1, 2], type: "A", year: 2100 },
  { bridge: [2, 3], type: "D", year: 2101 },
];

beforeEach(() => {
  document.body.innerHTML = '<div id="container"></div>';
});

describe("MapStateImpl core behaviors", () => {
  it("init builds systems and categorizes links by type", () => {
    const map = new MapStateImpl(systems, jumps);
    map.init();
    expect(map.systems.length).toBe(systems.length);
    expect(map.links.length).toBe(jumps.length);
    // Types: one alpha (A) and one delta (D)
    expect(map.alphaLinks.length).toBe(1);
    expect(map.deltaLinks.length).toBe(1);
    expect(map.betaLinks.length + map.gammaLinks.length + map.epsiLinks.length).toBe(0);
  });

  it("toggle methods hide/show link elements via class toggle", () => {
    const map = new MapStateImpl(systems, jumps);
    map.init();
    const el = map.alphaLinks[0].element as HTMLDivElement;
    expect(el.classList.contains("hidden")).toBe(false);
    map.toggleAlpha();
    expect(el.classList.contains("hidden")).toBe(true);
    map.toggleAlpha();
    expect(el.classList.contains("hidden")).toBe(false);
  });

  it("controls change event triggers render", () => {
    const map = new MapStateImpl(systems, jumps);
    const renderSpy = vi.spyOn(map, "render");
    map.init();
    // @ts-expect-error using mock helper
    map.controls.trigger("change");
    expect(renderSpy).toHaveBeenCalled();
  });

  it("onWindowResize updates camera, renderer and calls render", () => {
    const map = new MapStateImpl(systems, jumps);
    map.init();
    const setSizeSpy = vi.spyOn(map.renderer, "setSize");
    const renderSpy = vi.spyOn(map, "render");

    // Simulate new window size
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 1234 });
    Object.defineProperty(window, "innerHeight", { configurable: true, value: 567 });

    map.onWindowResize();
    expect(map.camera.aspect).toBeCloseTo(1234 / 567);
    expect(setSizeSpy).toHaveBeenCalledWith(1234, 567);
    expect(renderSpy).toHaveBeenCalled();
  });

  it("animate schedules raf, updates controls, and renders once", () => {
    const map = new MapStateImpl(systems, jumps);
    map.init();
    const rafSpy = vi
      .spyOn(globalThis, "requestAnimationFrame")
      .mockImplementation(() => 1 as unknown as number);
    const updateSpy = vi.spyOn(map.controls, "update");
    const renderSpy = vi.spyOn(map, "render");
    map.animate();
    expect(rafSpy).toHaveBeenCalled();
    expect(updateSpy).toHaveBeenCalled();
    expect(renderSpy).toHaveBeenCalled();
  });

  it("cleanup removes registered event listeners", () => {
    const map = new MapStateImpl(systems, jumps);
    const removeSpy = vi.spyOn(window, "removeEventListener");
    map.init();
    map.cleanup();
    // At least the debounced resize listener should be removed
    expect(removeSpy).toHaveBeenCalled();
  });
});
