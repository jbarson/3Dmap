/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { MapStateImpl } from "./mapState";

import type { System, Jump } from "./types";

// Mock three.js classes
vi.mock("three", async () => {
  const actual = await vi.importActual("three");
  return {
    ...actual,
    WebGLRenderer: class WebGLRenderer {
      setSize = vi.fn();
      setPixelRatio = vi.fn();
      render = vi.fn();
      dispose = vi.fn();
      domElement = { style: {}, remove: vi.fn() };
    },
    Scene: class Scene {
      add = vi.fn();
      remove = vi.fn();
    },
    PerspectiveCamera: class PerspectiveCamera {
      position = {
        x: 0,
        y: 0,
        z: 0,
        clone: vi.fn().mockReturnThis(),
        lerpVectors: vi.fn(),
        copy: vi.fn().mockReturnThis(),
        add: vi.fn().mockReturnThis(),
      };
      aspect = 1;
      updateProjectionMatrix = vi.fn();
      projectionMatrix = new actual.Matrix4();
      matrixWorldInverse = new actual.Matrix4();
    },
    SpriteMaterial: class SpriteMaterial {
      dispose = vi.fn();
      map = {};
    },
    Sprite: class Sprite {
      material = { dispose: vi.fn() };
      scale = { x: 1, y: 1, z: 1, setScalar: vi.fn() };
      position = {
        x: 0,
        y: 0,
        z: 0,
        set: vi.fn(),
        distanceToSquared: vi.fn().mockReturnValue(100),
        clone: vi.fn().mockReturnValue({ add: vi.fn().mockReturnThis() }),
        copy: vi.fn().mockReturnThis(),
      };
      add = vi.fn();
    },
    BufferGeometry: class BufferGeometry {
      setAttribute = vi.fn();
      setFromPoints = vi.fn().mockReturnThis();
    },
    LineBasicMaterial: class LineBasicMaterial {
      clone = vi.fn().mockReturnThis();
    },
    Line: class Line {
      visible = true;
      material = { dispose: vi.fn() };
    },
    PointsMaterial: class PointsMaterial {},
    Points: class Points {},
    CanvasTexture: class CanvasTexture {},
    BufferAttribute: class BufferAttribute {},
  };
});

// Mock CSS2DRenderer
vi.mock("three/examples/jsm/renderers/CSS2DRenderer.js", () => {
  return {
    CSS2DRenderer: class CSS2DRenderer {
      setSize = vi.fn();
      render = vi.fn();
      domElement = { style: {}, remove: vi.fn() };
    },
    CSS2DObject: class CSS2DObject {
      position = { set: vi.fn() };
      center = { set: vi.fn() };
    },
  };
});

// Mock OrbitControls
vi.mock("three/examples/jsm/controls/OrbitControls.js", () => {
  return {
    OrbitControls: class OrbitControls {
      target = {
        clone: vi.fn().mockReturnThis(),
        copy: vi.fn().mockReturnThis().mockReturnThis(),
        lerpVectors: vi.fn(),
      };
      update = vi.fn();
    },
  };
});

// Mock utils
vi.mock("./utils/scene", () => {
  return {
    buildStarSprite: vi.fn((system) => {
      return {
        sprite: {
          material: {},
          scale: { x: 1, y: 1, z: 1, setScalar: vi.fn() },
          position: {
            x: 0,
            y: 0,
            z: 0,
            set: vi.fn(),
            distanceToSquared: vi.fn().mockReturnValue(100),
            clone: vi.fn().mockReturnValue({ add: vi.fn().mockReturnThis() }),
            copy: vi.fn().mockReturnThis(),
          },
          add: vi.fn(),
        },
        label: { element: { className: "", style: {} }, visible: true },
        planetLabel: system.planetName
          ? { element: { className: "", style: {} }, visible: true }
          : undefined,
      };
    }),
    computeLabelMarginTop: vi.fn().mockReturnValue(10),
    labelStyleChanged: vi.fn().mockReturnValue(true),
  };
});

describe("MapStateImpl", () => {
  it("can be constructed", () => {
    const mapState = new MapStateImpl([], []);
    expect(mapState).toBeDefined();
  });
});

describe("MapStateImpl DOM & global mocks", () => {
  beforeEach(() => {
    // Mock getElementById
    vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "container" || id === "labels") {
        return { appendChild: vi.fn() } as unknown as HTMLElement;
      }
      return null;
    });

    // Mock window dimensions
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, "devicePixelRatio", {
      writable: true,
      configurable: true,
      value: 1,
    });

    // Mock canvas context
    const contextMock = {
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillRect: vi.fn(),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(contextMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sets up document mocks properly", () => {
    expect(document.getElementById("container")).toBeTruthy();
    expect(window.innerWidth).toBe(1024);
  });
});

describe("MapStateImpl initialization", () => {
  const mockSystems: System[] = [
    { id: 1, x: 0, y: 0, z: 0, type: ["G V"], sysName: "Sol" },
    { id: 2, x: 10, y: 10, z: 10, type: ["M V"], sysName: "Alpha Centauri" },
  ];

  const mockJumps: Jump[] = [{ bridge: [1, 2], type: "A", year: 2100 }];

  beforeEach(() => {
    vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "container" || id === "labels") {
        return { appendChild: vi.fn() } as unknown as HTMLElement;
      }
      return null;
    });

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, "devicePixelRatio", {
      writable: true,
      configurable: true,
      value: 1,
    });

    const contextMock = {
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillRect: vi.fn(),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(contextMock);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("populates systems and links arrays on init", () => {
    const mapState = new MapStateImpl(mockSystems, mockJumps);

    expect(mapState.systems.length).toBe(0);
    expect(mapState.links.length).toBe(0);

    mapState.init();

    expect(mapState.systems.length).toBe(2);
    expect(mapState.links.length).toBe(1);
    expect(mapState.alphaLinks.length).toBe(1);
    expect(mapState.betaLinks.length).toBe(0);
  });
});

