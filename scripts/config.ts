// Centralized configuration for numeric parameters used across the map.
// Replaces magic numbers to improve readability and maintainability.

export const STAR_SCALE = 200; // scale factor for system coordinates → scene units

export const CAMERA_FOV = 60;
export const CAMERA_NEAR = 1;
export const CAMERA_FAR = 75000;
export const CAMERA_START_Z = 5000;

export const VISIBILITY_DISTANCE = 500; // distance threshold to hide labels near camera

export const CONTROLS_ROTATE_SPEED = 1.0;
export const CONTROLS_DAMPING = 0.3;
export const CONTROLS_MAX_DISTANCE = 7500;

export const RESIZE_DEBOUNCE_DELAY = 100; // ms delay for debounced window resize handling

import type { JumpType } from "./types";
// WebGL line colors keyed by jump type
export const JUMP_TYPE_COLOR: Record<JumpType, number> = {
  A: 0x4466ff, // blue  (alpha)
  B: 0xaa33cc, // purple (beta)
  G: 0xe68949, // orange (gamma)
  D: 0xfae75e, // yellow (delta)
  E: 0x65b657, // green  (epsilon)
};

// Individual exports are used to allow selective imports and avoid unnecessary coupling between configuration parameters.
