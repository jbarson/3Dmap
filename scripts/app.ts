import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";
import { validateData } from "./types";
import type { MapState } from "./types";
import { MapStateImpl } from "./mapState";

document.addEventListener("DOMContentLoaded", () => {
  // One-time data validation for developer visibility in console
  validateData(systemsArr, jumpList);
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
  const mapState: MapState = new MapStateImpl(systemsArr, jumpList);
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
  // MapStateImpl encapsulates init/render/animate and link toggles
  mapState.init();
  mapState.animate();
});
