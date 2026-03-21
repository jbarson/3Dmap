import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";
import { validateData } from "./types";
import type { Jump, JumpType, MapState, System } from "./types";
import { MapStateImpl } from "./mapState";
import { debounce } from "./utils/debounce";

const DATE_DEFAULT = 2213;

// Planets that have a planet-detail entry. Maps star-map planetName → ?planet= key.
// Most names match directly; Novoya Rossiya/Nova Brazil is the one exception.
const GLOBE_PLANET_KEY: Partial<Record<string, string>> = {
  "Novoya Rossiya/Nova Brazil": "Novaya",
};
const GLOBE_PLANETS = new Set([
  "Altiplano",
  "Concord",
  "Damso",
  "Medina",
  "Novoya Rossiya/Nova Brazil",
  "Olympia",
  "Pacifica",
  "Refuge",
  "Schwarzvaal",
  "Xing Cheng",
]);

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
  linkCheckboxes: (HTMLInputElement | null)[],
  focusedSystem: string,
): string {
  const params = new URLSearchParams();

  // Comment 1: parse as integer and fall back to DATE_DEFAULT; also clamp to slider min/max
  let dateVal = DATE_DEFAULT;
  if (dateSlider) {
    const parsed = Number.parseInt(dateSlider.value, 10);
    dateVal = Number.isNaN(parsed) ? DATE_DEFAULT : parsed;
    const sliderMin = dateSlider.min !== "" ? Number.parseInt(dateSlider.min, 10) : undefined;
    const sliderMax = dateSlider.max !== "" ? Number.parseInt(dateSlider.max, 10) : undefined;
    if (sliderMin !== undefined && Number.isFinite(sliderMin) && dateVal < sliderMin)
      dateVal = sliderMin;
    if (sliderMax !== undefined && Number.isFinite(sliderMax) && dateVal > sliderMax)
      dateVal = sliderMax;
  }
  if (dateVal !== DATE_DEFAULT) {
    params.set("date", String(dateVal));
  }

  if (focusedSystem) {
    params.set("focus", focusedSystem);
  }

  // Comment 4: "Hide Hyper Links" checkboxes — checked = hidden.
  // Default state is no boxes checked (all links visible).
  // Encode links param only when some boxes are checked (some links hidden).
  const checkedLetters = LINK_CHECKBOX_IDS.filter((_, i) => linkCheckboxes[i]?.checked).map(
    (x) => x.letter,
  );
  // Only encode when non-default (some links hidden)
  if (checkedLetters.length > 0) {
    params.set("links", checkedLetters.join(","));
  }

  const str = params.toString();
  return str ? str : "";
}

const JUMP_TYPE_LABEL: Record<JumpType, string> = {
  A: "Alpha",
  B: "Beta",
  G: "Gamma",
  D: "Delta",
  E: "Epsilon",
};

function showSystemDetail(sys: System, jumps: Jump[], allSystems: System[]): void {
  const panel = document.getElementById("systemDetail");
  const content = document.getElementById("systemDetailContent");
  if (!panel || !content) return;

  const idToName = new Map<number, string>();
  for (const s of allSystems) idToName.set(s.id, s.sysName);

  const connected = jumps.filter((j) => j.bridge[0] === sys.id || j.bridge[1] === sys.id);
  const connectedItems = connected
    .map((j) => {
      const otherId = j.bridge[0] === sys.id ? j.bridge[1] : j.bridge[0];
      const otherName = idToName.get(otherId) ?? `#${otherId}`;
      const typeLabel = JUMP_TYPE_LABEL[j.type] ?? j.type;
      return `<li>${otherName} &mdash; ${typeLabel} (${j.year})</li>`;
    })
    .join("");

  const planetLine = sys.planetName ? `<p>Planet: ${sys.planetName}</p>` : "";
  const globeKey = sys.planetName ? (GLOBE_PLANET_KEY[sys.planetName] ?? sys.planetName) : null;
  const globeLink =
    sys.planetName && GLOBE_PLANETS.has(sys.planetName)
      ? `<p><a class="globe-link" href="/planet-detail.html?planet=${encodeURIComponent(globeKey!)}" target="_blank" rel="noopener">View planet &rarr;</a></p>`
      : "";
  const linksSection =
    connected.length > 0
      ? `<p>Hyper links:</p><ul>${connectedItems}</ul>`
      : `<p>No hyper links.</p>`;

  content.innerHTML = `
    <h3>${sys.sysName}</h3>
    ${planetLine}
    ${globeLink}
    <p>Type: ${sys.type.join(", ")}</p>
    <p>Coordinates: (${sys.x.toFixed(1)}, ${sys.y.toFixed(1)}, ${sys.z.toFixed(1)})</p>
    ${linksSection}
  `;
  panel.hidden = false;
}

