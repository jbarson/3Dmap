import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import type { System } from "../types";

// Sprite sizes (scene units) keyed by first letter of spectral class
const STAR_SIZE: Record<string, number> = {
  A: 200,
  F: 160,
  G: 120,
  K: 100,
  M: 70,
  D: 50,
};

const DEFAULT_STAR_SIZE = 80;

// Spectral colours: [core rgba, mid rgba] — outer edge is always transparent
const STAR_COLORS: Record<string, [string, string]> = {
  A: ["rgba(220,230,255,1)", "rgba(100,140,255,0.6)"], // blue-white
  F: ["rgba(255,255,230,1)", "rgba(255,240,140,0.6)"], // yellow-white
  G: ["rgba(255,255,200,1)", "rgba(255,200,50,0.6)"], // yellow  (Sun-like)
  K: ["rgba(255,220,160,1)", "rgba(255,130,40,0.6)"], // orange
  M: ["rgba(255,180,160,1)", "rgba(220,60,30,0.6)"], // red
  D: ["rgba(210,220,255,1)", "rgba(120,140,200,0.6)"], // blue-grey dwarf
};
const DEFAULT_STAR_COLORS: [string, string] = ["rgba(255,255,255,1)", "rgba(180,180,180,0.6)"];

// Cache canvas textures by spectral type key
const canvasTextureCache = new Map<string, THREE.CanvasTexture>();

function makeStarTexture(starType: string | undefined): THREE.CanvasTexture {
  const key = (starType ?? "").trim().toUpperCase();
  let tex = canvasTextureCache.get(key);
  if (tex) return tex;

  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error(
      "makeStarTexture: Failed to obtain 2D rendering context. This environment may not support canvas.",
    );
  }
  const cx = size / 2;
  const r = size / 2;

  const [core, mid] = STAR_COLORS[key] ?? DEFAULT_STAR_COLORS;
  const transparentMid = mid.replace(
    /rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,[^)]+\)/,
    "rgba($1,$2,$3,0)",
  );
  const grad = ctx.createRadialGradient(cx, cx, 0, cx, cx, r);
  grad.addColorStop(0, "rgba(255,255,255,1)"); // pure white hot centre
  grad.addColorStop(0.15, core);
  grad.addColorStop(0.45, mid);
  grad.addColorStop(1, transparentMid);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  tex = new THREE.CanvasTexture(canvas);
  canvasTextureCache.set(key, tex);
  return tex;
}

export function buildStarSprite(
  system: System,
  onClick: () => void,
): {
  sprite: THREE.Sprite;
  label: CSS2DObject;
  planetLabel?: CSS2DObject;
} {
  const starType = system.type?.[0]?.[0]?.toUpperCase();
  const texture = makeStarTexture(starType);
  const material = new THREE.SpriteMaterial({
    map: texture,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
  });
  const sprite = new THREE.Sprite(material);
  const size = STAR_SIZE[starType ?? ""] ?? DEFAULT_STAR_SIZE;
  sprite.scale.setScalar(size);

  // Star name label
  const nameDiv = document.createElement("div");
  nameDiv.className = "starLabel";
  nameDiv.textContent = system.sysName;
  nameDiv.setAttribute("role", "button");
  nameDiv.tabIndex = 0;
  nameDiv.addEventListener("click", onClick);
  nameDiv.addEventListener("keydown", (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  });
  const label = new CSS2DObject(nameDiv);
  // Anchor at star center; center=(0.5,0) means top-edge of div is at the
  // projected screen point, so the label always appears below the star.
  label.position.set(0, 0, 0);
  label.center.set(0.5, 0);
  sprite.add(label);

  // Optional planet label
  let planetLabel: CSS2DObject | undefined;
  if (system.planetName) {
    const planetDiv = document.createElement("div");
    planetDiv.className = "planetLabel";
    planetDiv.textContent = system.planetName;
    planetDiv.setAttribute("role", "button");
    planetDiv.tabIndex = 0;
    planetDiv.addEventListener("click", onClick);
    planetDiv.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick();
      }
    });
    planetLabel = new CSS2DObject(planetDiv);
    planetLabel.position.set(0, 0, 0);
    planetLabel.center.set(0.5, 0);
    sprite.add(planetLabel);
  }

  return { sprite, label, planetLabel };
}

/**
 * Returns true when a label style string has changed from its cached value,
 * indicating a DOM write is needed. Pure function for testability.
 */
export function labelStyleChanged(cached: string | undefined, next: string): boolean {
  return cached !== next;
}

/**
 * Computes the CSS margin-top (px) to push a label just below the star's
 * visible edge. Pure function so it can be unit-tested independently.
 *
 * @param spriteScaleX  sprite.scale.x (world-space sprite diameter)
 * @param viewHeight    viewport height in pixels
 * @param dist          distance from camera to sprite in world units
 * @param tanHalfFov    Math.tan(cameraFovDegrees * Math.PI / 360)
 * @param fontSize      current label font size in px (used to stack planet label)
 */
export function computeLabelMarginTop(
  spriteScaleX: number,
  viewHeight: number,
  dist: number,
  tanHalfFov: number,
): number {
  const screenRadius = (spriteScaleX * viewHeight) / (8 * dist * tanHalfFov);
  return Math.round(screenRadius + 4);
}
