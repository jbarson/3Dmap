import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import type { Jump, MapState, System, JumpType } from "./types";
import { buildStarSprite, computeLabelMarginTop } from "./utils/scene";
import { debounce, type DebouncedFn } from "./utils/debounce";
import {
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_START_Z,
  CONTROLS_DAMPING,
  CONTROLS_MAX_DISTANCE,
  CONTROLS_ROTATE_SPEED,
  JUMP_TYPE_COLOR,
  RESIZE_DEBOUNCE_DELAY,
  STAR_SCALE,
  VISIBILITY_DISTANCE,
} from "./config";

export class MapStateImpl implements MapState {
  systems: THREE.Sprite[] = [];
  links: THREE.Line[] = [];
  alphaLinks: THREE.Line[] = [];
  betaLinks: THREE.Line[] = [];
  gammaLinks: THREE.Line[] = [];
  deltaLinks: THREE.Line[] = [];
  epsiLinks: THREE.Line[] = [];
  linkTypes: HTMLInputElement[] = [];
  alphaCheckbox: HTMLInputElement | null = null;
  betaCheckbox: HTMLInputElement | null = null;
  gammaCheckbox: HTMLInputElement | null = null;
  deltaCheckbox: HTMLInputElement | null = null;
  epsiCheckbox: HTMLInputElement | null = null;
  Scale = STAR_SCALE;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: THREE.WebGLRenderer;
  controls!: TrackballControls;

