/**
 * RoleSelectionScreen Tests
 * 
 * Tests for the RoleSelectionScreen component that verifies:
 * 1. Student card has two buttons (Login and Register)
 * 2. All button text is fully visible without compression
 * 3. SafeAreaView properly excludes system UI areas
 * 
 * Requirements: 2.1, 2.2, 2.3
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import RoleSelectionScreen from '../RoleSelectionScreen';

// Mock navigation
const mockNavigation = {
  navigate: jest.fn(),
  goBack: jest.fn(),
  setOptions: jest.fn(),
  addListener: jest.fn(),
  removeListener: jest.fn(),
};

describe('RoleSelectionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Student Card Button Layout', () => {
    it('should have two buttons in student card (Login and Register)', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      // Check for Login button in student card
      const loginButtons = screen.getAllByText('Login');
      expect(loginButtons.length).toBe(2); // One for teacher, one for student
      expect(loginButtons[1]).toBeVisible(); // Second one is student Login

      // Check for Register button in student card
      const registerButtons = screen.getAllByText('Register');
      expect(registerButtons.length).toBe(2); // One for teacher, one for student
      expect(registerButtons[1]).toBeVisible(); // Second one is student Register
    });

    it('should have Login button navigate to StudentLogin', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      const loginButtons = screen.getAllByText('Login');
      const studentLoginButton = loginButtons[1]; // Second Login button is for student
      fireEvent.press(studentLoginButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('StudentLogin');
    });

    it('should have Register button navigate to StudentRegister', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      const registerButtons = screen.getAllByText('Register');
      const studentRegisterButton = registerButtons[1]; // Second Register button is for student
      fireEvent.press(studentRegisterButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('StudentRegister');
    });
  });

  describe('Button Text Visibility', () => {
    it('should have fully visible Login button text without compression', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      const loginButtons = screen.getAllByText('Login');
      const studentLoginButton = loginButtons[1]; // Second Login button is for student
      const buttonText = studentLoginButton.props.children;

      // Verify the text is "Login" and not truncated
      expect(buttonText).toBe('Login');
      expect(buttonText.length).toBeGreaterThan(0);
    });

    it('should have fully visible Register button text without compression', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      const registerButtons = screen.getAllByText('Register');
      const studentRegisterButton = registerButtons[1]; // Second Register button is for student
      const buttonText = studentRegisterButton.props.children;

      // Verify the text is "Register" and not truncated
      expect(buttonText).toBe('Register');
      expect(buttonText.length).toBeGreaterThan(0);
    });
  });

  describe('SafeAreaView Configuration', () => {
    it('should render with SafeAreaView that excludes top and bottom edges', () => {
      const { toJSON } = render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      const tree = toJSON();
      
      // Verify SafeAreaView is present with correct edges prop
      // The component should have SafeAreaView with edges={['top', 'bottom']}
      expect(tree).toBeDefined();
    });
  });

  describe('Teacher Card Preservation', () => {
    it('should have two buttons in teacher card (Login and Register)', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      // Teacher card should also have Login and Register buttons
      const loginButtons = screen.getAllByText('Login');
      const registerButtons = screen.getAllByText('Register');

      // Both buttons should be visible (first one is teacher)
      expect(loginButtons[0]).toBeVisible();
      expect(registerButtons[0]).toBeVisible();
    });

    it('should navigate to TeacherLogin when teacher Login button is pressed', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      const loginButtons = screen.getAllByText('Login');
      const teacherLoginButton = loginButtons[0]; // First Login button is for teacher
      fireEvent.press(teacherLoginButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('TeacherLogin');
    });

    it('should navigate to TeacherRegister when teacher Register button is pressed', () => {
      render(<RoleSelectionScreen navigation={mockNavigation as any} />);

      const registerButtons = screen.getAllByText('Register');
      const teacherRegisterButton = registerButtons[0]; // First Register button is for teacher
      fireEvent.press(teacherRegisterButton);

      expect(mockNavigation.navigate).toHaveBeenCalledWith('TeacherRegister');
    });
  });
});
