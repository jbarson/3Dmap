import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import type { Jump, MapState, System, JumpType } from "./types";
import { buildStarElement, buildLinkElement } from "./utils/dom";
import { RESIZE_DEBOUNCE_DELAY } from "./config";
import { debounce } from "./utils/debounce";
import {
  CAMERA_FAR,
  CAMERA_FOV,
  CAMERA_NEAR,
  CAMERA_START_Z,
  CONTROLS_DAMPING,
  CONTROLS_MAX_DISTANCE,
  CONTROLS_ROTATE_SPEED,
  LINK_SHRINK,
  STAR_SCALE,
  VISIBILITY_DISTANCE,
} from "./config";

export class MapStateImpl implements MapState {
  systems: CSS3DObject[] = [];
  links: CSS3DObject[] = [];
  alphaLinks: CSS3DObject[] = [];
  betaLinks: CSS3DObject[] = [];
  gammaLinks: CSS3DObject[] = [];
  deltaLinks: CSS3DObject[] = [];
  epsiLinks: CSS3DObject[] = [];
  linkTypes: HTMLInputElement[] = [];
  alphaCheckbox: HTMLInputElement | null = null;
  betaCheckbox: HTMLInputElement | null = null;
  gammaCheckbox: HTMLInputElement | null = null;
  deltaCheckbox: HTMLInputElement | null = null;
  epsiCheckbox: HTMLInputElement | null = null;
  tmpVec1 = new THREE.Vector3();
  tmpVec2 = new THREE.Vector3();
  tmpVec3 = new THREE.Vector3();
  tmpVec4 = new THREE.Vector3();
  Scale = STAR_SCALE;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: CSS3DRenderer;
  controls!: TrackballControls;

  private systemsData: System[];
  private jumpData: Jump[];
  private debouncedResize: () => void;
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListener }> =
    [];
  private labelRefs = new WeakMap<
    CSS3DObject,
    { nameEl: HTMLDivElement; planetEl?: HTMLDivElement }
  >();

  constructor(systemsArr: System[], jumpList: Jump[]) {
    this.systemsData = systemsArr;
    this.jumpData = jumpList;
    // Create debounced resize handler with configured delay
    this.debouncedResize = debounce(this.onWindowResize, RESIZE_DEBOUNCE_DELAY);
  }

  private toggleLinksVisibility(list: CSS3DObject[]) {
    for (const obj of list) obj.element.classList.toggle("hidden");
  }

  // Event listener management for organized cleanup
  private addEventListener(element: EventTarget, event: string, handler: EventListener) {
    element.addEventListener(event, handler);
    this.eventListeners.push({ element, event, handler });
  }

  // Method to clean up all registered event listeners
  cleanup = () => {
    for (const { element, event, handler } of this.eventListeners) {
      element.removeEventListener(event, handler);
    }
    this.eventListeners = [];
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

    for (const system of this.systemsData) {
      const built = buildStarElement(system);
      const star = new CSS3DObject(built.element);
      // Store explicit references to labels to avoid brittle children indices (issue #17)
      this.labelRefs.set(star, { nameEl: built.nameEl, planetEl: built.planetEl });
      star.position.x = system.x * this.Scale;
      star.position.y = system.y * this.Scale;
      star.position.z = system.z * this.Scale;
      this.scene.add(star);
      this.systems.push(star);
    }

    // Precompute system id → index map for O(1) lookups (perf #14)
    const idToIndex = new Map<number, number>();
    for (let idx = 0; idx < this.systemsData.length; idx++) {
      idToIndex.set(this.systemsData[idx].id, idx);
    }
    // Build a map from JumpType to the target arrays to simplify categorization
    const typeToList: Record<JumpType, CSS3DObject[]> = {
      A: this.alphaLinks,
      B: this.betaLinks,
      G: this.gammaLinks,
      D: this.deltaLinks,
      E: this.epsiLinks,
    };

    for (let j = 0; j < this.jumpData.length; j++) {
      const fromIdx = idToIndex.get(this.jumpData[j].bridge[0]);
      const toIdx = idToIndex.get(this.jumpData[j].bridge[1]);
      if (fromIdx === undefined || toIdx === undefined) continue; // invalid refs already warned by validateData
      const startPos = this.systems[fromIdx].position;
      const endPos = this.systems[toIdx].position;
      this.tmpVec1.subVectors(endPos, startPos);
      const linkLength = this.tmpVec1.length() - LINK_SHRINK;
      const hyperLink = buildLinkElement(this.jumpData[j].type, linkLength);
      const object = new CSS3DObject(hyperLink);
      object.position.copy(startPos).lerp(endPos, 0.5);
      const axis = this.tmpVec2.set(0, 1, 0).cross(this.tmpVec1);
      const radians = Math.acos(
        this.tmpVec3.set(0, 1, 0).dot(this.tmpVec4.copy(this.tmpVec1).normalize()),
      );
      const objMatrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), radians);
      object.matrix = objMatrix;
      object.rotation.setFromRotationMatrix(object.matrix);
      object.matrixAutoUpdate = false;
      object.updateMatrix();
      // Categorize by type via the map
      typeToList[this.jumpData[j].type].push(object);
      this.scene.add(object);
      this.links.push(object);
    }

    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById("container");
    if (container) container.appendChild(this.renderer.domElement);
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = CONTROLS_ROTATE_SPEED;
    this.controls.dynamicDampingFactor = CONTROLS_DAMPING;
    this.controls.maxDistance = CONTROLS_MAX_DISTANCE;
    this.controls.addEventListener("change", this.render);
    // Use debounced resize handler instead of direct onWindowResize
    this.addEventListener(window, "resize", this.debouncedResize);
  };

  onWindowResize = () => {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.render();
  };

  animate = () => {
    requestAnimationFrame(this.animate);
    this.controls.update();
    this.render();
  };

  render = () => {
    // Cache camera state once per frame to avoid repeated property access and allocations
    const cam = this.camera;
    const camPos = cam.position; // safe to reuse directly
    const camUp = cam.up; // copy into sys.up below to avoid reassigning vector instances
    const visDistSq = VISIBILITY_DISTANCE * VISIBILITY_DISTANCE;

    for (const sys of this.systems) {
      // Face each system toward the camera without cloning per iteration
      sys.lookAt(camPos);
      // Avoid allocating a new Vector3; copy values into existing up vector
      sys.up.copy(camUp);

      const labels = this.labelRefs.get(sys);
      if (labels) {
        const nearCamera = sys.position.distanceToSquared(camPos) < visDistSq;
        const nameEl = labels.nameEl;
        const planetEl = labels.planetEl;
        if (nearCamera) {
          if (nameEl.className !== "invis") nameEl.className = "invis";
          if (planetEl && planetEl.className !== "invis") planetEl.className = "invis";
        } else {
          if (nameEl.className !== "starText") nameEl.className = "starText";
          if (planetEl && planetEl.className !== "planetText") planetEl.className = "planetText";
        }
      }
    }
    this.renderer.render(this.scene, cam);
  };
}
