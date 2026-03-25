import { expect, test, describe, beforeEach } from "vitest";
import { showSystemDetail, setupSystemDetailPanel } from "./app";
import type { System } from "./types";

describe("System Detail Panel Accessibility", () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <button id="opener">Open</button>
      <div id="systemDetail" hidden>
        <button id="systemDetailClose">Close</button>
        <div id="systemDetailContent"></div>
      </div>
    `;
    setupSystemDetailPanel();
  });

  const mockSystem: System = {
    id: 1,
    sysName: "Sol",
    x: 0,
    y: 0,
    z: 0,
    type: ["G"],
    planetName: "Earth",
  };

  test("should move focus to close button when opened", () => {
    const opener = document.getElementById("opener") as HTMLButtonElement;
    opener.focus();
    expect(document.activeElement).toBe(opener);

    showSystemDetail(mockSystem, [], [mockSystem]);

    const closeBtn = document.getElementById("systemDetailClose");
    expect(document.activeElement).toBe(closeBtn);
  });

  test("should restore focus to opener when closed via click", () => {
    const opener = document.getElementById("opener") as HTMLButtonElement;
    opener.focus();

    showSystemDetail(mockSystem, [], [mockSystem]);

    const closeBtn = document.getElementById("systemDetailClose") as HTMLButtonElement;
    closeBtn.click();

    expect(document.activeElement).toBe(opener);
    expect(document.getElementById("systemDetail")?.hidden).toBe(true);
  });

  test("should close and restore focus on Escape key", () => {
    const opener = document.getElementById("opener") as HTMLButtonElement;
    opener.focus();

    showSystemDetail(mockSystem, [], [mockSystem]);
    expect(document.getElementById("systemDetail")?.hidden).toBe(false);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

    expect(document.getElementById("systemDetail")?.hidden).toBe(true);
    expect(document.activeElement).toBe(opener);
  });

  test("should not close on Escape if already hidden", () => {
    const panel = document.getElementById("systemDetail");
    expect(panel?.hidden).toBe(true);

    // This is a bit hard to test without spying on closePanel,
    // but we can check if it doesn't crash or change state unexpectedly.
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(panel?.hidden).toBe(true);
  });
});