describe("MapStateImpl link toggling", () => {
  const mockSystems: System[] = [
    { id: 1, x: 0, y: 0, z: 0, type: ["G V"], sysName: "Sol" },
    { id: 2, x: 10, y: 10, z: 10, type: ["M V"], sysName: "Alpha Centauri" },
    { id: 3, x: 20, y: 20, z: 20, type: ["M V"], sysName: "Barnard's Star" },
  ];

  const mockJumps: Jump[] = [
    { bridge: [1, 2], type: "A", year: 2100 },
    { bridge: [2, 3], type: "B", year: 2100 },
    { bridge: [1, 3], type: "G", year: 2100 },
    { bridge: [3, 1], type: "D", year: 2100 },
    { bridge: [2, 1], type: "E", year: 2100 },
  ];

  let mapState: MapStateImpl;

  beforeEach(() => {
    vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "container" || id === "labels")
        return { appendChild: vi.fn() } as unknown as HTMLElement;
      return null;
    });

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, "devicePixelRatio", {
      writable: true,
      configurable: true,
      value: 1,
    });

    const contextMock = {
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillRect: vi.fn(),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(contextMock);

    mapState = new MapStateImpl(mockSystems, mockJumps);
    mapState.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("toggles alpha links visibility", () => {
    expect(mapState.alphaLinks[0].visible).toBe(true);
    mapState.toggleAlpha();
    expect(mapState.alphaLinks[0].visible).toBe(false);
    mapState.toggleAlpha();
    expect(mapState.alphaLinks[0].visible).toBe(true);
  });

  it("toggles beta links visibility", () => {
    expect(mapState.betaLinks[0].visible).toBe(true);
    mapState.toggleBeta();
    expect(mapState.betaLinks[0].visible).toBe(false);
  });

  it("toggles gamma links visibility", () => {
    expect(mapState.gammaLinks[0].visible).toBe(true);
    mapState.toggleGamma();
    expect(mapState.gammaLinks[0].visible).toBe(false);
  });

  it("toggles delta links visibility", () => {
    expect(mapState.deltaLinks[0].visible).toBe(true);
    mapState.toggleDelta();
    expect(mapState.deltaLinks[0].visible).toBe(false);
  });

  it("toggles epsi links visibility", () => {
    expect(mapState.epsiLinks[0].visible).toBe(true);
    mapState.toggleEpsi();
    expect(mapState.epsiLinks[0].visible).toBe(false);
  });
});

describe("MapStateImpl focusOnSystem & zoomToStar", () => {
  const mockSystems: System[] = [
    { id: 1, x: 0, y: 0, z: 0, type: ["G V"], sysName: "Sol" },
    { id: 2, x: 10, y: 10, z: 10, type: ["M V"], sysName: "Alpha Centauri" },
  ];

  const mockJumps: Jump[] = [];

  let mapState: MapStateImpl;

  beforeEach(() => {
    vi.spyOn(document, "getElementById").mockImplementation((id: string) => {
      if (id === "container" || id === "labels")
        return { appendChild: vi.fn() } as unknown as HTMLElement;
      return null;
    });

    Object.defineProperty(window, "innerWidth", {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, "innerHeight", {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, "devicePixelRatio", {
      writable: true,
      configurable: true,
      value: 1,
    });

    // Performance now mock
    vi.spyOn(performance, "now").mockReturnValue(1000);

    const contextMock = {
      createRadialGradient: vi.fn().mockReturnValue({
        addColorStop: vi.fn(),
      }),
      fillRect: vi.fn(),
    };
    HTMLCanvasElement.prototype.getContext = vi.fn().mockReturnValue(contextMock);

    mapState = new MapStateImpl(mockSystems, mockJumps);
    mapState.init();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("focusOnSystem returns false for empty or non-existent system query", () => {
    expect(mapState.focusOnSystem("")).toBe(false);
    expect(mapState.focusOnSystem("   ")).toBe(false);
    expect(mapState.focusOnSystem("Unknown System")).toBe(false);
  });

  it("focusOnSystem finds existing system, calls zoomToStar and returns true", () => {
    const zoomToStarSpy = vi.spyOn(mapState, "zoomToStar");
    mapState.onZoom = vi.fn();

    const result = mapState.focusOnSystem("alpha cen");

    expect(result).toBe(true);
    expect(mapState.onZoom).toHaveBeenCalledWith(1);
    expect(zoomToStarSpy).toHaveBeenCalledWith(1);
  });

  it("zoomToStar handles invalid index gracefully", () => {
    mapState.onZoom = vi.fn();
    mapState.zoomToStar(-1);
    expect(mapState.onZoom).not.toHaveBeenCalled();
    mapState.zoomToStar(99);
    expect(mapState.onZoom).not.toHaveBeenCalled();
  });

  it("zoomToStar sets cameraAnim and triggers onZoom", () => {
    mapState.onZoom = vi.fn();

    // @ts-expect-error accessing private property for test
    mapState.cameraAnim = null;

    mapState.zoomToStar(0);

    // @ts-expect-error accessing private property for test
    const cameraAnim = mapState.cameraAnim;
    expect(cameraAnim).toBeDefined();
    expect(cameraAnim.startTime).toBe(1000);
    expect(cameraAnim.duration).toBe(1000);

    expect(mapState.onZoom).toHaveBeenCalledWith(0);
  });
});
