// Centralized configuration for numeric parameters used across the map.
// Replaces magic numbers to improve readability and maintainability.

export const STAR_SCALE = 200; // scale factor for system coordinates → scene units

export const CAMERA_FOV = 60;
export const CAMERA_NEAR = 1;
export const CAMERA_FAR = 75000;
export const CAMERA_START_Z = 5000;

export const LINK_SHRINK = 25; // shorten visible link to avoid intersecting star sprites

export const VISIBILITY_DISTANCE = 500; // distance threshold to hide labels near camera

export const CONTROLS_ROTATE_SPEED = 1.0;
export const CONTROLS_DAMPING = 0.3;
export const CONTROLS_MAX_DISTANCE = 7500;

// (Intentionally no grouped export to avoid duplicating patterns)
