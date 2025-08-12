/* @vitest-environment jsdom */
import { describe, it, expect } from "vitest";
import { buildStarElement, buildLinkElement } from "./dom";
import type { System, JumpType } from "../types";

describe("dom builders", () => {
  const base: Omit<System, "type"> = {
    id: 1,
    x: 0,
    y: 0,
    z: 0,
    sysName: "Sol",
    planetName: "Earth",
  };

  it("buildStarElement renders star/labels with correct classes for known type", () => {
    const sys: System = { ...base, type: ["G V"] };
    const { element, nameEl, planetEl } = buildStarElement(sys);
    expect(element.className).toBe("starDiv");
    // first child is img
    const img = element.querySelector("img")!;
    expect(img.className).toBe("g_star");
    expect((img as HTMLImageElement).src).toMatch(/G-star\.png$/);
    expect(nameEl.className).toBe("starText");
    expect(nameEl.textContent).toBe("Sol");
    expect(planetEl?.className).toBe("planetText");
    expect(planetEl?.textContent).toBe("Earth");
  });

  it("buildStarElement falls back to spark image when type missing", () => {
    const sys: System = { ...base, type: [] };
    const { element } = buildStarElement(sys);
    const img = element.querySelector("img") as HTMLImageElement;
    expect(img.className).toBe("");
    expect(img.src).toMatch(/spark1\.png$/);
  });

  it("buildLinkElement maps class and sets height", () => {
    const div = buildLinkElement("A" as JumpType, 42);
    expect(div.className).toBe("alpha");
    expect(div.style.height).toBe("42px");
  });
});