  private labelRenderer!: CSS2DRenderer;
  private systemsData: System[];
  private jumpData: Jump[];
  private debouncedResize: DebouncedFn<() => void>;
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListener }> =
    [];
  // Maps sprite → its CSS2DObject label elements for visibility toggling
  private labelRefs = new WeakMap<
    THREE.Sprite,
    {
      label: import("three/examples/jsm/renderers/CSS2DRenderer.js").CSS2DObject;
      planetLabel?: import("three/examples/jsm/renderers/CSS2DRenderer.js").CSS2DObject;
    }
  >();
  private glowSprite: THREE.Sprite | null = null;

  // Derived constants — computed once from config, reused every frame
  private readonly tanHalfFov = Math.tan((CAMERA_FOV * Math.PI) / 360);
  private readonly visDistSq = VISIBILITY_DISTANCE * VISIBILITY_DISTANCE;
  private bgPoints: THREE.Points | null = null;
  private typeMaterials = new Map<JumpType, THREE.LineBasicMaterial>();

  constructor(systemsArr: System[], jumpList: Jump[]) {
    this.systemsData = systemsArr;
    this.jumpData = jumpList;
    this.debouncedResize = debounce(this.onWindowResize, RESIZE_DEBOUNCE_DELAY);
  }

  private toggleLinksVisibility(list: THREE.Line[]) {
    for (const line of list) line.visible = !line.visible;
  }

  private addEventListener(element: EventTarget, event: string, handler: EventListener) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  cleanup = () => {
    this.debouncedResize.cancel();
    for (const { element, event, handler } of this.eventListeners) {
      element.removeEventListener(event, handler);
    }
    this.eventListeners = [];
    this.controls.dispose();
    for (const sprite of this.systems) {
      (sprite.material as THREE.SpriteMaterial).dispose();
    }
    for (const line of this.links) {
      line.geometry.dispose();
    }
    // Dispose shared per-type materials
    for (const mat of this.typeMaterials.values()) {
      mat.dispose();
    }
    if (this.glowSprite) {
      this.scene.remove(this.glowSprite);
      (this.glowSprite.material as THREE.SpriteMaterial).dispose();
      this.glowSprite = null;
    }
    if (this.bgPoints) {
      this.bgPoints.geometry.dispose();
      (this.bgPoints.material as THREE.PointsMaterial).dispose();
    }
    this.renderer.domElement.remove();
    this.labelRenderer.domElement.remove();
    this.renderer.dispose();
  };

  toggleAlpha = () => this.toggleLinksVisibility(this.alphaLinks);
  toggleBeta = () => this.toggleLinksVisibility(this.betaLinks);
  toggleGamma = () => this.toggleLinksVisibility(this.gammaLinks);
  toggleDelta = () => this.toggleLinksVisibility(this.deltaLinks);
  toggleEpsi = () => this.toggleLinksVisibility(this.epsiLinks);

  init = () => {
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      CAMERA_NEAR,
      CAMERA_FAR,
    );
    this.camera.position.z = CAMERA_START_Z;
    this.scene = new THREE.Scene();

    // --- WebGL renderer ---
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.top = "0";
    this.renderer.domElement.style.left = "0";
    const container = document.getElementById("container");
    if (container) container.appendChild(this.renderer.domElement);

    // --- CSS2D label renderer ---
    this.labelRenderer = new CSS2DRenderer();
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.domElement.style.position = "absolute";
    this.labelRenderer.domElement.style.top = "0";
    this.labelRenderer.domElement.style.left = "0";
    this.labelRenderer.domElement.style.pointerEvents = "none";
    const labelsContainer = document.getElementById("labels");
    if (labelsContainer) labelsContainer.appendChild(this.labelRenderer.domElement);

    // --- Background starfield ---
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 60000;
    }
    const bgGeometry = new THREE.BufferGeometry();
    bgGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const bgMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 10,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
    });
    this.bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    this.scene.add(this.bgPoints);

    // --- Star sprites ---
    for (const system of this.systemsData) {
      const built = buildStarSprite(system);
      built.sprite.position.set(
        system.x * this.Scale,
        system.y * this.Scale,
        system.z * this.Scale,
      );
      this.scene.add(built.sprite);
      this.systems.push(built.sprite);
      this.labelRefs.set(built.sprite, { label: built.label, planetLabel: built.planetLabel });
    }

    // --- Jump links as Lines ---
    const idToIndex = new Map<number, number>();
    for (let idx = 0; idx < this.systemsData.length; idx++) {
      idToIndex.set(this.systemsData[idx].id, idx);
    }

    const typeToList: Record<JumpType, THREE.Line[]> = {
      A: this.alphaLinks,
      B: this.betaLinks,
      G: this.gammaLinks,
      D: this.deltaLinks,
      E: this.epsiLinks,
    };

    for (const jump of this.jumpData) {
      const fromIdx = idToIndex.get(jump.bridge[0]);
      const toIdx = idToIndex.get(jump.bridge[1]);
      if (fromIdx === undefined || toIdx === undefined) continue;

      const startPos = this.systems[fromIdx].position;
      const endPos = this.systems[toIdx].position;
      const points = [startPos.clone(), endPos.clone()];
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      if (!this.typeMaterials.has(jump.type)) {
        this.typeMaterials.set(
          jump.type,
          new THREE.LineBasicMaterial({
            color: JUMP_TYPE_COLOR[jump.type],
            transparent: true,
            opacity: 1.0,
          }),
        );
      }
      const line = new THREE.Line(geometry, this.typeMaterials.get(jump.type)!);
      typeToList[jump.type].push(line);
      this.scene.add(line);
      this.links.push(line);
    }

    // --- Controls ---
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = CONTROLS_ROTATE_SPEED;
    this.controls.dynamicDampingFactor = CONTROLS_DAMPING;
    this.controls.maxDistance = CONTROLS_MAX_DISTANCE;
    this.controls.addEventListener("change", this.render);
    this.addEventListener(window, "resize", this.debouncedResize);
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  };

  render = () => {
    const cam = this.camera;
    const camPos = cam.position;
    const { visDistSq, tanHalfFov } = this;
    const viewH = window.innerHeight;

    for (const sprite of this.systems) {
      const refs = this.labelRefs.get(sprite);
      if (refs) {
        const distSq = sprite.position.distanceToSquared(camPos);
        const nearCamera = distSq < visDistSq;
        const labelClass = nearCamera ? "invis" : "starLabel";
        if (refs.label.element.className !== labelClass) {
          refs.label.element.className = labelClass;
        }
        if (refs.planetLabel) {
          const planetLabelClass = nearCamera ? "invis" : "planetLabel";
          if (refs.planetLabel.element.className !== planetLabelClass) {
            refs.planetLabel.element.className = planetLabelClass;
          }
        }
        if (!nearCamera) {
          const dist = Math.sqrt(distSq);
          const scale = Math.max(0.4, Math.min(2.5, CAMERA_START_Z / dist));
          const fontSize = Math.round(5 * scale);
          refs.label.element.style.fontSize = `${fontSize}px`;
          const marginTop = computeLabelMarginTop(sprite.scale.x, viewH, dist, tanHalfFov);
          refs.label.element.style.marginTop = `${marginTop}px`;
          if (refs.planetLabel) {
            refs.planetLabel.element.style.fontSize = `${Math.round(4 * scale)}px`;
            refs.planetLabel.element.style.marginTop = `${marginTop + fontSize + 2}px`;
          }
        }
      }
    }

    this.renderer.render(this.scene, cam);
    this.labelRenderer.render(this.scene, cam);
  };

  focusOnSystem = (name: string): boolean => {
    const query = name.toLowerCase().trim();
    if (!query) return false;
    const idx = this.systemsData.findIndex((s) => s.sysName.toLowerCase().includes(query));
    if (idx === -1) return false;

    // Remove previous glow
    if (this.glowSprite) {
      this.scene.remove(this.glowSprite);
      (this.glowSprite.material as THREE.SpriteMaterial).dispose();
      this.glowSprite = null;
    }

    const star = this.systems[idx];

    // Add additive glow sprite
    const glowMaterial = new THREE.SpriteMaterial({
      map: (star.material as THREE.SpriteMaterial).map,
      color: 0x88ccff,
      blending: THREE.AdditiveBlending,
      transparent: true,
      opacity: 0.7,
      depthWrite: false,
    });
    this.glowSprite = new THREE.Sprite(glowMaterial);
    this.glowSprite.scale.setScalar(star.scale.x * 2.5);
    this.glowSprite.position.copy(star.position);
    this.scene.add(this.glowSprite);

    this.controls.target.copy(star.position);
    this.camera.position.copy(star.position).add(new THREE.Vector3(0, 0, 800));
    this.controls.update();
    this.render();
    return true;
  };
}
