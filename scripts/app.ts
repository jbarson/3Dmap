import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
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
import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";
import { validateData } from "./types";
import type { MapState } from "./types";

document.addEventListener("DOMContentLoaded", () => {
  // One-time data validation for developer visibility in console
  validateData(systemsArr, jumpList);
  // MapState is now defined in scripts/types.ts
  //the following is to link the slider with the text box*/
  const dateSlider = document.getElementById("dateSlider") as HTMLInputElement | null;
  const dateBox = document.getElementById("dateBox");
  if (dateSlider) {
    dateSlider.addEventListener("change", function () {
      const dateValStr = dateSlider.value;
      const dateVal = Number(dateValStr);
      if (dateBox) dateBox.textContent = String(dateVal);
      for (let n = 0; n < jumpList.length; n++) {
        if (jumpList[n].year >= dateVal) {
          mapState.links[n].element.classList.add("undiscovered");
        }
        if (jumpList[n].year <= dateVal) {
          mapState.links[n].element.classList.remove("undiscovered");
        }
      }
    });
  }
  const mapState = {} as unknown as MapState;
  mapState.systems = [];
  mapState.links = [];
  mapState.alphaLinks = [];
  mapState.betaLinks = [];
  mapState.gammaLinks = [];
  mapState.deltaLinks = [];
  mapState.epsiLinks = [];
  mapState.linkTypes = [];
  mapState.alphaCheckbox = document.getElementById("alphaLink") as HTMLInputElement | null;
  mapState.betaCheckbox = document.getElementById("betaLink") as HTMLInputElement | null;
  mapState.gammaCheckbox = document.getElementById("gammaLink") as HTMLInputElement | null;
  mapState.deltaCheckbox = document.getElementById("deltaLink") as HTMLInputElement | null;
  mapState.epsiCheckbox = document.getElementById("epsiLink") as HTMLInputElement | null;
  mapState.linkTypes = [
    mapState.alphaCheckbox,
    mapState.betaCheckbox,
    mapState.gammaCheckbox,
    mapState.deltaCheckbox,
    mapState.epsiCheckbox,
  ].filter(Boolean) as HTMLInputElement[];
  mapState.tmpVec1 = new THREE.Vector3();
  mapState.tmpVec2 = new THREE.Vector3();
  mapState.tmpVec3 = new THREE.Vector3();
  mapState.tmpVec4 = new THREE.Vector3();
  mapState.Scale = STAR_SCALE;
  const allLinks = document.getElementById("allLinks") as HTMLInputElement | null;
  if (allLinks) {
    allLinks.addEventListener("change", function (this: HTMLInputElement) {
      if (this.checked) {
        for (let i = 0; i < mapState.linkTypes.length; i++) {
          const el = mapState.linkTypes[i] as HTMLInputElement;
          if (el && el.checked === false) {
            el.checked = true;
            el.dispatchEvent(new Event("change"));
          }
        }
      } else {
        for (let j = 0; j < mapState.linkTypes.length; j++) {
          const el = mapState.linkTypes[j] as HTMLInputElement;
          if (el && el.checked === true) {
            el.checked = false;
            el.dispatchEvent(new Event("change"));
          }
        }
      }
    });
  }
  if (mapState.alphaCheckbox)
    mapState.alphaCheckbox.addEventListener("change", function () {
      mapState.toggleAlpha();
    });
  if (mapState.betaCheckbox)
    mapState.betaCheckbox.addEventListener("change", function () {
      mapState.toggleBeta();
    });
  if (mapState.gammaCheckbox)
    mapState.gammaCheckbox.addEventListener("change", function () {
      mapState.toggleGamma();
    });
  if (mapState.deltaCheckbox)
    mapState.deltaCheckbox.addEventListener("change", function () {
      mapState.toggleDelta();
    });
  if (mapState.epsiCheckbox)
    mapState.epsiCheckbox.addEventListener("change", function () {
      mapState.toggleEpsi();
    });
  mapState.init = function () {
    mapState.camera = new THREE.PerspectiveCamera(
      CAMERA_FOV,
      window.innerWidth / window.innerHeight,
      CAMERA_NEAR,
      CAMERA_FAR,
    );
    mapState.camera.position.z = CAMERA_START_Z;
    mapState.scene = new THREE.Scene();
    for (const system of systemsArr) {
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
      star.position.x = system.x * mapState.Scale;
      star.position.y = system.y * mapState.Scale;
      star.position.z = system.z * mapState.Scale;
      mapState.scene.add(star);
      mapState.systems.push(star);
    }
    // Precompute system id → index map for O(1) lookups (perf #14)
    const idToIndex = new Map<number, number>();
    for (let idx = 0; idx < systemsArr.length; idx++) idToIndex.set(systemsArr[idx].id, idx);
    for (let j = 0; j < jumpList.length; j++) {
      const fromIdx = idToIndex.get(jumpList[j].bridge[0]);
      const toIdx = idToIndex.get(jumpList[j].bridge[1]);
      if (fromIdx === undefined || toIdx === undefined) continue; // invalid refs already warned by validateData
      const startPos = mapState.systems[fromIdx].position;
      const endPos = mapState.systems[toIdx].position;
      mapState.tmpVec1.subVectors(endPos, startPos);
      const linkLength = mapState.tmpVec1.length() - LINK_SHRINK;
      const hyperLink = document.createElement("div");
      hyperLink.className = "jumpLink";
      if (jumpList[j].type === "A") {
        hyperLink.className = "alpha";
      }
      if (jumpList[j].type === "B") {
        hyperLink.className = "beta";
      }
      if (jumpList[j].type === "G") {
        hyperLink.className = "gamma";
      }
      if (jumpList[j].type === "D") {
        hyperLink.className = "delta";
      }
      if (jumpList[j].type === "E") {
        hyperLink.className = "epsilon";
      }
      hyperLink.style.height = linkLength + "px";
      const object = new CSS3DObject(hyperLink);
      object.position.copy(startPos).lerp(endPos, 0.5);
      const axis = mapState.tmpVec2.set(0, 1, 0).cross(mapState.tmpVec1);
      const radians = Math.acos(
        mapState.tmpVec3.set(0, 1, 0).dot(mapState.tmpVec4.copy(mapState.tmpVec1).normalize()),
      );
      const objMatrix = new THREE.Matrix4().makeRotationAxis(axis.normalize(), radians);
      object.matrix = objMatrix;
      object.rotation.setFromRotationMatrix(object.matrix);
      object.matrixAutoUpdate = false;
      object.updateMatrix();
      if (object.element.className === "alpha") {
        mapState.alphaLinks.push(object);
      }
      if (object.element.className === "beta") {
        mapState.betaLinks.push(object);
      }
      if (object.element.className === "delta") {
        mapState.deltaLinks.push(object);
      }
      if (object.element.className === "gamma") {
        mapState.gammaLinks.push(object);
      }
      if (object.element.className === "epsilon") {
        mapState.epsiLinks.push(object);
      }
      mapState.scene.add(object);
      mapState.links.push(object);
    }
    mapState.renderer = new CSS3DRenderer();
    mapState.renderer.setSize(window.innerWidth, window.innerHeight);
    const container = document.getElementById("container");
    if (container) {
      container.appendChild(mapState.renderer.domElement);
    }
    mapState.controls = new TrackballControls(mapState.camera, mapState.renderer.domElement);
    mapState.controls.rotateSpeed = CONTROLS_ROTATE_SPEED;
    mapState.controls.dynamicDampingFactor = CONTROLS_DAMPING;
    mapState.controls.maxDistance = CONTROLS_MAX_DISTANCE;
    mapState.controls.addEventListener("change", mapState.render);
    window.addEventListener("resize", mapState.onWindowResize, false);
  };
  mapState.onWindowResize = function () {
    mapState.camera.aspect = window.innerWidth / window.innerHeight;
    mapState.camera.updateProjectionMatrix();
    mapState.renderer.setSize(window.innerWidth, window.innerHeight);
    mapState.render();
  };
  mapState.animate = function () {
    requestAnimationFrame(mapState.animate);
    mapState.controls.update();
    mapState.render();
  };
  mapState.render = function () {
    for (const sys of mapState.systems) {
      sys.lookAt(mapState.camera.position.clone());
      sys.up = mapState.camera.up.clone();
      if (sys.position.distanceTo(mapState.camera.position) < VISIBILITY_DISTANCE) {
        sys.element.children[1].className = "invis";
        if (sys.element.children[2]) {
          sys.element.children[2].className = "invis";
        }
      } else {
        sys.element.children[1].className = "starText";
        if (sys.element.children[2]) {
          sys.element.children[2].className = "planetText";
        }
      }
    }
    mapState.renderer.render(mapState.scene, mapState.camera);
  };
  // unified toggle helper for link visibility
  const toggleLinksVisibility = (list: CSS3DObject[]) => {
    for (const obj of list) {
      obj.element.classList.toggle("hidden");
    }
  };
  mapState.toggleAlpha = function () {
    toggleLinksVisibility(mapState.alphaLinks);
  };
  mapState.toggleBeta = function () {
    toggleLinksVisibility(mapState.betaLinks);
  };
  mapState.toggleGamma = function () {
    toggleLinksVisibility(mapState.gammaLinks);
  };
  mapState.toggleDelta = function () {
    toggleLinksVisibility(mapState.deltaLinks);
  };
  mapState.toggleEpsi = function () {
    toggleLinksVisibility(mapState.epsiLinks);
  };

  mapState.init();
  mapState.animate();
});
