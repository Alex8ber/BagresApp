/**
 * Button Component Tests
 * 
 * Validates: Requirement 2.9
 * 
 * Tests for the Button component covering:
 * - Rendering with different variants (primary, secondary, outline, ghost)
 * - Rendering with different sizes (small, medium, large)
 * - Event handling (onPress)
 * - Loading state
 * - Disabled state
 * - fullWidth prop
 * - leftIcon and rightIcon props
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text, ActivityIndicator } from 'react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      const { getByText } = render(<Button>Click Me</Button>);
      
      expect(getByText('Click Me')).toBeTruthy();
    });

    it('should render children text correctly', () => {
      const { getByText } = render(<Button>Test Button</Button>);
      
      expect(getByText('Test Button')).toBeTruthy();
    });
  });

  // ============================================================================
  // Variant Tests
  // ============================================================================

  describe('Variants', () => {
    it('should render primary variant', () => {
      const { getByText } = render(
        <Button variant="primary">Primary Button</Button>
      );
      
      const button = getByText('Primary Button');
      expect(button).toBeTruthy();
    });

    it('should render secondary variant', () => {
      const { getByText } = render(
        <Button variant="secondary">Secondary Button</Button>
      );
      
      const button = getByText('Secondary Button');
      expect(button).toBeTruthy();
    });

    it('should render outline variant', () => {
      const { getByText } = render(
        <Button variant="outline">Outline Button</Button>
      );
      
      const button = getByText('Outline Button');
      expect(button).toBeTruthy();
    });

    it('should render ghost variant', () => {
      const { getByText } = render(
        <Button variant="ghost">Ghost Button</Button>
      );
      
      const button = getByText('Ghost Button');
      expect(button).toBeTruthy();
    });
  });

  // ============================================================================
  // Size Tests
  // ============================================================================

  describe('Sizes', () => {
    it('should render small size', () => {
      const { getByText } = render(
        <Button size="small">Small Button</Button>
      );
      
      const button = getByText('Small Button');
      expect(button).toBeTruthy();
    });

    it('should render medium size (default)', () => {
      const { getByText } = render(
        <Button size="medium">Medium Button</Button>
      );
      
      const button = getByText('Medium Button');
      expect(button).toBeTruthy();
    });

    it('should render large size', () => {
      const { getByText } = render(
        <Button size="large">Large Button</Button>
      );
      
      const button = getByText('Large Button');
      expect(button).toBeTruthy();
    });
  });

  // ============================================================================
  // Event Handling Tests
  // ============================================================================

  describe('Event Handling', () => {
    it('should call onPress when pressed', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button onPress={onPressMock}>Press Me</Button>
      );
      
      const button = getByText('Press Me');
      fireEvent.press(button);
      
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should not call onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button onPress={onPressMock} disabled>
          Disabled Button
        </Button>
      );
      
      const button = getByText('Disabled Button');
      fireEvent.press(button);
      
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should not call onPress when loading', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Button onPress={onPressMock} loading testID="loading-button">
          Loading Button
        </Button>
      );
      
      const button = getByTestId('loading-button');
      fireEvent.press(button);
      
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Loading State Tests
  // ============================================================================

  describe('Loading State', () => {
    it('should show loading indicator when loading=true', () => {
      const { queryByText, UNSAFE_getByType } = render(
        <Button loading>Loading Button</Button>
      );
      
      // Text should not be visible when loading
      expect(queryByText('Loading Button')).toBeNull();
      
      // ActivityIndicator should be present
      const activityIndicator = UNSAFE_getByType(ActivityIndicator);
      expect(activityIndicator).toBeTruthy();
    });

    it('should not show loading indicator when loading=false', () => {
      const { getByText, UNSAFE_queryByType } = render(
        <Button loading={false}>Not Loading</Button>
      );
      
      // Text should be visible
      expect(getByText('Not Loading')).toBeTruthy();
      
      // ActivityIndicator should not be present
      const activityIndicator = UNSAFE_queryByType(ActivityIndicator);
      expect(activityIndicator).toBeNull();
    });

    it('should disable button when loading', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Button onPress={onPressMock} loading testID="button">
          Loading
        </Button>
      );
      
      const button = getByTestId('button');
      fireEvent.press(button);
      
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Disabled State Tests
  // ============================================================================

  describe('Disabled State', () => {
    it('should render disabled button', () => {
      const { getByText } = render(
        <Button disabled>Disabled Button</Button>
      );
      
      const button = getByText('Disabled Button');
      expect(button).toBeTruthy();
    });

    it('should not trigger onPress when disabled', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button onPress={onPressMock} disabled>
          Disabled
        </Button>
      );
      
      const button = getByText('Disabled');
      fireEvent.press(button);
      
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should apply disabled state correctly', () => {
      const onPressMock = jest.fn();
      const { getByTestId } = render(
        <Button disabled testID="disabled-button" onPress={onPressMock}>
          Disabled
        </Button>
      );
      
      const button = getByTestId('disabled-button');
      expect(button).toBeTruthy();
      
      // Verify button doesn't respond to press when disabled
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Full Width Tests
  // ============================================================================

  describe('Full Width', () => {
    it('should render full width button', () => {
      const { getByTestId } = render(
        <Button fullWidth testID="full-width-button">
          Full Width
        </Button>
      );
      
      const button = getByTestId('full-width-button');
      expect(button).toBeTruthy();
    });

    it('should not be full width by default', () => {
      const { getByTestId } = render(
        <Button testID="normal-button">Normal Width</Button>
      );
      
      const button = getByTestId('normal-button');
      expect(button).toBeTruthy();
    });
  });

  // ============================================================================
  // Icon Tests
  // ============================================================================

  describe('Icons', () => {
    it('should render with left icon', () => {
      const LeftIcon = () => <Text>←</Text>;
      const { getByText } = render(
        <Button leftIcon={<LeftIcon />}>With Left Icon</Button>
      );
      
      expect(getByText('←')).toBeTruthy();
      expect(getByText('With Left Icon')).toBeTruthy();
    });

    it('should render with right icon', () => {
      const RightIcon = () => <Text>→</Text>;
      const { getByText } = render(
        <Button rightIcon={<RightIcon />}>With Right Icon</Button>
      );
      
      expect(getByText('→')).toBeTruthy();
      expect(getByText('With Right Icon')).toBeTruthy();
    });

    it('should render with both left and right icons', () => {
      const LeftIcon = () => <Text>←</Text>;
      const RightIcon = () => <Text>→</Text>;
      const { getByText } = render(
        <Button leftIcon={<LeftIcon />} rightIcon={<RightIcon />}>
          Both Icons
        </Button>
      );
      
      expect(getByText('←')).toBeTruthy();
      expect(getByText('→')).toBeTruthy();
      expect(getByText('Both Icons')).toBeTruthy();
    });

    it('should not render icons when loading', () => {
      const LeftIcon = () => <Text>←</Text>;
      const RightIcon = () => <Text>→</Text>;
      const { queryByText, UNSAFE_getByType } = render(
        <Button
          loading
          leftIcon={<LeftIcon />}
          rightIcon={<RightIcon />}
        >
          Loading with Icons
        </Button>
      );
      
      // Icons and text should not be visible
      expect(queryByText('←')).toBeNull();
      expect(queryByText('→')).toBeNull();
      expect(queryByText('Loading with Icons')).toBeNull();
      
      // Only ActivityIndicator should be present
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
    });
  });

  // ============================================================================
  // Combined Props Tests
  // ============================================================================

  describe('Combined Props', () => {
    it('should render with multiple props combined', () => {
      const onPressMock = jest.fn();
      const LeftIcon = () => <Text>★</Text>;
      
      const { getByText } = render(
        <Button
          variant="primary"
          size="large"
          fullWidth
          leftIcon={<LeftIcon />}
          onPress={onPressMock}
        >
          Complex Button
        </Button>
      );
      
      const button = getByText('Complex Button');
      expect(button).toBeTruthy();
      expect(getByText('★')).toBeTruthy();
      
      fireEvent.press(button);
      expect(onPressMock).toHaveBeenCalledTimes(1);
    });

    it('should handle all variants with all sizes', () => {
      const variants: Array<'primary' | 'secondary' | 'outline' | 'ghost'> = [
        'primary',
        'secondary',
        'outline',
        'ghost',
      ];
      const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];
      
      variants.forEach((variant) => {
        sizes.forEach((size) => {
          const { getByText } = render(
            <Button variant={variant} size={size}>
              {`${variant}-${size}`}
            </Button>
          );
          
          expect(getByText(`${variant}-${size}`)).toBeTruthy();
        });
      });
    });
  });

  // ============================================================================
  // Custom Style Tests
  // ============================================================================

  describe('Custom Styles', () => {
    it('should accept custom style prop', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <Button style={customStyle} testID="styled-button">
          Styled Button
        </Button>
      );
      
      const button = getByTestId('styled-button');
      expect(button).toBeTruthy();
    });

    it('should accept custom textStyle prop', () => {
      const customTextStyle = { fontWeight: 'bold' as const };
      const { getByText } = render(
        <Button textStyle={customTextStyle}>
          Custom Text Style
        </Button>
      );
      
      const text = getByText('Custom Text Style');
      expect(text).toBeTruthy();
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle empty children gracefully', () => {
      const { getByTestId } = render(
        <Button testID="empty-button">{''}</Button>
      );
      
      const button = getByTestId('empty-button');
      expect(button).toBeTruthy();
    });

    it('should handle disabled and loading together', () => {
      const onPressMock = jest.fn();
      const { getByTestId, UNSAFE_getByType } = render(
        <Button
          disabled
          loading
          onPress={onPressMock}
          testID="disabled-loading-button"
        >
          Disabled and Loading
        </Button>
      );
      
      const button = getByTestId('disabled-loading-button');
      expect(button).toBeTruthy();
      expect(UNSAFE_getByType(ActivityIndicator)).toBeTruthy();
      
      fireEvent.press(button);
      expect(onPressMock).not.toHaveBeenCalled();
    });

    it('should handle multiple rapid presses', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(
        <Button onPress={onPressMock}>Rapid Press</Button>
      );
      
      const button = getByText('Rapid Press');
      
      fireEvent.press(button);
      fireEvent.press(button);
      fireEvent.press(button);
      
      expect(onPressMock).toHaveBeenCalledTimes(3);
    });
  });
});
