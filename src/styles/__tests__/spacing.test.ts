/**
 * Spacing Utilities Tests
 * 
 * Tests for spacing utility functions to ensure consistent margin and padding.
 */

import {
  getSpacing,
  applyMargin,
  applyPadding,
  applySpacing,
  applyGap,
  applyGaps,
  marginTop,
  marginBottom,
  marginLeft,
  marginRight,
  paddingTop,
  paddingBottom,
  paddingLeft,
  paddingRight,
  spacingScale,
  spacingKeys,
  type SpacingKey,
  type SpacingValue,
} from '../spacing';

describe('Spacing Utilities', () => {
  describe('getSpacing', () => {
    it('should return correct pixel value for xs', () => {
      expect(getSpacing('xs')).toBe(4);
    });

    it('should return correct pixel value for base', () => {
      expect(getSpacing('base')).toBe(16);
    });

    it('should return correct pixel value for 3xl', () => {
      expect(getSpacing('3xl')).toBe(64);
    });

    it('should return values that follow 4px base unit', () => {
      const keys: SpacingKey[] = ['xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl', '3xl'];
      
      keys.forEach(key => {
        const value = getSpacing(key);
        expect(value % 4).toBe(0); // All values should be multiples of 4
      });
    });

    it('should return progressively larger values', () => {
      expect(getSpacing('xs')).toBeLessThan(getSpacing('sm'));
      expect(getSpacing('sm')).toBeLessThan(getSpacing('md'));
      expect(getSpacing('md')).toBeLessThan(getSpacing('base'));
      expect(getSpacing('base')).toBeLessThan(getSpacing('lg'));
      expect(getSpacing('lg')).toBeLessThan(getSpacing('xl'));
      expect(getSpacing('xl')).toBeLessThan(getSpacing('2xl'));
      expect(getSpacing('2xl')).toBeLessThan(getSpacing('3xl'));
    });
  });

  describe('applyMargin', () => {
    it('should apply margin to all sides with single value', () => {
      const style = applyMargin('base');
      expect(style).toEqual({ margin: 16 });
    });

    it('should apply vertical and horizontal margins', () => {
      const style = applyMargin({ vertical: 'lg', horizontal: 'md' });
      expect(style).toEqual({
        marginVertical: 24,
        marginHorizontal: 12,
      });
    });

    it('should apply individual side margins', () => {
      const style = applyMargin({
        top: 'xl',
        bottom: 'sm',
        left: 'base',
        right: 'base',
      });
      expect(style).toEqual({
        marginTop: 32,
        marginBottom: 8,
        marginLeft: 16,
        marginRight: 16,
      });
    });

    it('should handle partial individual sides', () => {
      const style = applyMargin({ top: 'lg', bottom: 'md' });
      expect(style).toEqual({
        marginTop: 24,
        marginBottom: 12,
      });
    });

    it('should be spreadable into style objects', () => {
      const style = {
        ...applyMargin('base'),
        backgroundColor: 'white',
      };

      expect(style).toHaveProperty('margin', 16);
      expect(style).toHaveProperty('backgroundColor', 'white');
    });
  });

  describe('applyPadding', () => {
    it('should apply padding to all sides with single value', () => {
      const style = applyPadding('base');
      expect(style).toEqual({ padding: 16 });
    });

    it('should apply vertical and horizontal paddings', () => {
      const style = applyPadding({ vertical: 'lg', horizontal: 'md' });
      expect(style).toEqual({
        paddingVertical: 24,
        paddingHorizontal: 12,
      });
    });

    it('should apply individual side paddings', () => {
      const style = applyPadding({
        top: 'xl',
        bottom: 'sm',
        left: 'base',
        right: 'base',
      });
      expect(style).toEqual({
        paddingTop: 32,
        paddingBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
      });
    });

    it('should handle partial individual sides', () => {
      const style = applyPadding({ top: 'lg', bottom: 'md' });
      expect(style).toEqual({
        paddingTop: 24,
        paddingBottom: 12,
      });
    });

    it('should be spreadable into style objects', () => {
      const style = {
        ...applyPadding('base'),
        backgroundColor: 'white',
      };

      expect(style).toHaveProperty('padding', 16);
      expect(style).toHaveProperty('backgroundColor', 'white');
    });
  });

  describe('applySpacing', () => {
    it('should apply both margin and padding with single values', () => {
      const style = applySpacing('base', 'lg');
      expect(style).toEqual({
        margin: 16,
        padding: 24,
      });
    });

    it('should apply both margin and padding with axes', () => {
      const style = applySpacing(
        { vertical: 'lg', horizontal: 'md' },
        { vertical: 'base', horizontal: 'sm' }
      );
      expect(style).toEqual({
        marginVertical: 24,
        marginHorizontal: 12,
        paddingVertical: 16,
        paddingHorizontal: 8,
      });
    });

    it('should combine margin and padding correctly', () => {
      const style = applySpacing(
        { top: 'xl', bottom: 'sm' },
        { left: 'base', right: 'base' }
      );
      expect(style).toEqual({
        marginTop: 32,
        marginBottom: 8,
        paddingLeft: 16,
        paddingRight: 16,
      });
    });
  });

  describe('applyGap', () => {
    it('should apply gap for flexbox layouts', () => {
      const style = applyGap('md');
      expect(style).toEqual({ gap: 12 });
    });

    it('should work with all spacing keys', () => {
      expect(applyGap('xs')).toEqual({ gap: 4 });
      expect(applyGap('base')).toEqual({ gap: 16 });
      expect(applyGap('3xl')).toEqual({ gap: 64 });
    });
  });

  describe('applyGaps', () => {
    it('should apply row and column gaps', () => {
      const style = applyGaps('lg', 'md');
      expect(style).toEqual({
        rowGap: 24,
        columnGap: 12,
      });
    });

    it('should handle same values for both gaps', () => {
      const style = applyGaps('base', 'base');
      expect(style).toEqual({
        rowGap: 16,
        columnGap: 16,
      });
    });
  });

  describe('Individual margin utilities', () => {
    it('marginTop should apply margin top', () => {
      expect(marginTop('base')).toEqual({ marginTop: 16 });
    });

    it('marginBottom should apply margin bottom', () => {
      expect(marginBottom('lg')).toEqual({ marginBottom: 24 });
    });

    it('marginLeft should apply margin left', () => {
      expect(marginLeft('sm')).toEqual({ marginLeft: 8 });
    });

    it('marginRight should apply margin right', () => {
      expect(marginRight('xl')).toEqual({ marginRight: 32 });
    });

    it('should be combinable', () => {
      const style = {
        ...marginTop('lg'),
        ...marginBottom('md'),
      };
      expect(style).toEqual({
        marginTop: 24,
        marginBottom: 12,
      });
    });
  });

  describe('Individual padding utilities', () => {
    it('paddingTop should apply padding top', () => {
      expect(paddingTop('base')).toEqual({ paddingTop: 16 });
    });

    it('paddingBottom should apply padding bottom', () => {
      expect(paddingBottom('lg')).toEqual({ paddingBottom: 24 });
    });

    it('paddingLeft should apply padding left', () => {
      expect(paddingLeft('sm')).toEqual({ paddingLeft: 8 });
    });

    it('paddingRight should apply padding right', () => {
      expect(paddingRight('xl')).toEqual({ paddingRight: 32 });
    });

    it('should be combinable', () => {
      const style = {
        ...paddingTop('lg'),
        ...paddingBottom('md'),
      };
      expect(style).toEqual({
        paddingTop: 24,
        paddingBottom: 12,
      });
    });
  });

  describe('spacingScale constant', () => {
    it('should contain all spacing keys', () => {
      expect(spacingScale).toHaveProperty('xs', 4);
      expect(spacingScale).toHaveProperty('sm', 8);
      expect(spacingScale).toHaveProperty('md', 12);
      expect(spacingScale).toHaveProperty('base', 16);
      expect(spacingScale).toHaveProperty('lg', 24);
      expect(spacingScale).toHaveProperty('xl', 32);
      expect(spacingScale).toHaveProperty('2xl', 48);
      expect(spacingScale).toHaveProperty('3xl', 64);
    });

    it('should match getSpacing results', () => {
      const keys: SpacingKey[] = ['xs', 'sm', 'md', 'base', 'lg', 'xl', '2xl', '3xl'];
      
      keys.forEach(key => {
        expect(spacingScale[key]).toBe(getSpacing(key));
      });
    });
  });

  describe('spacingKeys constant', () => {
    it('should contain all spacing keys as array', () => {
      expect(spacingKeys).toEqual([
        'xs',
        'sm',
        'md',
        'base',
        'lg',
        'xl',
        '2xl',
        '3xl',
      ]);
    });

    it('should be iterable', () => {
      spacingKeys.forEach(key => {
        expect(getSpacing(key)).toBeDefined();
      });
    });
  });

  describe('TypeScript types', () => {
    it('should enforce SpacingKey type', () => {
      // This test verifies TypeScript compilation
      const key1: SpacingKey = 'xs';
      const key2: SpacingKey = 'base';
      const key3: SpacingKey = '3xl';
      
      expect(getSpacing(key1)).toBeDefined();
      expect(getSpacing(key2)).toBeDefined();
      expect(getSpacing(key3)).toBeDefined();
    });

    it('should provide SpacingValue type', () => {
      // This test verifies TypeScript compilation
      const value: SpacingValue = getSpacing('base');
      
      expect(value).toBe(16);
    });
  });

  describe('Integration with StyleSheet', () => {
    it('should work with React Native StyleSheet pattern', () => {
      // Simulating StyleSheet.create usage
      const styles = {
        container: {
          ...applyPadding('base'),
          ...applyMargin({ bottom: 'md' }),
          backgroundColor: 'white',
        },
        card: {
          ...applyPadding({ vertical: 'lg', horizontal: 'base' }),
          ...marginBottom('sm'),
          backgroundColor: 'white',
          borderRadius: 8,
        },
        row: {
          flexDirection: 'row' as const,
          ...applyGap('md'),
        },
      };

      expect(styles.container.padding).toBe(16);
      expect(styles.container.marginBottom).toBe(12);
      expect(styles.card.paddingVertical).toBe(24);
      expect(styles.card.paddingHorizontal).toBe(16);
      expect(styles.card.marginBottom).toBe(8);
      expect(styles.row.gap).toBe(12);
    });

    it('should combine with other style properties', () => {
      const style = {
        ...applySpacing('base', 'lg'),
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
      };

      expect(style).toEqual({
        margin: 16,
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#ccc',
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle empty individual sides config', () => {
      const style = applyMargin({});
      expect(style).toEqual({});
    });

    it('should handle empty axes config', () => {
      const style = applyPadding({});
      expect(style).toEqual({});
    });

    it('should handle mixing margin and padding utilities', () => {
      const style = {
        ...marginTop('lg'),
        ...paddingTop('sm'),
        ...marginBottom('md'),
        ...paddingBottom('base'),
      };

      expect(style).toEqual({
        marginTop: 24,
        paddingTop: 8,
        marginBottom: 12,
        paddingBottom: 16,
      });
    });
  });

  describe('Consistency with theme', () => {
    it('should use values consistent with 4px base unit', () => {
      const values: SpacingValue[] = [4, 8, 12, 16, 24, 32, 48, 64];
      
      values.forEach(value => {
        expect(value % 4).toBe(0);
      });
    });

    it('should provide predictable scaling', () => {
      // xs to sm: 2x
      expect(getSpacing('sm')).toBe(getSpacing('xs') * 2);
      
      // sm to base: 2x
      expect(getSpacing('base')).toBe(getSpacing('sm') * 2);
      
      // base to xl: 2x
      expect(getSpacing('xl')).toBe(getSpacing('base') * 2);
      
      // xl to 3xl: 2x
      expect(getSpacing('3xl')).toBe(getSpacing('xl') * 2);
    });
  });
});
