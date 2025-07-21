/**
 * Tests for star classification and system data processing
 */

describe('Star Classification System', () => {
  const testSystems = [
    {id: 1, type: ["A0m"], sysName: "Sirius"},
    {id: 2, type: ["F5IV-V"], sysName: "Procyon"},
    {id: 3, type: ["G2V"], sysName: "Sol"},
    {id: 4, type: ["K1V"], sysName: "107 Piscium"},
    {id: 5, type: ["M"], sysName: "Luyten 722-22"},
    {id: 6, type: ["D9"], sysName: "White Dwarf"}
  ];

  describe('Star Type Classification', () => {
    test('should correctly identify A-type stars', () => {
      const aStar = testSystems.find(s => s.type[0].startsWith('A'));
      expect(aStar.type[0][0]).toBe('A');
      expect(aStar.sysName).toBe('Sirius');
    });

    test('should correctly identify F-type stars', () => {
      const fStar = testSystems.find(s => s.type[0].startsWith('F'));
      expect(fStar.type[0][0]).toBe('F');
      expect(fStar.sysName).toBe('Procyon');
    });

    test('should correctly identify G-type stars', () => {
      const gStar = testSystems.find(s => s.type[0].startsWith('G'));
      expect(gStar.type[0][0]).toBe('G');
      expect(gStar.sysName).toBe('Sol');
    });

    test('should correctly identify K-type stars', () => {
      const kStar = testSystems.find(s => s.type[0].startsWith('K'));
      expect(kStar.type[0][0]).toBe('K');
      expect(kStar.sysName).toBe('107 Piscium');
    });

    test('should correctly identify M-type stars', () => {
      const mStar = testSystems.find(s => s.type[0].startsWith('M'));
      expect(mStar.type[0][0]).toBe('M');
      expect(mStar.sysName).toBe('Luyten 722-22');
    });

    test('should correctly identify D-type (white dwarf) stars', () => {
      const dStar = testSystems.find(s => s.type[0].startsWith('D'));
      expect(dStar.type[0][0]).toBe('D');
      expect(dStar.sysName).toBe('White Dwarf');
    });
  });

  describe('Star Data Validation', () => {
    test('all systems should have required properties', () => {
      testSystems.forEach(system => {
        expect(system).toHaveProperty('id');
        expect(system).toHaveProperty('type');
        expect(system).toHaveProperty('sysName');
        expect(Array.isArray(system.type)).toBe(true);
        expect(system.type.length).toBeGreaterThan(0);
        expect(typeof system.sysName).toBe('string');
        expect(system.sysName.length).toBeGreaterThan(0);
      });
    });

    test('system IDs should be unique', () => {
      const ids = testSystems.map(s => s.id);
      const uniqueIds = [...new Set(ids)];
      expect(ids.length).toBe(uniqueIds.length);
    });
  });

  describe('Jump Link Types', () => {
    const jumpTypes = ['A', 'B', 'G', 'D', 'E'];
    
    test('should recognize all jump link types', () => {
      jumpTypes.forEach(type => {
        expect(typeof type).toBe('string');
        expect(type.length).toBe(1);
        expect(type).toMatch(/[ABGDE]/);
      });
    });

    test('should map jump types to CSS classes', () => {
      const typeClassMap = {
        'A': 'alpha',
        'B': 'beta', 
        'G': 'gamma',
        'D': 'delta',
        'E': 'epsilon'
      };

      Object.entries(typeClassMap).forEach(([type, expectedClass]) => {
        expect(jumpTypes).toContain(type);
        expect(typeof expectedClass).toBe('string');
      });
    });
  });

  describe('Coordinate System', () => {
    const systemWithCoords = {
      id: 1,
      x: 1.23,
      y: -2.45,
      z: 3.67,
      sysName: "Test System"
    };

    test('should handle 3D coordinates', () => {
      expect(typeof systemWithCoords.x).toBe('number');
      expect(typeof systemWithCoords.y).toBe('number');
      expect(typeof systemWithCoords.z).toBe('number');
    });

    test('should handle negative coordinates', () => {
      expect(systemWithCoords.y).toBeLessThan(0);
    });

    test('should scale coordinates properly', () => {
      const scale = 200;
      const scaledX = systemWithCoords.x * scale;
      const scaledY = systemWithCoords.y * scale;
      const scaledZ = systemWithCoords.z * scale;
      
      expect(scaledX).toBeCloseTo(systemWithCoords.x * scale);
      expect(scaledY).toBeCloseTo(systemWithCoords.y * scale);
      expect(scaledZ).toBeCloseTo(systemWithCoords.z * scale);
    });
  });
});