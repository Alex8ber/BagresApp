/**
 * Shadow Utilities Tests
 * 
 * Tests for shadow utility functions to ensure consistent elevation styling.
 */

import {
  getShadow,
  applyShadow,
  createShadow,
  removeShadow,
  getShadowStyle,
  elevationLevels,
  shadows,
  type ElevationLevel,
  type ShadowStyle,
} from '../shadows';

describe('Shadow Utilities', () => {
  describe('getShadow', () => {
    it('should return shadow object for elevation 1', () => {
      const shadow = getShadow(1);
      expect(shadow).toEqual({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      });
    });

    it('should return shadow object for elevation 5', () => {
      const shadow = getShadow(5);
      expect(shadow).toEqual({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 16,
        elevation: 5,
      });
    });

    it('should return progressively deeper shadows for higher elevations', () => {
      const shadow1 = getShadow(1);
      const shadow3 = getShadow(3);
      const shadow5 = getShadow(5);

      expect(shadow3.shadowOffset.height).toBeGreaterThan(shadow1.shadowOffset.height);
      expect(shadow5.shadowOffset.height).toBeGreaterThan(shadow3.shadowOffset.height);
      
      expect(shadow3.shadowRadius).toBeGreaterThan(shadow1.shadowRadius);
      expect(shadow5.shadowRadius).toBeGreaterThan(shadow3.shadowRadius);
    });
  });

  describe('applyShadow', () => {
    it('should return the same result as getShadow', () => {
      const levels: ElevationLevel[] = [1, 2, 3, 4, 5];
      
      levels.forEach(level => {
        expect(applyShadow(level)).toEqual(getShadow(level));
      });
    });

    it('should be spreadable into style objects', () => {
      const style = {
        ...applyShadow(2),
        backgroundColor: 'white',
      };

      expect(style).toHaveProperty('shadowColor');
      expect(style).toHaveProperty('shadowOffset');
      expect(style).toHaveProperty('shadowOpacity');
      expect(style).toHaveProperty('shadowRadius');
      expect(style).toHaveProperty('elevation');
      expect(style).toHaveProperty('backgroundColor', 'white');
    });
  });

  describe('createShadow', () => {
    it('should create shadow with default values when no options provided', () => {
      const shadow = createShadow({});
      
      expect(shadow).toEqual({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
      });
    });

    it('should create shadow with custom color', () => {
      const shadow = createShadow({ color: '#FF0000' });
      
      expect(shadow.shadowColor).toBe('#FF0000');
    });

    it('should create shadow with custom offset', () => {
      const shadow = createShadow({ offsetX: 5, offsetY: 10 });
      
      expect(shadow.shadowOffset).toEqual({ width: 5, height: 10 });
    });

    it('should create shadow with custom opacity and radius', () => {
      const shadow = createShadow({ opacity: 0.5, radius: 20 });
      
      expect(shadow.shadowOpacity).toBe(0.5);
      expect(shadow.shadowRadius).toBe(20);
    });

    it('should create shadow with custom elevation', () => {
      const shadow = createShadow({ elevation: 10 });
      
      expect(shadow.elevation).toBe(10);
    });

    it('should allow combining multiple custom properties', () => {
      const shadow = createShadow({
        color: '#0000FF',
        offsetY: 8,
        opacity: 0.3,
        radius: 12,
        elevation: 4,
      });
      
      expect(shadow).toEqual({
        shadowColor: '#0000FF',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 4,
      });
    });
  });

  describe('removeShadow', () => {
    it('should return shadow with all values set to zero', () => {
      const shadow = removeShadow();
      
      expect(shadow).toEqual({
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0,
        shadowRadius: 0,
        elevation: 0,
      });
    });

    it('should effectively remove shadow when spread into style', () => {
      const style = {
        ...removeShadow(),
        backgroundColor: 'white',
      };

      expect(style.shadowOpacity).toBe(0);
      expect(style.elevation).toBe(0);
    });
  });

  describe('getShadowStyle', () => {
    it('should return shadow as ViewStyle compatible object', () => {
      const shadow = getShadowStyle(3);
      
      expect(shadow).toHaveProperty('shadowColor');
      expect(shadow).toHaveProperty('shadowOffset');
      expect(shadow).toHaveProperty('shadowOpacity');
      expect(shadow).toHaveProperty('shadowRadius');
      expect(shadow).toHaveProperty('elevation');
    });

    it('should return the same values as getShadow', () => {
      const levels: ElevationLevel[] = [1, 2, 3, 4, 5];
      
      levels.forEach(level => {
        expect(getShadowStyle(level)).toEqual(getShadow(level));
      });
    });
  });

  describe('shadows constant', () => {
    it('should contain all elevation levels', () => {
      expect(shadows).toHaveProperty('1');
      expect(shadows).toHaveProperty('2');
      expect(shadows).toHaveProperty('3');
      expect(shadows).toHaveProperty('4');
      expect(shadows).toHaveProperty('5');
    });

    it('should match getShadow results', () => {
      expect(shadows[1]).toEqual(getShadow(1));
      expect(shadows[2]).toEqual(getShadow(2));
      expect(shadows[3]).toEqual(getShadow(3));
      expect(shadows[4]).toEqual(getShadow(4));
      expect(shadows[5]).toEqual(getShadow(5));
    });
  });

  describe('elevationLevels constant', () => {
    it('should contain all elevation levels as array', () => {
      expect(elevationLevels).toEqual([1, 2, 3, 4, 5]);
    });

    it('should be iterable', () => {
      elevationLevels.forEach(level => {
        expect(getShadow(level)).toBeDefined();
      });
    });
  });

  describe('TypeScript types', () => {
    it('should enforce ElevationLevel type', () => {
      // This test verifies TypeScript compilation
      const level1: ElevationLevel = 1;
      const level5: ElevationLevel = 5;
      
      expect(getShadow(level1)).toBeDefined();
      expect(getShadow(level5)).toBeDefined();
    });

    it('should provide ShadowStyle type', () => {
      // This test verifies TypeScript compilation
      const shadow: ShadowStyle = getShadow(2);
      
      expect(shadow.shadowColor).toBeDefined();
      expect(shadow.shadowOffset).toBeDefined();
      expect(shadow.shadowOpacity).toBeDefined();
      expect(shadow.shadowRadius).toBeDefined();
      expect(shadow.elevation).toBeDefined();
    });
  });

  describe('Integration with StyleSheet', () => {
    it('should work with React Native StyleSheet pattern', () => {
      // Simulating StyleSheet.create usage
      const styles = {
        card: {
          ...applyShadow(2),
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
        },
        elevatedCard: {
          ...applyShadow(4),
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
        },
        flatCard: {
          ...removeShadow(),
          backgroundColor: 'white',
          borderRadius: 8,
          padding: 16,
        },
      };

      expect(styles.card.elevation).toBe(2);
      expect(styles.elevatedCard.elevation).toBe(4);
      expect(styles.flatCard.elevation).toBe(0);
    });
  });
});