document.addEventListener("DOMContentLoaded", () => {
  // One-time data validation for developer visibility in console
  validateData(systemsArr, jumpList);

  const mapState: MapState = new MapStateImpl(systemsArr, jumpList);

  const menuToggle = document.getElementById("menuToggle") as HTMLButtonElement | null;
  const controlsPanel = document.getElementById("controlsPanel") as HTMLElement | null;
  if (menuToggle && controlsPanel) {
    menuToggle.setAttribute("aria-controls", "controlsPanel");
    const isMobile = window.matchMedia("(max-width: 480px)").matches;
    if (!isMobile) {
      controlsPanel.classList.add("open");
      controlsPanel.hidden = false;
      controlsPanel.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
    } else {
      controlsPanel.classList.remove("open");
      controlsPanel.hidden = true;
      controlsPanel.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
    }
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

  // Comment 3: use .map() to preserve index alignment with LINK_CHECKBOX_IDS
  const linkCheckboxes = LINK_CHECKBOX_IDS.map(
    ({ id }) => document.getElementById(id) as HTMLInputElement | null,
  );

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
    // currentFocus and updateHash are handled by the onZoom callback
  }

  if (systemSearchBtn) systemSearchBtn.addEventListener("click", runSearch);
  if (systemSearch) {
    systemSearch.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") runSearch();
    });
  }

  // MapStateImpl encapsulates init/render/animate and link toggles
  mapState.init();

  // Wire system detail panel close button
  const systemDetailClose = document.getElementById("systemDetailClose");
  const systemDetailPanel = document.getElementById("systemDetail");
  if (systemDetailClose && systemDetailPanel) {
    systemDetailClose.addEventListener("click", () => {
      systemDetailPanel.hidden = true;
    });
  }

  // Show detail panel and sync URL hash whenever the camera zooms to a star
  mapState.onZoom = (idx: number) => {
    showSystemDetail(systemsArr[idx], jumpList, systemsArr);
    currentFocus = systemsArr[idx]?.sysName ?? "";
    updateHash();
  };

  // --- Restore state from URL hash ---
  const rawHash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
  if (rawHash) {
    const params = new URLSearchParams(rawHash);

    // Comment 2: validate dateParam is finite and clamp to slider min/max before applying
    const dateParam = params.get("date");
    if (dateParam !== null && dateSlider) {
      const parsedDate = Number(dateParam);
      if (Number.isFinite(parsedDate)) {
        const min = dateSlider.min !== "" ? Number(dateSlider.min) : undefined;
        const max = dateSlider.max !== "" ? Number(dateSlider.max) : undefined;
        let clamped = parsedDate;
        if (min !== undefined && Number.isFinite(min) && clamped < min) clamped = min;
        if (max !== undefined && Number.isFinite(max) && clamped > max) clamped = max;
        dateSlider.value = String(clamped);
        dateSlider.dispatchEvent(new Event("input"));
      }
    }

    // Restore link checkbox states
    const linksParam = params.get("links");
    if (linksParam !== null) {
      const hiddenLetters = new Set(linksParam ? linksParam.split(",") : []);
      LINK_CHECKBOX_IDS.forEach(({ letter }, i) => {
        const cb = linkCheckboxes[i];
        if (!cb) return;
        const shouldBeChecked = hiddenLetters.has(letter);
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
        if (systemSearch) systemSearch.value = focusParam;
        if (searchStatus) searchStatus.textContent = `Focused on "${focusParam}"`;
        // currentFocus is set by the onZoom callback fired inside focusOnSystem
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
