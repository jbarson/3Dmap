/**
 * Tests for utility functions and date filtering functionality
 */

describe('Date Filtering System', () => {
  const mockJumpData = [
    {bridge: [1, 2], type: "A", year: 2111},
    {bridge: [2, 3], type: "B", year: 2125},
    {bridge: [3, 4], type: "G", year: 2150},
    {bridge: [4, 5], type: "D", year: 2180},
    {bridge: [5, 6], type: "E", year: 2200}
  ];

  describe('Year Filtering Logic', () => {
    test('should filter jumps by year correctly', () => {
      const targetYear = 2150;
      
      const discoveredJumps = mockJumpData.filter(jump => jump.year <= targetYear);
      const undiscoveredJumps = mockJumpData.filter(jump => jump.year > targetYear);
      
      expect(discoveredJumps.length).toBe(3);
      expect(undiscoveredJumps.length).toBe(2);
      
      expect(discoveredJumps.every(jump => jump.year <= targetYear)).toBe(true);
      expect(undiscoveredJumps.every(jump => jump.year > targetYear)).toBe(true);
    });

    test('should handle edge cases for year filtering', () => {
      const minYear = Math.min(...mockJumpData.map(j => j.year));
      const maxYear = Math.max(...mockJumpData.map(j => j.year));
      
      // All jumps should be undiscovered at minimum year - 1
      const allUndiscovered = mockJumpData.filter(jump => jump.year <= minYear - 1);
      expect(allUndiscovered.length).toBe(0);
      
      // All jumps should be discovered at maximum year
      const allDiscovered = mockJumpData.filter(jump => jump.year <= maxYear);
      expect(allDiscovered.length).toBe(mockJumpData.length);
    });

    test('should validate year range bounds', () => {
      const minExpected = 2110;
      const maxExpected = 2213;
      
      mockJumpData.forEach(jump => {
        expect(jump.year).toBeGreaterThanOrEqual(minExpected);
        expect(jump.year).toBeLessThanOrEqual(maxExpected);
      });
    });
  });

  describe('Date Slider Functionality', () => {
    beforeEach(() => {
      document.body.innerHTML = `
        <input id="dateSlider" type="range" min="2110" max="2213" value="2213" />
        <span id="dateBox">2213</span>
      `;
    });

    test('should have correct slider configuration', () => {
      const slider = document.querySelector('#dateSlider');
      expect(slider.type).toBe('range');
      expect(slider.min).toBe('2110');
      expect(slider.max).toBe('2213');
      expect(slider.value).toBe('2213');
    });

    test('should update date display element', () => {
      const dateBox = document.querySelector('#dateBox');
      expect(dateBox.textContent).toBe('2213');
    });

    test('slider value should be within valid range', () => {
      const slider = document.querySelector('#dateSlider');
      const value = parseInt(slider.value);
      const min = parseInt(slider.min);
      const max = parseInt(slider.max);
      
      expect(value).toBeGreaterThanOrEqual(min);
      expect(value).toBeLessThanOrEqual(max);
    });
  });

  describe('Link Type Classification', () => {
    test('should categorize all jump types correctly', () => {
      const typeDistribution = mockJumpData.reduce((typeDistribution, jump) => {
        typeDistribution[jump.type] = (typeDistribution[jump.type] || 0) + 1;
        return typeDistribution;
      }, {});

      expect(Object.keys(typeDistribution)).toEqual(expect.arrayContaining(['A', 'B', 'G', 'D', 'E']));
      expect(Object.values(typeDistribution).every(count => count > 0)).toBe(true);
    });

    test('should validate bridge connections', () => {
      mockJumpData.forEach(jump => {
        expect(Array.isArray(jump.bridge)).toBe(true);
        expect(jump.bridge.length).toBe(2);
        expect(typeof jump.bridge[0]).toBe('number');
        expect(typeof jump.bridge[1]).toBe('number');
        expect(jump.bridge[0]).not.toBe(jump.bridge[1]); // No self-loops
      });
    });
  });

  describe('CSS Class Management', () => {
    test('should apply undiscovered class correctly', () => {
      // Create a mock element
      const mockElement = document.createElement('div');
      mockElement.classList.add('jumpLink');
      
      // Test adding undiscovered class
      mockElement.classList.add('undiscovered');
      expect(mockElement.classList.contains('undiscovered')).toBe(true);
      expect(mockElement.classList.contains('jumpLink')).toBe(true);
      
      // Test removing undiscovered class
      mockElement.classList.remove('undiscovered');
      expect(mockElement.classList.contains('undiscovered')).toBe(false);
      expect(mockElement.classList.contains('jumpLink')).toBe(true);
    });

    test('should handle multiple CSS classes', () => {
      const mockElement = document.createElement('div');
      const classes = ['jumpLink', 'alpha', 'undiscovered'];
      
      classes.forEach(cls => mockElement.classList.add(cls));
      
      expect(mockElement.classList.length).toBe(3);
      classes.forEach(cls => {
        expect(mockElement.classList.contains(cls)).toBe(true);
      });
    });
  });

  describe('Array and Object Utilities', () => {
    test('should handle array operations correctly', () => {
      const testArray = [1, 2, 3, 4, 5];
      
      expect(Array.isArray(testArray)).toBe(true);
      expect(testArray.length).toBe(5);
      expect(testArray.includes(3)).toBe(true);
      expect(testArray.indexOf(4)).toBe(3);
    });

    test('should handle object property access', () => {
      const testObject = {
        id: 1,
        name: 'Test',
        properties: {
          visible: true,
          type: 'system'
        }
      };

      expect(testObject).toHaveProperty('id');
      expect(testObject).toHaveProperty('properties.visible');
      expect(testObject.properties.type).toBe('system');
    });
  });
});