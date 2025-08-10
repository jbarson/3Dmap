import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls.js";
import { CSS3DObject, CSS3DRenderer } from "three/examples/jsm/renderers/CSS3DRenderer.js";
import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";

document.addEventListener("DOMContentLoaded", () => {
  type MapState = {
    systems: CSS3DObject[];
    links: CSS3DObject[];
    alphaLinks: CSS3DObject[];
    betaLinks: CSS3DObject[];
    gammaLinks: CSS3DObject[];
    deltaLinks: CSS3DObject[];
    epsiLinks: CSS3DObject[];
    linkTypes: HTMLInputElement[];
    alphaCheckbox: HTMLInputElement | null;
    betaCheckbox: HTMLInputElement | null;
    gammaCheckbox: HTMLInputElement | null;
    deltaCheckbox: HTMLInputElement | null;
    epsiCheckbox: HTMLInputElement | null;
    tmpVec1: THREE.Vector3;
    tmpVec2: THREE.Vector3;
    tmpVec3: THREE.Vector3;
    tmpVec4: THREE.Vector3;
    Scale: number;
    camera: THREE.PerspectiveCamera;
    scene: THREE.Scene;
    renderer: CSS3DRenderer;
    controls: TrackballControls;
    onWindowResize: () => void;
    animate: () => void;
    render: () => void;
    toggleAlpha: () => void;
    toggleBeta: () => void;
    toggleGamma: () => void;
    toggleDelta: () => void;
    toggleEpsi: () => void;
    init: () => void;
  };
  //the following is to link the slider with the text box*/
  const dateSlider = document.getElementById("dateSlider") as HTMLInputElement | null;
  const dateBox = document.getElementById("dateBox");
  if (dateSlider) {
    dateSlider.addEventListener("change", function () {
      const dateValStr = dateSlider.value;
      const dateVal = Number(dateValStr);
      if (dateBox) dateBox.textContent = String(dateVal);
      for (const n in jumpList) {
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
  mapState.Scale = 200;
  const allLinks = document.getElementById("allLinks") as HTMLInputElement | null;
  if (allLinks) {
    allLinks.addEventListener("change", function (this: HTMLInputElement) {
      if (this.checked) {
        for (const i in mapState.linkTypes) {
          const el = mapState.linkTypes[i] as HTMLInputElement;
          if (el && el.checked === false) {
            el.checked = true;
            el.dispatchEvent(new Event("change"));
          }
        }
      } else {
        for (const j in mapState.linkTypes) {
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
      60,
      window.innerWidth / window.innerHeight,
      1,
      75000,
    );
    mapState.camera.position.z = 5000;
    mapState.scene = new THREE.Scene();
    for (const i in systemsArr) {
      const starText = "starText";
      const system = systemsArr[i];
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
    const systemIndex = systemsArr.map((s) => s.id);
    for (const j in jumpList) {
      const startPos = mapState.systems[systemIndex.indexOf(jumpList[j].bridge[0])].position;
      const endPos = mapState.systems[systemIndex.indexOf(jumpList[j].bridge[1])].position;
      mapState.tmpVec1.subVectors(endPos, startPos);
      const linkLength = mapState.tmpVec1.length() - 25;
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
    mapState.controls.rotateSpeed = 1.0;
    mapState.controls.dynamicDampingFactor = 0.3;
    mapState.controls.maxDistance = 7500;
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
    for (const i in mapState.systems) {
      mapState.systems[i].lookAt(mapState.camera.position.clone());
      mapState.systems[i].up = mapState.camera.up.clone();
      if (mapState.systems[i].position.distanceTo(mapState.camera.position) < 500) {
        mapState.systems[i].element.children[1].className = "invis";
        if (mapState.systems[i].element.children[2]) {
          mapState.systems[i].element.children[2].className = "invis";
        }
      } else {
        mapState.systems[i].element.children[1].className = "starText";
        if (mapState.systems[i].element.children[2]) {
          mapState.systems[i].element.children[2].className = "planetText";
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
