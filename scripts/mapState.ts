import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";
import type { Jump, MapState, System, JumpType } from "./types";
import { buildStarSprite, computeLabelMarginTop, clearSceneCache } from "./utils/scene";
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
  controls!: OrbitControls;

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

  // Cache of last-written label style values to avoid redundant DOM writes
  private labelStyles = new WeakMap<
    THREE.Sprite,
    { fontSize: string; marginTop: string; planetFontSize: string; planetMarginTop: string }
  >();

  onZoom: ((idx: number) => void) | null = null;
  private glowSprite: THREE.Sprite | null = null;
  private glowMaterial: THREE.SpriteMaterial | null = null;
  private cameraAnim: {
    startPos: THREE.Vector3;
    endPos: THREE.Vector3;
    startTarget: THREE.Vector3;
    endTarget: THREE.Vector3;
    startTime: number;
    duration: number;
  } | null = null;

  // Derived constants — computed once from config, reused every frame
  private readonly tanHalfFov = Math.tan((CAMERA_FOV * Math.PI) / 360);
  private readonly visDistSq = VISIBILITY_DISTANCE * VISIBILITY_DISTANCE;

  // Frustum culling — reused every frame to avoid GC pressure
  private readonly frustum = new THREE.Frustum();
  private readonly projScreenMatrix = new THREE.Matrix4();

  private bgPoints: THREE.Points | null = null;
  private typeMaterials = new Map<JumpType, THREE.LineBasicMaterial>();

  private lastCamPos = new THREE.Vector3();
  private lastCamQuat = new THREE.Quaternion();
  private lastViewH = 0;
  private lastViewW = 0;

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

    // Clear shared materials and textures
    clearSceneCache();

    for (const line of this.links) {
      line.geometry.dispose();
      (line.material as THREE.Material).dispose();
    }
    // Dispose shared per-type materials
    for (const mat of this.typeMaterials.values()) {
      mat.dispose();
    }
    if (this.glowSprite) {
      this.scene.remove(this.glowSprite);
      this.glowSprite = null;
    }
    if (this.glowMaterial) {
      this.glowMaterial.dispose();
      this.glowMaterial = null;
    }
    if (this.bgPoints) {
      this.bgPoints.geometry.dispose();
      const mat = this.bgPoints.material as THREE.PointsMaterial;
      mat.map?.dispose();
      mat.dispose();
    }
    this.renderer.domElement.remove();
    this.labelRenderer.domElement.remove();
    this.renderer.dispose();
  };

  toggleLinks = (type: JumpType) => {
    const typeToList: Record<JumpType, THREE.Line[]> = {
      A: this.alphaLinks,
      B: this.betaLinks,
      G: this.gammaLinks,
      D: this.deltaLinks,
      E: this.epsiLinks,
    };
    const list = typeToList[type];
    if (list) this.toggleLinksVisibility(list);
  };

  init = () => {
    this.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      CAMERA_NEAR,
      CAMERA_FAR,
    );
    this.camera.position.z = CAMERA_START_Z;
    this.scene = new THREE.Scene();

    this.setupRenderers();
    this.setupBackground();
    this.setupStarSprites();
    this.setupJumpLinks();
    this.setupControls();
  };

  private setupRenderers() {
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
  }

  private setupBackground() {
    // --- Background starfield ---
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 60000;
    }
    const bgGeometry = new THREE.BufferGeometry();
    bgGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    // Circular soft-dot texture so points render as rounds instead of squares
    const dotCanvas = document.createElement("canvas");
    dotCanvas.width = 16;
    dotCanvas.height = 16;
    const dotCtx = dotCanvas.getContext("2d")!;
    const dotGrad = dotCtx.createRadialGradient(8, 8, 0, 8, 8, 8);
    dotGrad.addColorStop(0, "rgba(255,255,255,1)");
    dotGrad.addColorStop(1, "rgba(255,255,255,0)");
    dotCtx.fillStyle = dotGrad;
    dotCtx.fillRect(0, 0, 16, 16);
    const bgMaterial = new THREE.PointsMaterial({
      map: new THREE.CanvasTexture(dotCanvas),
      color: 0xffffff,
      size: 10,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.6,
      alphaTest: 0.01,
    });
    this.bgPoints = new THREE.Points(bgGeometry, bgMaterial);
    this.scene.add(this.bgPoints);
  }

  private setupStarSprites() {
    // --- Star sprites ---
    for (const system of this.systemsData) {
      const idx = this.systems.length;
      const built = buildStarSprite(system, () => this.zoomToStar(idx));
      built.sprite.position.set(
        system.x * this.Scale,
        system.y * this.Scale,
        system.z * this.Scale,
      );
      this.scene.add(built.sprite);
      this.systems.push(built.sprite);
      this.labelRefs.set(built.sprite, { label: built.label, planetLabel: built.planetLabel });
    }
  }

  private setupJumpLinks() {
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
      const points = [startPos, endPos];
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
  }

  private setupControls() {
    // --- Controls ---
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = CONTROLS_ROTATE_SPEED;
    this.controls.dampingFactor = CONTROLS_DAMPING;
    this.controls.enableDamping = true;
    this.controls.maxDistance = CONTROLS_MAX_DISTANCE;
    this.addEventListener(window, "resize", this.debouncedResize);
  }

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.labelRenderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.cameraAnim) {
      const { startPos, endPos, startTarget, endTarget, startTime, duration } = this.cameraAnim;
      const raw = (performance.now() - startTime) / duration;
      const t = Math.min(raw, 1);
      const ease = t * t * (3 - 2 * t); // smoothstep
      this.camera.position.lerpVectors(startPos, endPos, ease);
      this.controls.target.lerpVectors(startTarget, endTarget, ease);
      if (t >= 1) {
        this.camera.position.copy(endPos);
        this.controls.target.copy(endTarget);
        this.cameraAnim = null;
      }
      this.controls.update();
      this.render();
      return;
    }
    this.controls.update();
    this.render();
  };

  render = () => {
    const cam = this.camera;
    const camPos = cam.position;
    const viewH = window.innerHeight;
    const viewW = window.innerWidth;

    // Only compute label updates and CSS2D rendering when camera or viewport changes
    const cameraMoved =
      !this.lastCamPos.equals(camPos) ||
      !this.lastCamQuat.equals(cam.quaternion) ||
      this.lastViewH !== viewH ||
      this.lastViewW !== viewW;

    if (cameraMoved) {
      this.lastCamPos.copy(camPos);
      this.lastCamQuat.copy(cam.quaternion);
      this.lastViewH = viewH;
      this.lastViewW = viewW;

      const { visDistSq, tanHalfFov, frustum, projScreenMatrix } = this;

      // Build frustum once per frame to cull off-screen labels
      projScreenMatrix.multiplyMatrices(cam.projectionMatrix, cam.matrixWorldInverse);
      frustum.setFromProjectionMatrix(projScreenMatrix);

      for (const sprite of this.systems) {
        const refs = this.labelRefs.get(sprite);
        if (refs) {
          const distSq = sprite.position.distanceToSquared(camPos);
          const nearCamera = distSq < visDistSq;
          const inFrustum = frustum.containsPoint(sprite.position);

          // Hide labels entirely when off-screen so CSS2DRenderer skips DOM updates
          if (!inFrustum) {
            refs.label.visible = false;
            if (refs.planetLabel) refs.planetLabel.visible = false;
            continue;
          }
          refs.label.visible = true;
          if (refs.planetLabel) refs.planetLabel.visible = true;

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
            const fontSize = `${Math.round(5 * scale)}px`;
            const marginTop = `${computeLabelMarginTop(sprite.scale.x, viewH, dist, tanHalfFov)}px`;
            const planetFontSize = `${Math.round(4 * scale)}px`;
            const planetMarginTop = `${computeLabelMarginTop(sprite.scale.x, viewH, dist, tanHalfFov) + Math.round(5 * scale) + 2}px`;

            const cached = this.labelStyles.get(sprite);
            if (!cached || cached.fontSize !== fontSize || cached.marginTop !== marginTop) {
              refs.label.element.style.fontSize = fontSize;
              refs.label.element.style.marginTop = marginTop;
            }
            if (refs.planetLabel) {
              if (
                !cached ||
                cached.planetFontSize !== planetFontSize ||
                cached.planetMarginTop !== planetMarginTop
              ) {
                refs.planetLabel.element.style.fontSize = planetFontSize;
                refs.planetLabel.element.style.marginTop = planetMarginTop;
              }
            }
            this.labelStyles.set(sprite, { fontSize, marginTop, planetFontSize, planetMarginTop });
          }
        }
      }
      this.labelRenderer.render(this.scene, cam);
    }

    this.renderer.render(this.scene, cam);
  };

  private placeGlow(star: THREE.Sprite): void {
    const starMap = (star.material as THREE.SpriteMaterial).map;

    // Performance Optimization: Cache and reuse SpriteMaterial and Sprite
    // to prevent allocations and GC overhead on every selection.
    // Reusing the same material/sprite drastically improves responsiveness
    // when clicking through many systems quickly.
    if (!this.glowMaterial) {
      this.glowMaterial = new THREE.SpriteMaterial({
        map: starMap,
        color: 0x88ccff,
        blending: THREE.AdditiveBlending,
        transparent: true,
        opacity: 0.7,
        depthWrite: false,
      });
    } else {
      this.glowMaterial.map = starMap;
      this.glowMaterial.needsUpdate = true;
    }

    if (!this.glowSprite) {
      this.glowSprite = new THREE.Sprite(this.glowMaterial);
      this.scene.add(this.glowSprite);
    }
    this.glowSprite.scale.setScalar(star.scale.x * 2.5);
    this.glowSprite.position.copy(star.position);
  }

  zoomToStar = (idx: number): void => {
    const star = this.systems[idx];
    if (!star) return;
    this.placeGlow(star);
    this.cameraAnim = {
      startPos: this.camera.position.clone(),
      endPos: star.position.clone().add(new THREE.Vector3(0, 0, 800)),
      startTarget: this.controls.target.clone(),
      endTarget: star.position.clone(),
      startTime: performance.now(),
      duration: 1000,
    };
    this.onZoom?.(idx);
  };

  focusOnSystem = (name: string): boolean => {
    const query = name.toLowerCase().trim();
    if (!query) return false;
    const idx = this.systemsData.findIndex((s) => s.sysName.toLowerCase().includes(query));
    if (idx === -1) return false;

    const star = this.systems[idx];
    this.placeGlow(star);
    this.controls.target.copy(star.position);
    this.camera.position.copy(star.position).add(new THREE.Vector3(0, 0, 800));
    this.controls.update();
    this.render();
    this.onZoom?.(idx);
    this.zoomToStar(idx);
    return true;
  };
}
