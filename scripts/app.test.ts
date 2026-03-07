import { expect, test, describe, vi } from "vitest";
import { debounce } from "./utils/debounce";
import { MapStateImpl } from "./mapState";
import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";

test("sanity check", () => {
  expect(true).toBe(true);
});

describe("MapStateImpl construction order", () => {
  test("links array is accessible immediately after construction, before init()", () => {
    // Regression: mapState was previously declared after event listeners were
    // registered, so the slider change handler could reference an uninitialised
    // binding. mapState must be constructed first so .links is always reachable.
    const instance = new MapStateImpl(systemsArr, jumpList);
    expect(instance.links).toBeDefined();
    expect(Array.isArray(instance.links)).toBe(true);
  });

  test("systems array is accessible immediately after construction", () => {
    const instance = new MapStateImpl(systemsArr, jumpList);
    expect(instance.systems).toBeDefined();
    expect(Array.isArray(instance.systems)).toBe(true);
  });
});

test("debounce function delays execution and only calls function once after multiple rapid calls", async () => {
  const mockFunction = vi.fn();
  const debouncedFunction = debounce(mockFunction, 100);

  // Call the debounced function multiple times rapidly
  debouncedFunction();
  debouncedFunction();
  debouncedFunction();

  // The function should not have been called yet
  expect(mockFunction).not.toHaveBeenCalled();

  // Wait for half the debounce delay
  await new Promise((resolve) => setTimeout(resolve, 50));
  expect(mockFunction).not.toHaveBeenCalled();

  // Wait for the full debounce delay plus a bit more
  await new Promise((resolve) => setTimeout(resolve, 100));

  // Now the function should have been called exactly once
  expect(mockFunction).toHaveBeenCalledTimes(1);
});

test("debounce function resets timer on subsequent calls", async () => {
  const mockFunction = vi.fn();
  const debouncedFunction = debounce(mockFunction, 100);

  // Call the function
  debouncedFunction();

  // Wait for 75ms (less than the delay)
  await new Promise((resolve) => setTimeout(resolve, 75));

  // Call again - this should reset the timer
  debouncedFunction();

  // Wait another 75ms (total 150ms from first call, but only 75ms from second)
  await new Promise((resolve) => setTimeout(resolve, 75));

  // Function should not have been called yet because the timer was reset
  expect(mockFunction).not.toHaveBeenCalled();

  // Wait another 50ms to complete the second debounce period
  await new Promise((resolve) => setTimeout(resolve, 50));

  // Now it should have been called once
  expect(mockFunction).toHaveBeenCalledTimes(1);
});
