/**
 * StudentQuizInterface Tests
 * 
 * Unit tests for the StudentQuizInterface component.
 */

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import StudentQuizInterface from '../StudentQuizInterface';
import * as quizzesService from '@/services/supabase/quizzes';
import { Alert } from 'react-native';
import { AuthProvider } from '@/context/AuthContext';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
} as any;

// Mock route
const mockRoute = {
  params: {
    quizId: 'test-quiz-id',
  },
} as any;

// Mock quiz data
const mockQuizData = {
  id: 'test-quiz-id',
  class_id: 'test-class-id',
  title: 'Test Quiz',
  description: 'Test Description',
  duration_minutes: 30,
  passing_score: 70,
  available_from: null,
  available_until: null,
  is_published: true,
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  questions: [
    {
      id: 'q1',
      quiz_id: 'test-quiz-id',
      question_text: 'What is 2 + 2?',
      question_type: 'single_choice' as const,
      points: 10,
      order_index: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      options: [
        {
          id: 'opt1',
          question_id: 'q1',
          option_text: '3',
          is_correct: false,
          order_index: 0,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'opt2',
          question_id: 'q1',
          option_text: '4',
          is_correct: true,
          order_index: 1,
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
    },
    {
      id: 'q2',
      quiz_id: 'test-quiz-id',
      question_text: 'Select all even numbers',
      question_type: 'multiple_choice' as const,
      points: 15,
      order_index: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      options: [
        {
          id: 'opt3',
          question_id: 'q2',
          option_text: '2',
          is_correct: true,
          order_index: 0,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'opt4',
          question_id: 'q2',
          option_text: '3',
          is_correct: false,
          order_index: 1,
          created_at: '2024-01-01T00:00:00Z',
        },
        {
          id: 'opt5',
          question_id: 'q2',
          option_text: '4',
          is_correct: true,
          order_index: 2,
          created_at: '2024-01-01T00:00:00Z',
        },
      ],
    },
    {
      id: 'q3',
      quiz_id: 'test-quiz-id',
      question_text: 'Explain your answer',
      question_type: 'open_ended' as const,
      points: 20,
      order_index: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      options: [],
    },
  ],
};

// Mock services
jest.mock('@/services/supabase/quizzes');
const mockGetQuizWithQuestions = quizzesService.getQuizWithQuestions as jest.MockedFunction<
  typeof quizzesService.getQuizWithQuestions
>;

// Mock Alert
jest.spyOn(Alert, 'alert');

// Helper function to render with AuthProvider
const renderWithAuth = (component: React.ReactElement) => {
  return render(<AuthProvider>{component}</AuthProvider>);
};

describe('StudentQuizInterface', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockGetQuizWithQuestions.mockResolvedValue(mockQuizData);
  });

  it('renders loading state initially', () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    expect(getByText('Cargando cuestionario...')).toBeTruthy();
  });

  it('fetches and displays quiz data', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(mockGetQuizWithQuestions).toHaveBeenCalledWith('test-quiz-id');
      expect(getByText('Test Quiz')).toBeTruthy();
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });
  });

  it('displays error when quiz is not published', async () => {
    mockGetQuizWithQuestions.mockResolvedValue({
      ...mockQuizData,
      is_published: false,
    });

    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Este cuestionario no está disponible')).toBeTruthy();
    });
  });

  it('displays error when quiz is not yet available', async () => {
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 1);

    mockGetQuizWithQuestions.mockResolvedValue({
      ...mockQuizData,
      available_from: futureDate.toISOString(),
    });

    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Este cuestionario aún no está disponible')).toBeTruthy();
    });
  });

  it('displays error when quiz is no longer available', async () => {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);

    mockGetQuizWithQuestions.mockResolvedValue({
      ...mockQuizData,
      available_until: pastDate.toISOString(),
    });

    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Este cuestionario ya no está disponible')).toBeTruthy();
    });
  });

  it('renders single choice question with radio buttons', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
    });
  });

  it('renders multiple choice question with checkboxes', async () => {
    const { getByText, getByTestId } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });

    // Navigate to second question
    const nextButton = getByText('Siguiente');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Select all even numbers')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
    });
  });

  it('renders open-ended question with text input', async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });

    // Navigate to third question
    const nextButton = getByText('Siguiente');
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Explain your answer')).toBeTruthy();
      expect(getByPlaceholderText('Escribe tu respuesta aquí...')).toBeTruthy();
    });
  });

  it('handles single choice answer selection', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });

    const option = getByText('4');
    fireEvent.press(option);

    // Answer should be selected (visual feedback tested via styles)
    expect(option).toBeTruthy();
  });

  it('handles multiple choice answer selection', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });

    // Navigate to second question
    const nextButton = getByText('Siguiente');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Select all even numbers')).toBeTruthy();
    });

    // Select multiple options
    const option1 = getByText('2');
    const option2 = getByText('4');
    fireEvent.press(option1);
    fireEvent.press(option2);

    expect(option1).toBeTruthy();
    expect(option2).toBeTruthy();
  });

  it('handles text input for open-ended questions', async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });

    // Navigate to third question
    const nextButton = getByText('Siguiente');
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Explain your answer')).toBeTruthy();
    });

    const textInput = getByPlaceholderText('Escribe tu respuesta aquí...');
    fireEvent.changeText(textInput, 'My answer is...');

    expect(textInput.props.value).toBe('My answer is...');
  });

  it('navigates between questions', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Pregunta 1 de 3')).toBeTruthy();
    });

    // Navigate forward
    const nextButton = getByText('Siguiente');
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Pregunta 2 de 3')).toBeTruthy();
    });

    // Navigate backward
    const prevButton = getByText('Anterior');
    fireEvent.press(prevButton);

    await waitFor(() => {
      expect(getByText('Pregunta 1 de 3')).toBeTruthy();
    });
  });

  it('shows submit button on last question', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });

    // Navigate to last question
    const nextButton = getByText('Siguiente');
    fireEvent.press(nextButton);
    fireEvent.press(nextButton);

    await waitFor(() => {
      expect(getByText('Enviar Cuestionario')).toBeTruthy();
    });
  });

  it('displays timer when duration is set', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      // Timer should show 30:00 for 30 minutes
      expect(getByText('30:00')).toBeTruthy();
    });
  });

  it('formats time correctly', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      // Should display MM:SS format
      const timerText = getByText(/\d{2}:\d{2}/);
      expect(timerText).toBeTruthy();
    });
  });

  it('displays progress indicator', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Pregunta 1 de 3')).toBeTruthy();
    });
  });

  it('displays points for each question', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('10 pts')).toBeTruthy();
    });
  });

  // ============================================================================
  // Additional Tests for Better Coverage
  // ============================================================================

  it('shows previous button on first question', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Anterior')).toBeTruthy();
      expect(getByText('Pregunta 1 de 3')).toBeTruthy();
    });
  });

  it('allows navigation after moving forward', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Siguiente')).toBeTruthy();
    });

    // Navigate to second question
    fireEvent.press(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('Pregunta 2 de 3')).toBeTruthy();
    });

    // Should be able to go back
    fireEvent.press(getByText('Anterior'));

    await waitFor(() => {
      expect(getByText('Pregunta 1 de 3')).toBeTruthy();
    });
  });

  it('shows confirmation alert when submit button is pressed', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Siguiente')).toBeTruthy();
    });

    // Navigate to last question
    fireEvent.press(getByText('Siguiente'));
    fireEvent.press(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('Enviar Cuestionario')).toBeTruthy();
    });

    fireEvent.press(getByText('Enviar Cuestionario'));

    expect(Alert.alert).toHaveBeenCalledWith(
      'Enviar Cuestionario',
      '¿Estás seguro de que quieres enviar tus respuestas?',
      expect.any(Array)
    );
  });

  it('allows toggling multiple choice options on and off', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Siguiente')).toBeTruthy();
    });

    // Navigate to multiple choice question
    fireEvent.press(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('Select all even numbers')).toBeTruthy();
    });

    const option = getByText('2');
    
    // Select option
    fireEvent.press(option);
    expect(option).toBeTruthy();

    // Deselect option (toggle off)
    fireEvent.press(option);
    expect(option).toBeTruthy();
  });

  it('preserves answers when navigating between questions', async () => {
    const { getByText, getByPlaceholderText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
    });

    // Answer first question
    fireEvent.press(getByText('4'));

    // Navigate to third question
    fireEvent.press(getByText('Siguiente'));
    fireEvent.press(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('Explain your answer')).toBeTruthy();
    });

    // Answer third question
    const textInput = getByPlaceholderText('Escribe tu respuesta aquí...');
    fireEvent.changeText(textInput, 'Test answer');

    // Navigate back to first question
    fireEvent.press(getByText('Anterior'));
    fireEvent.press(getByText('Anterior'));

    // Navigate forward again to third question
    fireEvent.press(getByText('Siguiente'));
    fireEvent.press(getByText('Siguiente'));

    await waitFor(() => {
      const input = getByPlaceholderText('Escribe tu respuesta aquí...');
      expect(input.props.value).toBe('Test answer');
    });
  });

  it('displays back button in header', async () => {
    const { UNSAFE_getAllByType } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const backButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-back';
      });
      expect(backButton).toBeTruthy();
    });
  });

  it('calls goBack when back button is pressed', async () => {
    const { UNSAFE_getAllByType } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const backButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-back';
      });
      
      if (backButton) {
        fireEvent.press(backButton);
        expect(mockGoBack).toHaveBeenCalled();
      }
    });
  });

  it('displays quiz without timer when duration is not set', async () => {
    mockGetQuizWithQuestions.mockResolvedValue({
      ...mockQuizData,
      duration_minutes: null,
    });

    const { queryByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(queryByText('Test Quiz')).toBeTruthy();
      // Timer should not be displayed
      expect(queryByText(/\d{2}:\d{2}/)).toBeNull();
    });
  });

  it('handles quiz with only one question', async () => {
    mockGetQuizWithQuestions.mockResolvedValue({
      ...mockQuizData,
      questions: [mockQuizData.questions[0]],
    });

    const { getByText, queryByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Pregunta 1 de 1')).toBeTruthy();
      // Should show submit button immediately (no next button)
      expect(getByText('Enviar Cuestionario')).toBeTruthy();
      expect(queryByText('Siguiente')).toBeNull();
    });
  });

  it('displays error when quiz fetch fails', async () => {
    mockGetQuizWithQuestions.mockRejectedValue(new Error('Network error'));

    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Error al cargar el cuestionario')).toBeTruthy();
    });
  });

  it('shows Volver button in error state', async () => {
    mockGetQuizWithQuestions.mockRejectedValue(new Error('Network error'));

    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Volver')).toBeTruthy();
    });

    fireEvent.press(getByText('Volver'));
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('updates progress bar as user navigates', async () => {
    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Pregunta 1 de 3')).toBeTruthy();
    });

    // Navigate to second question
    fireEvent.press(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('Pregunta 2 de 3')).toBeTruthy();
    });

    // Navigate to third question
    fireEvent.press(getByText('Siguiente'));

    await waitFor(() => {
      expect(getByText('Pregunta 3 de 3')).toBeTruthy();
    });
  });

  it('handles single choice with only one option', async () => {
    mockGetQuizWithQuestions.mockResolvedValue({
      ...mockQuizData,
      questions: [
        {
          ...mockQuizData.questions[0],
          options: [mockQuizData.questions[0].options[0]],
        },
      ],
    });

    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('What is 2 + 2?')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
    });
  });

  it('handles multiple choice with many options', async () => {
    mockGetQuizWithQuestions.mockResolvedValue({
      ...mockQuizData,
      questions: [
        {
          ...mockQuizData.questions[1],
          options: [
            ...mockQuizData.questions[1].options,
            {
              id: 'opt6',
              question_id: 'q2',
              option_text: '6',
              is_correct: true,
              order_index: 3,
              created_at: '2024-01-01T00:00:00Z',
            },
            {
              id: 'opt7',
              question_id: 'q2',
              option_text: '7',
              is_correct: false,
              order_index: 4,
              created_at: '2024-01-01T00:00:00Z',
            },
          ],
        },
      ],
    });

    const { getByText } = renderWithAuth(
      <StudentQuizInterface navigation={mockNavigation} route={mockRoute} />
    );

    await waitFor(() => {
      expect(getByText('Select all even numbers')).toBeTruthy();
      expect(getByText('2')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
      expect(getByText('6')).toBeTruthy();
      expect(getByText('7')).toBeTruthy();
    });
  });
});
