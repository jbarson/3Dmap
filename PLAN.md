# Plan: Migrate to WebGL Renderer + Visual Refresh

## Overview

Replace the CSS3DRenderer with Three.js's **WebGLRenderer** for GPU-accelerated 3D rendering
and a significantly nicer visual result. Labels are kept as HTML using the lightweight
**CSS2DRenderer** overlay (a well-supported Three.js pattern for mixed scenes). Stars become
GPU **Sprites**, links become **Lines**, and a procedural starfield background is added.

---

## Architecture Change Summary

| Concern         | Before (CSS3D)                         | After (WebGL)                                    |
|-----------------|----------------------------------------|--------------------------------------------------|
| Renderer        | CSS3DRenderer                          | WebGLRenderer + CSS2DRenderer overlay            |
| Stars           | `<div>` + `<img>` PNG via CSS3DObject  | THREE.Sprite with SpriteMaterial (PNG textures)  |
| Links           | `<div>` sized/colored via CSS          | THREE.LineSegments (BufferGeometry)              |
| Labels          | `<div>` children of the star div       | CSS2DObject (HTML div, projected by CSS2DRenderer) |
| Visibility      | `classList.toggle('hidden')`           | `object.visible = false`                         |
| Highlight       | CSS `drop-shadow` filter               | Additive glow sprite layered over the star       |
| Background      | Black `body` background                | THREE.Points starfield (random positions)        |
| Toggle undiscovered | `classList.add('undiscovered')`    | `material.opacity = 0` + transition via animate  |

---

## Step-by-Step Plan

### Step 1 — Add CSS2DRenderer and update `index.html`

**File:** `index.html`

- Add a second `<div id="labels"></div>` container, positioned absolutely to fill the viewport,
  sitting above the WebGL canvas with `pointer-events: none` so it doesn't block mouse input.
- The CSS2DRenderer will target this container.

**File:** `css/style.css`

- Remove all `.starDiv`, `.a_star`, `.f_star` etc., `.jumpLink`, `.alpha`, `.beta` … `.epsilon`,
  `.undiscovered`, `.hidden` rules (these are CSS3D artefacts).
- Add styles for `.label` (star name), `.planetLabel`, and `#labels` overlay div.
- Keep `.invis`, `.highlighted`, `.searchDiv`, and all UI panel rules.

---

### Step 2 — Replace renderer setup in `mapState.ts`

Remove imports of `CSS3DObject` and `CSS3DRenderer`.
Add imports of `CSS2DObject`, `CSS2DRenderer` from `three/examples/jsm/renderers/CSS2DRenderer.js`.

Change class fields:
- Remove `systems: CSS3DObject[]`, `links: CSS3DObject[]`, and per-type link arrays typed as
  `CSS3DObject[]`.
- Add `systems: THREE.Sprite[]`, `links: THREE.Line[]`, and per-type arrays typed as
  `THREE.Line[]`.
- Add `private labelRenderer: CSS2DRenderer`.
- Add `private glowSprite: THREE.Sprite | null = null` for the search-highlight effect.
- Keep `labelRefs` WeakMap but keyed on `THREE.Sprite` instead of `CSS3DObject`.

Update `MapState` type in `types.ts` accordingly.

---

### Step 3 — Replace star building (`utils/dom.ts` → `utils/scene.ts`)

Create `scripts/utils/scene.ts` (replaces `utils/dom.ts`):

```
buildStarSprite(system: System): {
  sprite: THREE.Sprite,
  label: CSS2DObject,
  planetLabel?: CSS2DObject
}
```

- Load each star PNG as a `THREE.TextureLoader` texture (one texture per spectral class,
  cached in a `Map<string, THREE.Texture>`).
- Create a `THREE.SpriteMaterial` with the texture and `sizeAttenuation: true`.
- Set sprite scale based on spectral class (A = 400, F = 320, G = 180, K = 150, M = 90,
  D = 60) — similar proportions to current CSS sizes.
- Create a `CSS2DObject` wrapping a `<div class="label">` for the system name.
- If `planetName` exists, create a second `CSS2DObject` for the planet label, offset slightly
  below the first.
- Return `{ sprite, label, planetLabel? }`.

**File:** `utils/dom.ts`

- Remove `buildStarElement` and `buildLinkElement` (no longer used).
- Keep only if any other utilities remain; otherwise delete the file.

---

### Step 4 — Replace link building in `mapState.ts`

Replace `buildLinkElement` calls with direct `THREE.Line` construction:

```typescript
const points = [startPos.clone(), endPos.clone()];
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const material = new THREE.LineBasicMaterial({
  color: JUMP_TYPE_COLOR[jumpType],   // new color constant map
  transparent: true,
  opacity: 1.0,
});
const line = new THREE.Line(geometry, material);
```

Add `JUMP_TYPE_COLOR` constant map to `config.ts`:

```typescript
export const JUMP_TYPE_COLOR: Record<JumpType, number> = {
  A: 0x4444ff,   // blue
  B: 0x9933cc,   // purple
  G: 0xe68949,   // orange
  D: 0xfae75e,   // yellow
  E: 0x65b657,   // green
};
```

No `LINK_SHRINK` is needed since lines are not divs that visually overlap sprites.

---

### Step 5 — Replace renderer init in `mapState.init()`

