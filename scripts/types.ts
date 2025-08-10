// Strong types for systems and jumps plus a tiny runtime validator

export interface System {
  id: number;
  x: number;
  y: number;
  z: number;
  // Stellar classification(s), e.g., "G V", "K IV", or "D"; stored as strings from data source
  type: string[];
  sysName: string;
  planetName?: string;
}

export type JumpType = "A" | "B" | "G" | "D" | "E";

export interface Jump {
  bridge: [number, number]; // [fromId, toId]
  type: JumpType;
  year: number;
}

// Result returned from validateData for programmatic handling
export interface ValidationResult {
  valid: boolean; // true when no invalid references were found
  invalidCount: number;
  invalidJumps: Array<{
    bridge: [number, number];
    fromFound: boolean;
    toFound: boolean;
    type: JumpType;
    year: number;
  }>;
}

// Shared app state type used in app.ts
export type MapState = {
  systems: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DObject[];
  links: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DObject[];
  alphaLinks: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DObject[];
  betaLinks: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DObject[];
  gammaLinks: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DObject[];
  deltaLinks: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DObject[];
  epsiLinks: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DObject[];
  linkTypes: HTMLInputElement[];
  alphaCheckbox: HTMLInputElement | null;
  betaCheckbox: HTMLInputElement | null;
  gammaCheckbox: HTMLInputElement | null;
  deltaCheckbox: HTMLInputElement | null;
  epsiCheckbox: HTMLInputElement | null;
  tmpVec1: import("three").Vector3;
  tmpVec2: import("three").Vector3;
  tmpVec3: import("three").Vector3;
  tmpVec4: import("three").Vector3;
  Scale: number;
  camera: import("three").PerspectiveCamera;
  scene: import("three").Scene;
  renderer: import("three/examples/jsm/renderers/CSS3DRenderer.js").CSS3DRenderer;
  controls: import("three/examples/jsm/controls/TrackballControls.js").TrackballControls;
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

// Build a Set of valid system IDs for quick membership checks
export function buildSystemIdSet(systems: System[]): Set<number> {
  const ids = new Set<number>();
  for (const s of systems) ids.add(s.id);
  return ids;
}

// Validate that all jump endpoints reference known system IDs. Logs warnings and returns a structured result.
export function validateData(systems: System[], jumps: Jump[]): ValidationResult {
  const idSet = buildSystemIdSet(systems);
  let invalidCount = 0;
  const invalidJumps: ValidationResult["invalidJumps"] = [];
  for (const j of jumps) {
    const [a, b] = j.bridge;
    const aOK = idSet.has(a);
    const bOK = idSet.has(b);
    if (!aOK || !bOK) {
      invalidCount++;
      invalidJumps.push({
        bridge: [a, b],
        fromFound: aOK,
        toFound: bOK,
        type: j.type,
        year: j.year,
      });
      console.warn(
        `Invalid jump reference: ${a} -> ${b} (from: ${aOK ? "found" : "missing"}, to: ${bOK ? "found" : "missing"})`,
      );
    }
  }
  if (invalidCount > 0) {
    console.warn(`Validation found ${invalidCount} invalid jump(s).`);
  }
  return { valid: invalidCount === 0, invalidCount, invalidJumps };
}
