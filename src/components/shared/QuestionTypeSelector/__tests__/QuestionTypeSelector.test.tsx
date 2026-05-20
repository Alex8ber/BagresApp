/**
 * Unit Tests for QuestionTypeSelector Component
 * 
 * Tests the QuestionTypeSelector component which allows users to select
 * between three question types: single choice, multiple choice, and open-ended.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { QuestionTypeSelector } from '../QuestionTypeSelector';
import type { QuestionType } from '@/types/database';

describe('QuestionTypeSelector', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with default value', () => {
    const { getByText } = render(
      <QuestionTypeSelector
        value="single_choice"
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(getByText('Selección Simple')).toBeTruthy();
  });

  it('should display correct label for multiple_choice', () => {
    const { getByText } = render(
      <QuestionTypeSelector
        value="multiple_choice"
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(getByText('Selección Múltiple')).toBeTruthy();
  });

  it('should display correct label for open_ended', () => {
    const { getByText } = render(
      <QuestionTypeSelector
        value="open_ended"
        onChange={mockOnChange}
        disabled={false}
      />
    );

    expect(getByText('Respuesta Abierta')).toBeTruthy();
  });

  it('should call onChange when a new type is selected', () => {
    const { getByText } = render(
      <QuestionTypeSelector
        value="single_choice"
        onChange={mockOnChange}
        disabled={false}
      />
    );

    const multipleChoiceButton = getByText('Selección Múltiple');
    fireEvent.press(multipleChoiceButton);

    expect(mockOnChange).toHaveBeenCalledWith('multiple_choice');
  });

  it('should not call onChange when disabled', () => {
    const { getByText } = render(
      <QuestionTypeSelector
        value="single_choice"
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const multipleChoiceButton = getByText('Selección Múltiple');
    fireEvent.press(multipleChoiceButton);

    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
