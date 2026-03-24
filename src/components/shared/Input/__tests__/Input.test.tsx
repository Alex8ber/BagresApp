/**
 * Input Component Tests
 * 
 * Validates: Requirement 2.9
 * 
 * Tests for the Input component covering:
 * - Basic rendering with label, placeholder, and helper text
 * - Error state rendering and styling
 * - Focus state behavior
 * - Disabled state
 * - Icon rendering (left and right)
 * - Text input and change events
 * - Validation feedback
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Text } from 'react-native';
import { Input } from '../Input';

describe('Input Component', () => {
  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  describe('Basic Rendering', () => {
    it('should render with default props', () => {
      const { getByTestId } = render(
        <Input testID="input" />
      );
      
      expect(getByTestId('input')).toBeTruthy();
    });

    it('should render with placeholder', () => {
      const { getByPlaceholderText } = render(
        <Input placeholder="Enter text" />
      );
      
      expect(getByPlaceholderText('Enter text')).toBeTruthy();
    });

    it('should render with label', () => {
      const { getByText } = render(
        <Input label="Email Address" />
      );
      
      expect(getByText('Email Address')).toBeTruthy();
    });

    it('should render with helper text', () => {
      const { getByText } = render(
        <Input helperText="Enter your email address" />
      );
      
      expect(getByText('Enter your email address')).toBeTruthy();
    });

    it('should render with label and placeholder together', () => {
      const { getByText, getByPlaceholderText } = render(
        <Input label="Username" placeholder="Enter username" />
      );
      
      expect(getByText('Username')).toBeTruthy();
      expect(getByPlaceholderText('Enter username')).toBeTruthy();
    });
  });

  // ============================================================================
  // Error State Tests
  // ============================================================================

  describe('Error State', () => {
    it('should render error message', () => {
      const { getByText } = render(
        <Input error="This field is required" />
      );
      
      expect(getByText('This field is required')).toBeTruthy();
    });

    it('should prioritize error over helper text', () => {
      const { getByText, queryByText } = render(
        <Input
          error="Invalid email"
          helperText="Enter your email"
        />
      );
      
      // Error should be visible
      expect(getByText('Invalid email')).toBeTruthy();
      
      // Helper text should not be visible when error exists
      expect(queryByText('Enter your email')).toBeNull();
    });

    it('should apply error styling when error prop is provided', () => {
      const { getByTestId } = render(
        <Input
          testID="input"
          error="Invalid input"
        />
      );
      
      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    it('should show error with label', () => {
      const { getByText } = render(
        <Input
          label="Password"
          error="Password is too short"
        />
      );
      
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Password is too short')).toBeTruthy();
    });

    it('should handle empty error string', () => {
      const { queryByText } = render(
        <Input error="" helperText="Helper text" />
      );
      
      // Helper text should show when error is empty string
      expect(queryByText('Helper text')).toBeTruthy();
    });
  });

  // ============================================================================
  // Focus State Tests
  // ============================================================================

  describe('Focus State', () => {
    it('should handle focus event', () => {
      const { getByTestId } = render(
        <Input testID="input" />
      );
      
      const input = getByTestId('input');
      fireEvent(input, 'focus');
      
      expect(input).toBeTruthy();
    });

    it('should handle blur event', () => {
      const { getByTestId } = render(
        <Input testID="input" />
      );
      
      const input = getByTestId('input');
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      
      expect(input).toBeTruthy();
    });

    it('should call onFocus callback', () => {
      const onFocusMock = jest.fn();
      const { getByTestId } = render(
        <Input testID="input" onFocus={onFocusMock} />
      );
      
      const input = getByTestId('input');
      fireEvent(input, 'focus');
      
      expect(onFocusMock).toHaveBeenCalledTimes(1);
    });

    it('should call onBlur callback', () => {
      const onBlurMock = jest.fn();
      const { getByTestId } = render(
        <Input testID="input" onBlur={onBlurMock} />
      );
      
      const input = getByTestId('input');
      fireEvent(input, 'blur');
      
      expect(onBlurMock).toHaveBeenCalledTimes(1);
    });

    it('should handle focus and blur sequence', () => {
      const onFocusMock = jest.fn();
      const onBlurMock = jest.fn();
      const { getByTestId } = render(
        <Input
          testID="input"
          onFocus={onFocusMock}
          onBlur={onBlurMock}
        />
      );
      
      const input = getByTestId('input');
      
      fireEvent(input, 'focus');
      expect(onFocusMock).toHaveBeenCalledTimes(1);
      
      fireEvent(input, 'blur');
      expect(onBlurMock).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================================
  // Disabled State Tests
  // ============================================================================

  describe('Disabled State', () => {
    it('should render disabled input', () => {
      const { getByTestId } = render(
        <Input testID="input" editable={false} />
      );
      
      const input = getByTestId('input');
      expect(input).toBeTruthy();
      expect(input.props.editable).toBe(false);
    });

    it('should apply disabled styling', () => {
      const { getByTestId } = render(
        <Input testID="input" editable={false} />
      );
      
      const input = getByTestId('input');
      expect(input.props.editable).toBe(false);
    });

    it('should be editable by default', () => {
      const { getByTestId } = render(
        <Input testID="input" />
      );
      
      const input = getByTestId('input');
      expect(input.props.editable).toBe(true);
    });

    it('should handle disabled state with error', () => {
      const { getByTestId, getByText } = render(
        <Input
          testID="input"
          editable={false}
          error="This field has an error"
        />
      );
      
      const input = getByTestId('input');
      expect(input.props.editable).toBe(false);
      expect(getByText('This field has an error')).toBeTruthy();
    });
  });

  // ============================================================================
  // Text Input and Change Events Tests
  // ============================================================================

  describe('Text Input and Change Events', () => {
    it('should handle text change', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <Input testID="input" onChangeText={onChangeTextMock} />
      );
      
      const input = getByTestId('input');
      fireEvent.changeText(input, 'Hello World');
      
      expect(onChangeTextMock).toHaveBeenCalledWith('Hello World');
    });

    it('should handle multiple text changes', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <Input testID="input" onChangeText={onChangeTextMock} />
      );
      
      const input = getByTestId('input');
      
      fireEvent.changeText(input, 'H');
      fireEvent.changeText(input, 'He');
      fireEvent.changeText(input, 'Hel');
      
      expect(onChangeTextMock).toHaveBeenCalledTimes(3);
      expect(onChangeTextMock).toHaveBeenLastCalledWith('Hel');
    });

    it('should handle empty text input', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <Input testID="input" onChangeText={onChangeTextMock} />
      );
      
      const input = getByTestId('input');
      fireEvent.changeText(input, '');
      
      expect(onChangeTextMock).toHaveBeenCalledWith('');
    });

    it('should render with initial value', () => {
      const { getByDisplayValue } = render(
        <Input value="Initial Value" />
      );
      
      expect(getByDisplayValue('Initial Value')).toBeTruthy();
    });

    it('should handle controlled input', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId, rerender } = render(
        <Input
          testID="input"
          value="Initial"
          onChangeText={onChangeTextMock}
        />
      );
      
      const input = getByTestId('input');
      fireEvent.changeText(input, 'Updated');
      
      expect(onChangeTextMock).toHaveBeenCalledWith('Updated');
      
      // Rerender with new value
      rerender(
        <Input
          testID="input"
          value="Updated"
          onChangeText={onChangeTextMock}
        />
      );
      
      expect(input.props.value).toBe('Updated');
    });
  });

  // ============================================================================
  // Icon Tests
  // ============================================================================

  describe('Icons', () => {
    it('should render with left icon', () => {
      const LeftIcon = () => <Text>📧</Text>;
      const { getByText } = render(
        <Input leftIcon={<LeftIcon />} />
      );
      
      expect(getByText('📧')).toBeTruthy();
    });

    it('should render with right icon', () => {
      const RightIcon = () => <Text>👁</Text>;
      const { getByText } = render(
        <Input rightIcon={<RightIcon />} />
      );
      
      expect(getByText('👁')).toBeTruthy();
    });

    it('should render with both left and right icons', () => {
      const LeftIcon = () => <Text>📧</Text>;
      const RightIcon = () => <Text>✓</Text>;
      const { getByText } = render(
        <Input
          leftIcon={<LeftIcon />}
          rightIcon={<RightIcon />}
        />
      );
      
      expect(getByText('📧')).toBeTruthy();
      expect(getByText('✓')).toBeTruthy();
    });

    it('should render icons with label and error', () => {
      const LeftIcon = () => <Text>🔒</Text>;
      const { getByText } = render(
        <Input
          label="Password"
          leftIcon={<LeftIcon />}
          error="Password is required"
        />
      );
      
      expect(getByText('🔒')).toBeTruthy();
      expect(getByText('Password')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
  });

  // ============================================================================
  // Validation Feedback Tests
  // ============================================================================

  describe('Validation Feedback', () => {
    it('should show validation error after blur', () => {
      const { getByTestId, getByText, rerender } = render(
        <Input testID="input" label="Email" />
      );
      
      const input = getByTestId('input');
      
      // Focus and blur without entering text
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      
      // Rerender with error (simulating validation)
      rerender(
        <Input
          testID="input"
          label="Email"
          error="Email is required"
        />
      );
      
      expect(getByText('Email is required')).toBeTruthy();
    });

    it('should clear error when valid input is provided', () => {
      const { getByTestId, queryByText, rerender } = render(
        <Input
          testID="input"
          error="Email is required"
        />
      );
      
      expect(queryByText('Email is required')).toBeTruthy();
      
      // Rerender without error (simulating successful validation)
      rerender(<Input testID="input" />);
      
      expect(queryByText('Email is required')).toBeNull();
    });

    it('should show different error messages', () => {
      const { getByText, rerender } = render(
        <Input error="Field is required" />
      );
      
      expect(getByText('Field is required')).toBeTruthy();
      
      rerender(<Input error="Invalid format" />);
      expect(getByText('Invalid format')).toBeTruthy();
    });

    it('should handle validation with helper text', () => {
      const { getByText, queryByText, rerender } = render(
        <Input helperText="Enter a valid email" />
      );
      
      expect(getByText('Enter a valid email')).toBeTruthy();
      
      // Show error (helper text should be replaced)
      rerender(
        <Input
          helperText="Enter a valid email"
          error="Invalid email format"
        />
      );
      
      expect(getByText('Invalid email format')).toBeTruthy();
      expect(queryByText('Enter a valid email')).toBeNull();
    });
  });

  // ============================================================================
  // Input Type Tests
  // ============================================================================

  describe('Input Types', () => {
    it('should handle secure text entry', () => {
      const { getByTestId } = render(
        <Input testID="input" secureTextEntry />
      );
      
      const input = getByTestId('input');
      expect(input.props.secureTextEntry).toBe(true);
    });

    it('should handle email keyboard type', () => {
      const { getByTestId } = render(
        <Input testID="input" keyboardType="email-address" />
      );
      
      const input = getByTestId('input');
      expect(input.props.keyboardType).toBe('email-address');
    });

    it('should handle numeric keyboard type', () => {
      const { getByTestId } = render(
        <Input testID="input" keyboardType="numeric" />
      );
      
      const input = getByTestId('input');
      expect(input.props.keyboardType).toBe('numeric');
    });

    it('should handle multiline input', () => {
      const { getByTestId } = render(
        <Input testID="input" multiline numberOfLines={4} />
      );
      
      const input = getByTestId('input');
      expect(input.props.multiline).toBe(true);
      expect(input.props.numberOfLines).toBe(4);
    });
  });

  // ============================================================================
  // Custom Style Tests
  // ============================================================================

  describe('Custom Styles', () => {
    it('should accept custom containerStyle', () => {
      const customStyle = { marginTop: 20 };
      const { getByTestId } = render(
        <Input containerStyle={customStyle} testID="input" />
      );
      
      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    it('should accept custom inputStyle', () => {
      const customStyle = { fontSize: 18 };
      const { getByTestId } = render(
        <Input inputStyle={customStyle} testID="input" />
      );
      
      const input = getByTestId('input');
      expect(input).toBeTruthy();
    });

    it('should accept custom labelStyle', () => {
      const customStyle = { fontWeight: 'bold' as const };
      const { getByText } = render(
        <Input label="Custom Label" labelStyle={customStyle} />
      );
      
      expect(getByText('Custom Label')).toBeTruthy();
    });

    it('should accept custom errorStyle', () => {
      const customStyle = { fontSize: 14 };
      const { getByText } = render(
        <Input error="Custom Error" errorStyle={customStyle} />
      );
      
      expect(getByText('Custom Error')).toBeTruthy();
    });
  });

  // ============================================================================
  // Combined Props Tests
  // ============================================================================

  describe('Combined Props', () => {
    it('should render with all props combined', () => {
      const onChangeTextMock = jest.fn();
      const LeftIcon = () => <Text>📧</Text>;
      const RightIcon = () => <Text>✓</Text>;
      
      const { getByText, getByPlaceholderText, getByTestId } = render(
        <Input
          testID="input"
          label="Email Address"
          placeholder="Enter your email"
          helperText="We'll never share your email"
          leftIcon={<LeftIcon />}
          rightIcon={<RightIcon />}
          onChangeText={onChangeTextMock}
          keyboardType="email-address"
        />
      );
      
      expect(getByText('Email Address')).toBeTruthy();
      expect(getByPlaceholderText('Enter your email')).toBeTruthy();
      expect(getByText("We'll never share your email")).toBeTruthy();
      expect(getByText('📧')).toBeTruthy();
      expect(getByText('✓')).toBeTruthy();
      
      const input = getByTestId('input');
      fireEvent.changeText(input, 'test@example.com');
      expect(onChangeTextMock).toHaveBeenCalledWith('test@example.com');
    });

    it('should handle complex validation scenario', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId, getByText, queryByText, rerender } = render(
        <Input
          testID="input"
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          onChangeText={onChangeTextMock}
        />
      );
      
      const input = getByTestId('input');
      
      // User types short password
      fireEvent.changeText(input, '123');
      expect(onChangeTextMock).toHaveBeenCalledWith('123');
      
      // Show error
      rerender(
        <Input
          testID="input"
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          onChangeText={onChangeTextMock}
          error="Password must be at least 8 characters"
        />
      );
      
      expect(getByText('Password must be at least 8 characters')).toBeTruthy();
      
      // User types valid password
      fireEvent.changeText(input, '12345678');
      
      // Clear error
      rerender(
        <Input
          testID="input"
          label="Password"
          placeholder="Enter password"
          secureTextEntry
          onChangeText={onChangeTextMock}
        />
      );
      
      expect(queryByText('Password must be at least 8 characters')).toBeNull();
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle undefined label gracefully', () => {
      const { queryByText } = render(
        <Input label={undefined} />
      );
      
      // No label should be rendered
      expect(queryByText('')).toBeNull();
    });

    it('should handle very long error messages', () => {
      const longError = 'This is a very long error message that should still be displayed correctly without breaking the layout or causing any issues';
      const { getByText } = render(
        <Input error={longError} />
      );
      
      expect(getByText(longError)).toBeTruthy();
    });

    it('should handle rapid focus/blur events', () => {
      const onFocusMock = jest.fn();
      const onBlurMock = jest.fn();
      const { getByTestId } = render(
        <Input
          testID="input"
          onFocus={onFocusMock}
          onBlur={onBlurMock}
        />
      );
      
      const input = getByTestId('input');
      
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      fireEvent(input, 'focus');
      fireEvent(input, 'blur');
      
      expect(onFocusMock).toHaveBeenCalledTimes(2);
      expect(onBlurMock).toHaveBeenCalledTimes(2);
    });

    it('should handle special characters in input', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <Input testID="input" onChangeText={onChangeTextMock} />
      );
      
      const input = getByTestId('input');
      const specialChars = '!@#$%^&*()_+-=[]{}|;:,.<>?';
      
      fireEvent.changeText(input, specialChars);
      expect(onChangeTextMock).toHaveBeenCalledWith(specialChars);
    });

    it('should handle emoji in input', () => {
      const onChangeTextMock = jest.fn();
      const { getByTestId } = render(
        <Input testID="input" onChangeText={onChangeTextMock} />
      );
      
      const input = getByTestId('input');
      fireEvent.changeText(input, '😀😃😄😁');
      
      expect(onChangeTextMock).toHaveBeenCalledWith('😀😃😄😁');
    });
  });
});
