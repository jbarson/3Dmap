import { systemsArr } from "./systemsList";
import { jumpList } from "./jumpLinks";
import { validateData } from "./types";
import type { Jump, JumpType, MapState, System } from "./types";
import { MapStateImpl } from "./mapState";
import { debounce } from "./utils/debounce";
import { escapeHtml } from "./utils/escapeHtml";

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
const LINK_CHECKBOX_IDS: { id: string; letter: JumpType }[] = [
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

let idToNameCache: Map<number, string> | null = null;

function showSystemDetail(sys: System, jumps: Jump[], allSystems: System[]): void {
  const panel = document.getElementById("systemDetail");
  const content = document.getElementById("systemDetailContent");
  if (!panel || !content) return;

  if (!idToNameCache) {
    idToNameCache = new Map<number, string>();
    for (const s of allSystems) idToNameCache.set(s.id, s.sysName);
  }
  const idToName = idToNameCache;

  const connected = jumps.filter((j) => j.bridge[0] === sys.id || j.bridge[1] === sys.id);
  const connectedItems = connected
    .map((j) => {
      const otherId = j.bridge[0] === sys.id ? j.bridge[1] : j.bridge[0];
      const otherName = idToName.get(otherId) ?? `#${otherId}`;
      const typeLabel = JUMP_TYPE_LABEL[j.type] ?? j.type;
      return `<li>${escapeHtml(otherName)} &mdash; ${escapeHtml(typeLabel)} (${j.year})</li>`;
    })
    .join("");

  const planetLine = sys.planetName ? `<p>Planet: ${escapeHtml(sys.planetName)}</p>` : "";
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
    <h3>${escapeHtml(sys.sysName)}</h3>
    ${planetLine}
    ${globeLink}
    <p>Type: ${escapeHtml(sys.type.join(", "))}</p>
    <p>Coordinates: (${sys.x.toFixed(1)}, ${sys.y.toFixed(1)}, ${sys.z.toFixed(1)})</p>
    ${linksSection}
  `;
  panel.hidden = false;
}

function setupMenuToggle(): void {
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
}

function setupDateSlider(
  mapState: MapState,
  jumpList: Jump[],
): { dateSlider: HTMLInputElement | null; dateBox: HTMLElement | null } {
  const dateSlider = document.getElementById("dateSlider") as HTMLInputElement | null;
  const dateBox = document.getElementById("dateBox");
  if (dateSlider) {
    let rAFId: number | null = null;
    let pendingDateVal = Number(dateSlider.value);

    dateSlider.addEventListener("input", function () {
      const dateValStr = dateSlider.value;
      const dateVal = Number(dateValStr);
      if (dateBox) dateBox.textContent = String(dateVal);

      pendingDateVal = dateVal;
      if (rAFId === null) {
        rAFId = requestAnimationFrame(() => {
          for (let n = 0; n < jumpList.length; n++) {
            const link = mapState.links[n];
            if (!link) continue;
            // Treat links from the selected year as discovered; hide only strictly later years
            const mat = link.material as import("three").LineBasicMaterial;
            mat.opacity = jumpList[n].year > pendingDateVal ? 0 : 1;
          }
          rAFId = null;
        });
      }
    });
  }
  return { dateSlider, dateBox };
}

function setupLinkCheckboxes(
  mapState: MapState,
  updateHash: () => void,
): (HTMLInputElement | null)[] {
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
      for (let i = 0; i < mapState.linkTypes.length; i++) {
        const el = mapState.linkTypes[i] as HTMLInputElement;
        if (el && el.checked !== this.checked) {
          el.checked = this.checked;
          el.dispatchEvent(new Event("change"));
        }
      }
    });
  }

  const linkCheckboxes = LINK_CHECKBOX_IDS.map(
    ({ id }) => document.getElementById(id) as HTMLInputElement | null,
  );

  LINK_CHECKBOX_IDS.forEach(({ letter }, i) => {
    const cb = linkCheckboxes[i];
    if (cb) {
      cb.addEventListener("change", function () {
        mapState.toggleLinks(letter);
        updateHash();
      });
    }
  });

  return linkCheckboxes;
}

function setupSearch(mapState: MapState): {
  systemSearch: HTMLInputElement | null;
  searchStatus: HTMLElement | null;
} {
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
  }

  if (systemSearchBtn) systemSearchBtn.addEventListener("click", runSearch);
  if (systemSearch) {
    systemSearch.addEventListener("keydown", (e: KeyboardEvent) => {
      if (e.key === "Enter") runSearch();
    });
  }

  return { systemSearch, searchStatus };
}

function setupSystemDetailPanel(): void {
  const systemDetailClose = document.getElementById("systemDetailClose");
  const systemDetailPanel = document.getElementById("systemDetail");
  if (systemDetailClose && systemDetailPanel) {
    systemDetailClose.addEventListener("click", () => {
      systemDetailPanel.hidden = true;
    });
  }
}

function setupNamedWorlds(mapState: MapState, systemsArr: System[]): void {
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
}

function restoreStateFromHash(
  mapState: MapState,
  dateSlider: HTMLInputElement | null,
  linkCheckboxes: (HTMLInputElement | null)[],
  systemSearch: HTMLInputElement | null,
  searchStatus: HTMLElement | null,
): void {
  const rawHash = location.hash.startsWith("#") ? location.hash.slice(1) : location.hash;
  if (!rawHash) return;

  const params = new URLSearchParams(rawHash);

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

  const focusParam = params.get("focus");
  if (focusParam) {
    const found = mapState.focusOnSystem(focusParam);
    if (found) {
      if (systemSearch) systemSearch.value = focusParam;
      if (searchStatus) searchStatus.textContent = `Focused on "${focusParam}"`;
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  validateData(systemsArr, jumpList);

  const mapState: MapState = new MapStateImpl(systemsArr, jumpList);

  setupMenuToggle();
  const { dateSlider } = setupDateSlider(mapState, jumpList);

  let currentFocus = "";
  let linkCheckboxes: (HTMLInputElement | null)[] = [];
  const updateHash = debounce(() => {
    const hash = buildHash(dateSlider, linkCheckboxes, currentFocus);
    history.replaceState(null, "", hash ? "#" + hash : location.pathname + location.search);
  }, 500);

  linkCheckboxes = setupLinkCheckboxes(mapState, updateHash);

  if (dateSlider) {
    dateSlider.addEventListener("input", updateHash);
  }

  const { systemSearch, searchStatus } = setupSearch(mapState);

  mapState.init();

  setupSystemDetailPanel();

  mapState.onZoom = (idx: number) => {
    showSystemDetail(systemsArr[idx], jumpList, systemsArr);
    currentFocus = systemsArr[idx]?.sysName ?? "";
    updateHash();
  };

  restoreStateFromHash(mapState, dateSlider, linkCheckboxes, systemSearch, searchStatus);
  setupNamedWorlds(mapState, systemsArr);

  mapState.animate();
});
