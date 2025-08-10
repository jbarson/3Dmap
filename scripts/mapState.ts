import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import type { Jump, MapState, System } from "./types";
import { RESIZE_DEBOUNCE_DELAY } from "./config";
import { debounce } from "./utils/debounce";

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
  Scale = 200;
  camera!: THREE.PerspectiveCamera;
  scene!: THREE.Scene;
  renderer!: CSS3DRenderer;
  controls!: TrackballControls;

  private systemsData: System[];
  private jumpData: Jump[];
  private debouncedResize: () => void;
  private eventListeners: Array<{ element: EventTarget; event: string; handler: EventListener }> =
    [];

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
    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 75000);
    this.camera.position.z = 5000;
    this.scene = new THREE.Scene();

    for (const system of this.systemsData) {
      const starText = "starText";
      const starType = system.type[0][0].toUpperCase();
      const systemDiv = document.createElement("div");
      systemDiv.className = "starDiv";
      const starPic = document.createElement("img");
      if (starType === "A") {
        starPic.className = "a_star";
        starPic.src = "img/A-star.png";
      } else if (starType === "F") {
        starPic.className = "f_star";
        starPic.src = "img/F-star.png";
      } else if (starType === "G") {
        starPic.className = "g_star";
        starPic.src = "img/G-star.png";
      } else if (starType === "K") {
        starPic.className = "k_star";
        starPic.src = "img/K-star.png";
      } else if (starType === "M") {
        starPic.className = "m_star";
        starPic.src = "img/M-star.png";
      } else if (starType === "D") {
        starPic.className = "d_star";
        starPic.src = "img/D-star.png";
      } else {
        starPic.src = "img/spark1.png";
      }
      systemDiv.appendChild(starPic);
      const name = document.createElement("div");
      name.className = starText;
      name.textContent = system.sysName;
      systemDiv.appendChild(name);
      if (system.planetName) {
        const planet = document.createElement("div");
        planet.className = starText;
        planet.textContent = system.planetName;
        systemDiv.appendChild(planet);
      }
      const star = new CSS3DObject(systemDiv);
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
    for (let j = 0; j < this.jumpData.length; j++) {
      const fromIdx = idToIndex.get(this.jumpData[j].bridge[0]);
      const toIdx = idToIndex.get(this.jumpData[j].bridge[1]);
      if (fromIdx === undefined || toIdx === undefined) continue; // invalid refs already warned by validateData
      const startPos = this.systems[fromIdx].position;
      const endPos = this.systems[toIdx].position;
      this.tmpVec1.subVectors(endPos, startPos);
      const linkLength = this.tmpVec1.length() - 25;
      const hyperLink = document.createElement("div");
      // classify by jump type
      switch (this.jumpData[j].type) {
        case "A":
          hyperLink.className = "alpha";
          break;
        case "B":
          hyperLink.className = "beta";
          break;
        case "G":
          hyperLink.className = "gamma";
          break;
        case "D":
          hyperLink.className = "delta";
          break;
        case "E":
          hyperLink.className = "epsilon";
          break;
        default:
          hyperLink.className = "jumpLink";
      }
      hyperLink.style.height = linkLength + "px";
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
      // categorize by source type directly
      if (this.jumpData[j].type === "A") this.alphaLinks.push(object);
      else if (this.jumpData[j].type === "B") this.betaLinks.push(object);
      else if (this.jumpData[j].type === "D") this.deltaLinks.push(object);
      else if (this.jumpData[j].type === "G") this.gammaLinks.push(object);
      else if (this.jumpData[j].type === "E") this.epsiLinks.push(object);
      this.scene.add(object);
      this.links.push(object);
    }

    this.renderer = new CSS3DRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById("container");
    if (container) container.appendChild(this.renderer.domElement);
    this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls.rotateSpeed = 1.0;
    this.controls.dynamicDampingFactor = 0.3;
    this.controls.maxDistance = 7500;
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
    for (const sys of this.systems) {
      sys.lookAt(this.camera.position.clone());
      sys.up = this.camera.up.clone();
      if (sys.position.distanceTo(this.camera.position) < 500) {
        sys.element.children[1].className = "invis";
        if (sys.element.children[2]) sys.element.children[2].className = "invis";
      } else {
        sys.element.children[1].className = "starText";
        if (sys.element.children[2]) sys.element.children[2].className = "planetText";
      }
    }
    this.renderer.render(this.scene, this.camera);
  };
}
