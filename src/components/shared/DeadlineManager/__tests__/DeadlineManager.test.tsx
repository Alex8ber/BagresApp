/**
 * DeadlineManager Component Tests
 */

import React from 'react';
import { render } from '@testing-library/react-native';

// Mock dependencies before importing component
jest.mock('@react-native-community/datetimepicker', () => 'DateTimePicker');

// Import after mocks
const DeadlineManager = require('../DeadlineManager').DeadlineManager;

describe('DeadlineManager', () => {
  const mockOnChangeFrom = jest.fn();
  const mockOnChangeUntil = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with null dates', () => {
    const { getByText } = render(
      <DeadlineManager
        availableFrom={null}
        availableUntil={null}
        onChangeFrom={mockOnChangeFrom}
        onChangeUntil={mockOnChangeUntil}
      />
    );

    expect(getByText('Disponible desde')).toBeTruthy();
    expect(getByText('Disponible hasta')).toBeTruthy();
  });

  it('displays error message when provided', () => {
    const errorMessage = 'La fecha de cierre debe ser posterior a la fecha de inicio';

    const { getByText } = render(
      <DeadlineManager
        availableFrom={null}
        availableUntil={null}
        onChangeFrom={mockOnChangeFrom}
        onChangeUntil={mockOnChangeUntil}
        error={errorMessage}
      />
    );

    expect(getByText(errorMessage)).toBeTruthy();
  });
});
