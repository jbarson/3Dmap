/* @vitest-environment jsdom */
import { describe, it, expect, beforeEach, vi } from "vitest";
import type { System, Jump } from "./types";

// Mock MapStateImpl to avoid three.js and capture interactions
const toggleCounters = {
  alpha: 0,
  beta: 0,
  gamma: 0,
  delta: 0,
  epsi: 0,
};

// Augment globalThis with a handle to our mock instance for assertions
declare global {
  var __testMapState: MapStateImplMock | undefined;
}

class MapStateImplMock {
  systems: System[] = [];
  links: Array<{ element: HTMLDivElement }>;
  linkTypes: HTMLInputElement[] = [];
  alphaCheckbox: HTMLInputElement | null = null;
  betaCheckbox: HTMLInputElement | null = null;
  gammaCheckbox: HTMLInputElement | null = null;
  deltaCheckbox: HTMLInputElement | null = null;
  epsiCheckbox: HTMLInputElement | null = null;
  initCalled = 0;
  animateCalled = 0;
  constructor(_systems: System[], jumps: Jump[]) {
    this.links = jumps.map(() => ({ element: document.createElement("div") }));
    // Expose instance for assertions
    globalThis.__testMapState = this;
  }
  init() {
    this.initCalled++;
  }
  animate() {
    this.animateCalled++;
  }
  toggleAlpha() {
    toggleCounters.alpha++;
  }
  toggleBeta() {
    toggleCounters.beta++;
  }
  toggleGamma() {
    toggleCounters.gamma++;
  }
  toggleDelta() {
    toggleCounters.delta++;
  }
  toggleEpsi() {
    toggleCounters.epsi++;
  }
}

vi.mock("./mapState", () => ({ MapStateImpl: MapStateImplMock }));

// Provide tiny data sets for predictable behavior
vi.mock("./jumpLinks", () => ({
  jumpList: [
    { bridge: [1, 2] as [number, number], type: "A" as const, year: 2000 },
    { bridge: [2, 3] as [number, number], type: "B" as const, year: 2100 },
  ],
}));

vi.mock("./systemsList", () => ({
  systemsArr: [
    { id: 1, x: 0, y: 0, z: 0, type: ["G V"], sysName: "A" },
    { id: 2, x: 1, y: 0, z: 0, type: ["K V"], sysName: "B" },
    { id: 3, x: 2, y: 0, z: 0, type: ["M V"], sysName: "C" },
  ],
}));

beforeEach(() => {
  document.body.innerHTML = `
    <div id="container"></div>
  <input id="dateSlider" type="range" min="2000" max="2200" />
    <div id="dateBox"></div>
    <input id="alphaLink" type="checkbox" />
    <input id="betaLink" type="checkbox" />
    <input id="gammaLink" type="checkbox" />
    <input id="deltaLink" type="checkbox" />
    <input id="epsiLink" type="checkbox" />
    <input id="allLinks" type="checkbox" />
  `;
  // reset counters
  toggleCounters.alpha = 0;
  toggleCounters.beta = 0;
  toggleCounters.gamma = 0;
  toggleCounters.delta = 0;
  toggleCounters.epsi = 0;
  delete globalThis.__testMapState;
});

describe("app bootstrap", () => {
  it("validates data, initializes map, and wires slider and checkboxes", async () => {
    const typesMod = await import("./types");
    const validateSpy = vi.spyOn(typesMod, "validateData");
    await import("./app");

    // Fire DOMContentLoaded to trigger bootstrap
    document.dispatchEvent(new Event("DOMContentLoaded"));

    // validateData should be called once
    expect(validateSpy).toHaveBeenCalledTimes(1);

    const map = globalThis.__testMapState!;
    expect(map).toBeTruthy();
    expect(map.initCalled).toBeGreaterThan(0);
    expect(map.animateCalled).toBeGreaterThan(0);
    const slider = document.getElementById("dateSlider") as HTMLInputElement;
    const box = document.getElementById("dateBox")!;
    slider.value = "2050";
    slider.dispatchEvent(new Event("change"));
    expect(box.textContent).toBe("2050");
    expect(map.links[0].element.classList.contains("undiscovered")).toBe(false);
    expect(map.links[1].element.classList.contains("undiscovered")).toBe(true);

    // Toggling allLinks should dispatch change events on all individual checkboxes
    const all = document.getElementById("allLinks") as HTMLInputElement;
    all.checked = true;
    all.dispatchEvent(new Event("change"));
    expect(toggleCounters.alpha).toBe(1);
    expect(toggleCounters.beta).toBe(1);
    expect(toggleCounters.gamma).toBe(1);
    expect(toggleCounters.delta).toBe(1);
    expect(toggleCounters.epsi).toBe(1);

    // Uncheck flips them again
    all.checked = false;
    all.dispatchEvent(new Event("change"));
    expect(toggleCounters.alpha).toBe(2);
    expect(toggleCounters.beta).toBe(2);
    expect(toggleCounters.gamma).toBe(2);
    expect(toggleCounters.delta).toBe(2);
    expect(toggleCounters.epsi).toBe(2);
  });
});
