import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";
import { validateData } from "./types";
import type { MapState } from "./types";
import { MapStateImpl } from "./mapState";
import { debounce } from "./utils/debounce";

const DATE_DEFAULT = 2213;
// Map checkbox element IDs to their link-type letters
const LINK_CHECKBOX_IDS: { id: string; letter: string }[] = [
  { id: "alphaLink", letter: "A" },
  { id: "betaLink", letter: "B" },
  { id: "gammaLink", letter: "G" },
  { id: "deltaLink", letter: "D" },
  { id: "epsiLink", letter: "E" },
];

// Build the hash string from current UI state (omit defaults)
function buildHash(
  dateSlider: HTMLInputElement | null,
  linkCheckboxes: HTMLInputElement[],
  focusedSystem: string,
): string {
  const params = new URLSearchParams();

  const dateVal = dateSlider ? Number(dateSlider.value) : DATE_DEFAULT;
  if (dateVal !== DATE_DEFAULT) {
    params.set("date", String(dateVal));
  }

  if (focusedSystem) {
    params.set("focus", focusedSystem);
  }

  // Collect which link types are checked
  const checkedLetters = LINK_CHECKBOX_IDS.filter((_, i) => linkCheckboxes[i]?.checked).map(
    (x) => x.letter,
  );
  const allChecked = checkedLetters.length === LINK_CHECKBOX_IDS.length;
  const noneChecked = checkedLetters.length === 0;
  // Only encode links param when it's a non-trivial partial selection
  if (!allChecked && !noneChecked) {
    params.set("links", checkedLetters.join(","));
  } else if (noneChecked) {
    params.set("links", "");
  }

  const str = params.toString();
  return str ? str : "";
}

document.addEventListener("DOMContentLoaded", () => {
  // One-time data validation for developer visibility in console
  validateData(systemsArr, jumpList);

  const mapState: MapState = new MapStateImpl(systemsArr, jumpList);

  const menuToggle = document.getElementById("menuToggle") as HTMLButtonElement | null;
  const controlsPanel = document.getElementById("controlsPanel") as HTMLElement | null;
  if (menuToggle && controlsPanel) {
    menuToggle.setAttribute("aria-controls", "controlsPanel");
    controlsPanel.hidden = true;
    controlsPanel.setAttribute("aria-hidden", "true");
    menuToggle.addEventListener("click", () => {
      const isOpen = controlsPanel.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      controlsPanel.hidden = !isOpen;
      controlsPanel.setAttribute("aria-hidden", isOpen ? "false" : "true");
    });
  }

  //the following is to link the slider with the text box*/
  const dateSlider = document.getElementById("dateSlider") as HTMLInputElement | null;
  const dateBox = document.getElementById("dateBox");
  if (dateSlider) {
    dateSlider.addEventListener("input", function () {
      const dateValStr = dateSlider.value;
      const dateVal = Number(dateValStr);
      if (dateBox) dateBox.textContent = String(dateVal);
      for (let n = 0; n < jumpList.length; n++) {
        // Treat links from the selected year as discovered; hide only strictly later years
        const mat = mapState.links[n].material as import("three").LineBasicMaterial;
        mat.opacity = jumpList[n].year > dateVal ? 0 : 1;
      }
    });
  }
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

  // Ordered list of link checkboxes matching LINK_CHECKBOX_IDS order
  const linkCheckboxes: HTMLInputElement[] = [
    mapState.alphaCheckbox,
    mapState.betaCheckbox,
    mapState.gammaCheckbox,
    mapState.deltaCheckbox,
    mapState.epsiCheckbox,
  ].filter(Boolean) as HTMLInputElement[];

  // Track the currently focused system name for hash serialization
  let currentFocus = "";

  // Debounced hash writer
  const updateHash = debounce(() => {
    const hash = buildHash(dateSlider, linkCheckboxes, currentFocus);
    history.replaceState(null, "", hash ? "#" + hash : location.pathname + location.search);
  }, 500);

  if (mapState.alphaCheckbox)
    mapState.alphaCheckbox.addEventListener("change", function () {
      mapState.toggleAlpha();
      updateHash();
    });
  if (mapState.betaCheckbox)
    mapState.betaCheckbox.addEventListener("change", function () {
      mapState.toggleBeta();
      updateHash();
    });
  if (mapState.gammaCheckbox)
    mapState.gammaCheckbox.addEventListener("change", function () {
      mapState.toggleGamma();
      updateHash();
    });
  if (mapState.deltaCheckbox)
    mapState.deltaCheckbox.addEventListener("change", function () {
      mapState.toggleDelta();
      updateHash();
    });
  if (mapState.epsiCheckbox)
    mapState.epsiCheckbox.addEventListener("change", function () {
      mapState.toggleEpsi();
      updateHash();
    });

  if (dateSlider) {
    dateSlider.addEventListener("input", updateHash);
  }

  // Search box: focus camera on the named system
  const systemSearch = document.getElementById("systemSearch") as HTMLInputElement | null;
  const systemSearchBtn = document.getElementById("systemSearchBtn");
  const searchStatus = document.getElementById("searchStatus");

  function runSearch() {
    if (!systemSearch) return;
    const found = mapState.focusOnSystem(systemSearch.value);
    if (searchStatus) {
      searchStatus.textContent = found
        ? `Focused on "${systemSearch.value}"`
        : `System "${systemSearch.value}" not found`;
    }
    if (found) {
      currentFocus = systemSearch.value;
      updateHash();
    }
  }

  if (systemSearchBtn) systemSearchBtn.addEventListener("click", runSearch);
  if (systemSearch) {
    systemSearch.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") runSearch();
    });
  }

  // MapStateImpl encapsulates init/render/animate and link toggles
  mapState.init();

  // --- Restore state from URL hash ---
  const rawHash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
  if (rawHash) {
    const params = new URLSearchParams(rawHash);

    // Restore date slider
    const dateParam = params.get("date");
    if (dateParam !== null && dateSlider) {
      dateSlider.value = dateParam;
      dateSlider.dispatchEvent(new Event("input"));
    }

    // Restore link checkbox states
    const linksParam = params.get("links");
    if (linksParam !== null) {
      const enabledLetters = new Set(linksParam ? linksParam.split(",") : []);
      LINK_CHECKBOX_IDS.forEach(({ letter }, i) => {
        const cb = linkCheckboxes[i];
        if (!cb) return;
        const shouldBeChecked = enabledLetters.has(letter);
        if (cb.checked !== shouldBeChecked) {
          cb.checked = shouldBeChecked;
          cb.dispatchEvent(new Event("change"));
        }
      });
    }

    // Restore focused system (after init so the scene is ready)
    const focusParam = params.get("focus");
    if (focusParam) {
      const found = mapState.focusOnSystem(focusParam);
      if (found) {
        currentFocus = focusParam;
        if (systemSearch) systemSearch.value = focusParam;
        if (searchStatus) searchStatus.textContent = `Focused on "${focusParam}"`;
      }
    }
  }

  // Build Named Worlds list from systems that have a planetName
  const planetList = document.getElementById("planetList");
  if (planetList) {
    systemsArr.forEach((sys, idx) => {
      if (!sys.planetName) return;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.textContent = `${sys.planetName} (${sys.sysName})`;
      btn.addEventListener("click", () => mapState.zoomToStar(idx));
      planetList.appendChild(btn);
    });
  }

  mapState.animate();
});
