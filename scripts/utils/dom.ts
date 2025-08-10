import type { System, JumpType } from "../types";
import { JUMP_TYPE_CLASS } from "../types";

export function buildStarElement(system: System): {
  element: HTMLDivElement;
  nameEl: HTMLDivElement;
  planetEl?: HTMLDivElement;
} {
  const starText = "starText";
  const planetText = "planetText";

  const systemDiv = document.createElement("div") as HTMLDivElement;
  systemDiv.className = "starDiv";

  const starPic = document.createElement("img");
  const starType = system.type[0]?.[0]?.toUpperCase();
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

  const name = document.createElement("div") as HTMLDivElement;
  name.className = starText;
  name.textContent = system.sysName;
  systemDiv.appendChild(name);

  let planet: HTMLDivElement | undefined;
  if (system.planetName) {
    planet = document.createElement("div") as HTMLDivElement;
    planet.className = planetText;
    planet.textContent = system.planetName;
    systemDiv.appendChild(planet);
  }

  return { element: systemDiv, nameEl: name, planetEl: planet };
}

export function buildLinkElement(type: JumpType, length: number): HTMLDivElement {
  const hyperLink = document.createElement("div") as HTMLDivElement;
  hyperLink.className = JUMP_TYPE_CLASS[type] ?? "jumpLink";
  hyperLink.style.height = `${length}px`;
  return hyperLink;
}
