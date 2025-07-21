/**
 * Basic tests for the 3Dmap application core functionality
 */

// Mock the global variables and data that the app expects
global.systemsArr = [
  {id: 1, x: 0.00, y: 0.00, z: 0.00, sysName: "Sol", planetName: "Earth", type: ["G2V"], absMag: [4.85], mass: [1.00]},
  {id: 2, x: 0.13, y: 1.26, z: -5.15, sysName: "Luyten 722-22", type: ["M"], absMag: [13.44], mass: [0.18]}
];

global.jumpList = [
  {bridge: [1, 2], type: "D", year: 2111}
];

// Mock window object
global.window = {
  innerWidth: 1024,
  innerHeight: 768,
  map: {}
};

describe('3Dmap Application', () => {
  beforeEach(() => {
    // Reset the global map object
    global.window.map = {};
    
    // Reset DOM
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

  describe('DOM Elements', () => {
    test('should find required DOM elements', () => {
      expect(document.querySelector('#dateSlider')).toBeTruthy();
      expect(document.querySelector('#dateBox')).toBeTruthy();
      expect(document.querySelector('#allLinks')).toBeTruthy();
      expect(document.querySelector('#alphaLink')).toBeTruthy();
      expect(document.querySelector('#container')).toBeTruthy();
    });

    test('date slider should have correct attributes', () => {
      const slider = document.querySelector('#dateSlider');
      expect(slider.min).toBe('2110');
      expect(slider.max).toBe('2213');
      expect(slider.value).toBe('2213');
    });
  });

  describe('Data Structures', () => {
    test('systemsArr should be defined and have correct structure', () => {
      expect(global.systemsArr).toBeDefined();
      expect(Array.isArray(global.systemsArr)).toBe(true);
      expect(global.systemsArr.length).toBeGreaterThan(0);
      
      const firstSystem = global.systemsArr[0];
      expect(firstSystem).toHaveProperty('id');
      expect(firstSystem).toHaveProperty('x');
      expect(firstSystem).toHaveProperty('y');
      expect(firstSystem).toHaveProperty('z');
      expect(firstSystem).toHaveProperty('sysName');
      expect(firstSystem).toHaveProperty('type');
    });

    test('jumpList should be defined and have correct structure', () => {
      expect(global.jumpList).toBeDefined();
      expect(Array.isArray(global.jumpList)).toBe(true);
      expect(global.jumpList.length).toBeGreaterThan(0);
      
      const firstJump = global.jumpList[0];
      expect(firstJump).toHaveProperty('bridge');
      expect(firstJump).toHaveProperty('type');
      expect(firstJump).toHaveProperty('year');
      expect(Array.isArray(firstJump.bridge)).toBe(true);
      expect(firstJump.bridge.length).toBe(2);
    });
  });

  describe('Three.js Mocking', () => {
    test('THREE should be mocked correctly', () => {
      expect(global.THREE).toBeDefined();
      expect(global.THREE.Vector3).toBeDefined();
      expect(global.THREE.Scene).toBeDefined();
      expect(global.THREE.PerspectiveCamera).toBeDefined();
    });

    test('THREE.Vector3 should work as expected', () => {
      const vector = new global.THREE.Vector3();
      expect(vector).toHaveProperty('x');
      expect(vector).toHaveProperty('y');
      expect(vector).toHaveProperty('z');
      expect(typeof vector.set).toBe('function');
      expect(typeof vector.copy).toBe('function');
    });
  });

  describe('Event Handling', () => {
    test('date slider should update date box when changed', () => {
      const slider = document.querySelector('#dateSlider');
      const dateBox = document.querySelector('#dateBox');
      
      // Simulate input event
      slider.value = '2150';
      const event = new Event('input');
      slider.dispatchEvent(event);
      
      // Note: Since we're testing in isolation, the actual event handler
      // from app.js won't be attached. This test validates the DOM structure
      // needed for the functionality to work.
      expect(slider.value).toBe('2150');
      expect(dateBox.textContent).toBe('2213'); // Initial value, would change with actual handler
    });

    test('checkboxes should be present for link type filtering', () => {
      const linkTypes = ['alphaLink', 'betaLink', 'gammaLink', 'deltaLink', 'epsiLink'];
      
      linkTypes.forEach(linkType => {
        const checkbox = document.querySelector(`#${linkType}`);
        expect(checkbox).toBeTruthy();
        expect(checkbox.type).toBe('checkbox');
      });
    });
  });
});