```typescript
// WebGL renderer
this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
this.renderer.setPixelRatio(window.devicePixelRatio);
this.renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById("container")!.appendChild(this.renderer.domElement);

// CSS2D label renderer
this.labelRenderer = new CSS2DRenderer();
this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
this.labelRenderer.domElement.style.position = "absolute";
this.labelRenderer.domElement.style.top = "0";
this.labelRenderer.domElement.style.pointerEvents = "none";
document.getElementById("labels")!.appendChild(this.labelRenderer.domElement);

// TrackballControls target the WebGL canvas
this.controls = new TrackballControls(this.camera, this.renderer.domElement);
```

---

### Step 6 — Add procedural starfield background

In `mapState.init()`, after the scene is created, add a background starfield:

```typescript
const starCount = 2000;
const positions = new Float32Array(starCount * 3);
for (let i = 0; i < starCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 60000;
}
const bgGeometry = new THREE.BufferGeometry();
bgGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
const bgMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 8, sizeAttenuation: true });
this.scene.add(new THREE.Points(bgGeometry, bgMaterial));
```

---

### Step 7 — Update `render()` loop

```typescript
render = () => {
  const cam = this.camera;
  const camPos = cam.position;
  const visDistSq = VISIBILITY_DISTANCE * VISIBILITY_DISTANCE;

  for (const sprite of this.systems) {
    const labels = this.labelRefs.get(sprite);
    if (labels) {
      const nearCamera = sprite.position.distanceToSquared(camPos) < visDistSq;
      labels.label.element.className = nearCamera ? "invis" : "label";
      if (labels.planetLabel) {
        labels.planetLabel.element.className = nearCamera ? "invis" : "planetLabel";
      }
    }
  }

  this.renderer.render(this.scene, cam);
  this.labelRenderer.render(this.scene, cam);
};
```

- No more `sys.lookAt()` — sprites always face the camera automatically.
- No more manual `sys.up.copy(camUp)` — handled by the sprite.

---

### Step 8 — Update visibility toggling

Replace CSS class toggling with `object.visible`:

```typescript
private toggleLinksVisibility(list: THREE.Line[]) {
  for (const line of list) line.visible = !line.visible;
}
```

For the date slider (`undiscovered`), fade by setting `material.opacity`:

```typescript
// In app.ts date slider handler:
(line.material as THREE.LineBasicMaterial).opacity = jump.year >= dateVal ? 0 : 1;
```

---

### Step 9 — Update search highlight (`focusOnSystem`)

Replace CSS `drop-shadow` with an additive glow sprite layered over the found star:

```typescript
// On highlight: add a larger semi-transparent sprite at the same position
const glowTex = textureLoader.load("img/spark1.png");
const glowMat = new THREE.SpriteMaterial({
  map: glowTex,
  color: 0x88ccff,
  blending: THREE.AdditiveBlending,
  transparent: true,
  opacity: 0.6,
  depthWrite: false,
});
this.glowSprite = new THREE.Sprite(glowMat);
this.glowSprite.scale.setScalar(600);
this.glowSprite.position.copy(star.position);
this.scene.add(this.glowSprite);
```

On the next search, remove the old `glowSprite` from the scene before adding the new one.

---

### Step 10 — Update `onWindowResize`

```typescript
onWindowResize = () => {
  this.camera.aspect = window.innerWidth / window.innerHeight;
  this.camera.updateProjectionMatrix();
  this.renderer.setSize(window.innerWidth, window.innerHeight);
  this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
  this.render();
};
```

---

### Step 11 — Update `cleanup()`

Add disposal of geometries/materials and label renderer on cleanup to avoid memory leaks:

```typescript
cleanup = () => {
  for (const { element, event, handler } of this.eventListeners) {
    element.removeEventListener(event, handler);
  }
  this.eventListeners = [];
  // Dispose WebGL resources
  for (const sprite of this.systems) (sprite.material as THREE.SpriteMaterial).dispose();
  for (const line of this.links) {
    line.geometry.dispose();
    (line.material as THREE.LineBasicMaterial).dispose();
  }
  this.renderer.dispose();
};
```

---

### Step 12 — CSS polish

Update `css/style.css`:

- `.label`: white text, 20px, `text-shadow: 0 0 6px rgba(0,0,0,0.9)`, `pointer-events: none`.
- `.planetLabel`: italic, 15px, slightly dimmer.
- `#labels`: `position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none`.
- Remove all legacy CSS3D star/link rules.
- Keep `.invis`, UI panel rules, and search box styling unchanged.

---

## Files Changed

| File | Change |
|------|--------|
| `index.html` | Add `<div id="labels">` overlay |
| `css/style.css` | Remove CSS3D rules; add label overlay and `.label`/`.planetLabel` styles |
| `scripts/config.ts` | Add `JUMP_TYPE_COLOR` map; remove `LINK_SHRINK` |
| `scripts/types.ts` | Update `MapState` type (Sprite/Line instead of CSS3DObject) |
| `scripts/mapState.ts` | Replace CSS3DRenderer with WebGLRenderer + CSS2DRenderer; rewrite init/render/cleanup |
| `scripts/utils/scene.ts` | New file: `buildStarSprite()` replacing `buildStarElement()` |
| `scripts/utils/dom.ts` | Remove `buildStarElement` and `buildLinkElement`; delete if empty |
| `scripts/app.ts` | Update date-slider handler to set `material.opacity` instead of classList |

---

## Out of Scope (not in this plan)

- Smooth camera animation (tween library) — `focusOnSystem` will still teleport.
- Tooltip popups on hover.
- Custom GLSL shaders for stars.
- Replacing TrackballControls with OrbitControls.
