// Jest setup file for 3Dmap tests

// Mock Three.js since it's not available in test environment
global.THREE = {
  Vector3: jest.fn().mockImplementation(() => ({
    x: 0,
    y: 0,
    z: 0,
    set: jest.fn(),
    copy: jest.fn(),
    add: jest.fn(),
    sub: jest.fn(),
    normalize: jest.fn(),
    length: jest.fn(() => 0)
  })),
  Scene: jest.fn(),
  PerspectiveCamera: jest.fn(),
  WebGLRenderer: jest.fn(),
  Mesh: jest.fn(),
  SphereGeometry: jest.fn(),
  MeshBasicMaterial: jest.fn()
};

// Mock underscore.js
global._ = {
  each: jest.fn(),
  map: jest.fn(),
  filter: jest.fn(),
  find: jest.fn(),
  extend: jest.fn()
};

// Setup DOM elements that the app expects
beforeEach(() => {
  document.body.innerHTML = `
    <div id="container"></div>
    <input id="dateSlider" type="range" min="2110" max="2213" value="2213" />
    <span id="dateBox">2213</span>
    <input type="checkbox" id="allLinks" />
    <input id="alphaLink" type="checkbox" />
    <input id="betaLink" type="checkbox" />
    <input id="gammaLink" type="checkbox" />
    <input id="deltaLink" type="checkbox" />
    <input id="epsiLink" type="checkbox" />
  `;
});

// Clean up after each test
afterEach(() => {
  document.body.innerHTML = '';
  jest.clearAllMocks();
});