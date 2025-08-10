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

// Build a Set of valid system IDs for quick membership checks
export function buildSystemIdSet(systems: System[]): Set<number> {
  const ids = new Set<number>();
  for (const s of systems) ids.add(s.id);
  return ids;
}

// Validate that all jump endpoints reference known system IDs. Logs a single warning per invalid pair.
export function validateData(systems: System[], jumps: Jump[]): void {
  const idSet = buildSystemIdSet(systems);
  let invalidCount = 0;
  for (const j of jumps) {
    const [a, b] = j.bridge;
    const aOK = idSet.has(a);
    const bOK = idSet.has(b);
    if (!aOK || !bOK) {
      invalidCount++;
      console.warn(
        `Invalid jump reference: ${a} -> ${b} (exists: ${aOK ? "Y" : "N"} / ${bOK ? "Y" : "N"})`,
      );
    }
  }
  if (invalidCount > 0) {
    console.warn(`Validation found ${invalidCount} invalid jump(s).`);
  }
}
