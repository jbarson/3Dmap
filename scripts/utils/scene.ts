import * as THREE from "three";
import { CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import type { System } from "../types";

// Sprite sizes (scene units) keyed by first letter of spectral class
const STAR_SIZE: Record<string, number> = {
  A: 400,
  F: 320,
  G: 180,
  K: 150,
  M: 90,
  D: 60,
};

const DEFAULT_STAR_SIZE = 100;

// One shared TextureLoader instance; cache textures so each PNG is loaded once
const textureLoader = new THREE.TextureLoader();
const textureCache = new Map<string, THREE.Texture>();

function loadTexture(src: string): THREE.Texture {
  let tex = textureCache.get(src);
  if (!tex) {
    tex = textureLoader.load(src);
    textureCache.set(src, tex);
  }
  return tex;
}

function starTextureSrc(starType: string | undefined): string {
  const t = starType?.toUpperCase();
  if (t === "A") return "img/A-star.png";
  if (t === "F") return "img/F-star.png";
  if (t === "G") return "img/G-star.png";
  if (t === "K") return "img/K-star.png";
  if (t === "M") return "img/M-star.png";
  if (t === "D") return "img/D-star.png";
  return "img/spark1.png";
}

export function buildStarSprite(system: System): {
  sprite: THREE.Sprite;
  label: CSS2DObject;
  planetLabel?: CSS2DObject;
} {
  const starType = system.type?.[0]?.[0]?.toUpperCase();
  const src = starTextureSrc(starType);
  const texture = loadTexture(src);
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
    planetLabel = new CSS2DObject(planetDiv);
    planetLabel.position.set(0, 0, 0);
    planetLabel.center.set(0.5, 0);
    sprite.add(planetLabel);
  }

  return { sprite, label, planetLabel };
}
