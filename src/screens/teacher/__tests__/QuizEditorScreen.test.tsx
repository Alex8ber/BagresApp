/**
 * QuizEditorScreen Tests
 * 
 * Unit tests for QuizEditorScreen covering:
 * - Screen rendering with quiz data
 * - Add/edit/delete question flows
 * - Save navigation
 * - Validation logic
 * - Option management
 * - Question reordering
 */

import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Alert } from 'react-native';

// Mock navigation
const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockNavigation = {
  navigate: mockNavigate,
  goBack: mockGoBack,
};

// Mock route
const mockRoute = {
  params: {
    quizId: 'quiz-1',
    classId: 'class-1',
    className: 'Matemáticas 101',
  },
};

// Mock quiz service
jest.mock('@/services/supabase/quizzes', () => ({
  getQuizWithQuestions: jest.fn(),
  createQuestion: jest.fn(),
  updateQuestion: jest.fn(),
  deleteQuestion: jest.fn(),
  createOption: jest.fn(),
  updateOption: jest.fn(),
  deleteOption: jest.fn(),
  updateQuestionOrder: jest.fn(),
}));

// Mock Alert
jest.spyOn(Alert, 'alert');

import QuizEditorScreen from '../QuizEditorScreen';
import * as quizService from '@/services/supabase/quizzes';

describe('QuizEditorScreen', () => {
  const mockQuiz = {
    id: 'quiz-1',
    title: 'Test Quiz',
    description: 'Test Description',
    class_id: 'class-1',
    teacher_id: 'teacher-1',
    duration_minutes: 60,
    passing_score: 70,
    is_published: false,
    available_from: null,
    available_until: null,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
    questions: [
      {
        id: 'q1',
        quiz_id: 'quiz-1',
        question_text: 'What is 2 + 2?',
        question_type: 'single_choice' as const,
        points: 10,
        order_index: 0,
        options: [
          { id: 'opt1', question_id: 'q1', option_text: '3', is_correct: false, order_index: 0 },
          { id: 'opt2', question_id: 'q1', option_text: '4', is_correct: true, order_index: 1 },
        ],
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue(mockQuiz);
  });

  const renderScreen = () => {
    return render(
      <NavigationContainer>
        <QuizEditorScreen navigation={mockNavigation as any} route={mockRoute as any} />
      </NavigationContainer>
    );
  };

  // ============================================================================
  // Screen Rendering Tests
  // ============================================================================

  describe('Screen Rendering', () => {
    it('renders loading state initially', () => {
      const { getByText } = renderScreen();
      expect(getByText('Cargando cuestionario...')).toBeTruthy();
    });

    it('renders quiz data after loading', async () => {
      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Test Quiz')).toBeTruthy();
        expect(getByText('Clase: Matemáticas 101')).toBeTruthy();
        expect(getByText('Preguntas (1)')).toBeTruthy();
      });
    });

    it('renders questions list', async () => {
      const { getByText, UNSAFE_getAllByType } = renderScreen();

      await waitFor(() => {
        expect(getByText('Preguntas (1)')).toBeTruthy();
        // Question text is in a TextInput, not a Text element
        const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
        const questionInput = textInputs.find((input: any) => input.props.value === 'What is 2 + 2?');
        expect(questionInput).toBeTruthy();
      });
    });

    it('renders empty state when no questions', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('No hay preguntas')).toBeTruthy();
        expect(getByText('Agrega preguntas para comenzar a construir tu cuestionario')).toBeTruthy();
      });
    });

    it('renders error state when fetch fails', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Error')).toBeTruthy();
      });
    });
  });

  // ============================================================================
  // Add Question Flow Tests
  // ============================================================================

  describe('Add Question Flow', () => {
    it('shows add question button', async () => {
      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Agregar Pregunta')).toBeTruthy();
      });
    });

    it('calls createQuestion when add button is pressed', async () => {
      const newQuestion = {
        id: 'q2',
        quiz_id: 'quiz-1',
        question_text: '',
        question_type: 'single_choice' as const,
        points: 1,
        order_index: 1,
      };

      (quizService.createQuestion as jest.Mock).mockResolvedValue(newQuestion);

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Agregar Pregunta')).toBeTruthy();
      });

      const addButton = getByText('Agregar Pregunta');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(quizService.createQuestion).toHaveBeenCalledWith({
          quiz_id: 'quiz-1',
          question_text: '',
          question_type: 'single_choice',
          points: 1,
          order_index: 1,
        });
      });
    });

    it('updates questions list after adding', async () => {
      const newQuestion = {
        id: 'q2',
        quiz_id: 'quiz-1',
        question_text: '',
        question_type: 'single_choice' as const,
        points: 1,
        order_index: 1,
      };

      (quizService.createQuestion as jest.Mock).mockResolvedValue(newQuestion);

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Preguntas (1)')).toBeTruthy();
      });

      const addButton = getByText('Agregar Pregunta');
      fireEvent.press(addButton);

      await waitFor(() => {
        expect(getByText('Preguntas (2)')).toBeTruthy();
      });
    });
  });

  // ============================================================================
  // Delete Question Flow Tests
  // ============================================================================

  describe('Delete Question Flow', () => {
    it('shows confirmation alert when delete is pressed', async () => {
      const { UNSAFE_getAllByType } = renderScreen();

      await waitFor(() => {
        expect(quizService.getQuizWithQuestions).toHaveBeenCalled();
      });

      // Find delete button (trash icon)
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const deleteButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'trash-outline';
      });

      expect(deleteButton).toBeTruthy();
      fireEvent.press(deleteButton);

      expect(Alert.alert).toHaveBeenCalledWith(
        'Eliminar Pregunta',
        '¿Estás seguro de que deseas eliminar esta pregunta?',
        expect.any(Array)
      );
    });

    it('calls deleteQuestion when confirmed', async () => {
      (quizService.deleteQuestion as jest.Mock).mockResolvedValue(undefined);

      // Mock Alert.alert to auto-confirm
      (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
        const confirmButton = buttons?.find((b: any) => b.text === 'Eliminar');
        if (confirmButton && confirmButton.onPress) {
          confirmButton.onPress();
        }
      });

      const { UNSAFE_getAllByType } = renderScreen();

      await waitFor(() => {
        expect(quizService.getQuizWithQuestions).toHaveBeenCalled();
      });

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const deleteButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'trash-outline';
      });

      fireEvent.press(deleteButton);

      await waitFor(() => {
        expect(quizService.deleteQuestion).toHaveBeenCalledWith('q1');
      });
    });
  });

  // ============================================================================
  // Save Navigation Tests
  // ============================================================================

  describe('Save Navigation', () => {
    it('shows save button', async () => {
      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });
    });

    it('validates questions before saving', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: '',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 0,
            options: [],
          },
        ],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      const saveButton = getByText('Guardar y Volver');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validación',
          expect.stringContaining('El texto de la pregunta es requerido'),
          expect.any(Array)
        );
      });
    });

    it('navigates back after successful save', async () => {
      // Mock Alert.alert to auto-confirm
      (Alert.alert as jest.Mock).mockImplementation((title, message, buttons) => {
        const okButton = buttons?.find((b: any) => b.text === 'OK');
        if (okButton && okButton.onPress) {
          okButton.onPress();
        }
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      const saveButton = getByText('Guardar y Volver');
      fireEvent.press(saveButton);

      await waitFor(() => {
        expect(mockGoBack).toHaveBeenCalled();
      });
    });

    it('shows cancel button', async () => {
      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Cancelar')).toBeTruthy();
      });
    });

    it('navigates back when cancel is pressed', async () => {
      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Cancelar')).toBeTruthy();
      });

      const cancelButton = getByText('Cancelar');
      fireEvent.press(cancelButton);

      expect(mockGoBack).toHaveBeenCalled();
    });
  });

  // ============================================================================
  // Validation Tests
  // ============================================================================

  describe('Validation', () => {
    it('validates empty question text', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: '',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 0,
            options: [
              { id: 'opt1', question_id: 'q1', option_text: 'A', is_correct: true, order_index: 0 },
              { id: 'opt2', question_id: 'q1', option_text: 'B', is_correct: false, order_index: 1 },
            ],
          },
        ],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      fireEvent.press(getByText('Guardar y Volver'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validación',
          expect.stringContaining('El texto de la pregunta es requerido'),
          expect.any(Array)
        );
      });
    });

    it('validates zero points', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: 'Question',
            question_type: 'single_choice' as const,
            points: 0,
            order_index: 0,
            options: [
              { id: 'opt1', question_id: 'q1', option_text: 'A', is_correct: true, order_index: 0 },
              { id: 'opt2', question_id: 'q1', option_text: 'B', is_correct: false, order_index: 1 },
            ],
          },
        ],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      fireEvent.press(getByText('Guardar y Volver'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validación',
          expect.stringContaining('Los puntos deben ser mayores a 0'),
          expect.any(Array)
        );
      });
    });

    it('validates minimum options for choice questions', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: 'Question',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 0,
            options: [
              { id: 'opt1', question_id: 'q1', option_text: 'A', is_correct: true, order_index: 0 },
            ],
          },
        ],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      fireEvent.press(getByText('Guardar y Volver'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validación',
          expect.stringContaining('Debe tener al menos 2 opciones'),
          expect.any(Array)
        );
      });
    });

    it('validates single_choice has exactly one correct answer', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: 'Question',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 0,
            options: [
              { id: 'opt1', question_id: 'q1', option_text: 'A', is_correct: true, order_index: 0 },
              { id: 'opt2', question_id: 'q1', option_text: 'B', is_correct: true, order_index: 1 },
            ],
          },
        ],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      fireEvent.press(getByText('Guardar y Volver'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validación',
          expect.stringContaining('Debe tener exactamente una respuesta correcta'),
          expect.any(Array)
        );
      });
    });

    it('validates multiple_choice has at least one correct answer', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: 'Question',
            question_type: 'multiple_choice' as const,
            points: 10,
            order_index: 0,
            options: [
              { id: 'opt1', question_id: 'q1', option_text: 'A', is_correct: false, order_index: 0 },
              { id: 'opt2', question_id: 'q1', option_text: 'B', is_correct: false, order_index: 1 },
            ],
          },
        ],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      fireEvent.press(getByText('Guardar y Volver'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validación',
          expect.stringContaining('Debe tener al menos una respuesta correcta'),
          expect.any(Array)
        );
      });
    });

    it('validates open_ended has no options', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: 'Question',
            question_type: 'open_ended' as const,
            points: 10,
            order_index: 0,
            options: [
              { id: 'opt1', question_id: 'q1', option_text: 'A', is_correct: false, order_index: 0 },
            ],
          },
        ],
      });

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Guardar y Volver')).toBeTruthy();
      });

      fireEvent.press(getByText('Guardar y Volver'));

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith(
          'Validación',
          expect.stringContaining('Las preguntas abiertas no deben tener opciones'),
          expect.any(Array)
        );
      });
    });
  });

  // ============================================================================
  // Option Management Tests
  // ============================================================================

  describe('Option Management', () => {
    it('calls createOption when add option is pressed', async () => {
      const newOption = {
        id: 'opt3',
        question_id: 'q1',
        option_text: '',
        is_correct: false,
        order_index: 2,
      };

      (quizService.createOption as jest.Mock).mockResolvedValue(newOption);

      const { getByText } = renderScreen();

      await waitFor(() => {
        expect(getByText('Agregar Opción')).toBeTruthy();
      });

      const addOptionButton = getByText('Agregar Opción');
      fireEvent.press(addOptionButton);

      await waitFor(() => {
        expect(quizService.createOption).toHaveBeenCalledWith({
          question_id: 'q1',
          option_text: '',
          is_correct: false,
          order_index: 2,
        });
      });
    });

    it('calls deleteOption when delete option is pressed', async () => {
      (quizService.deleteOption as jest.Mock).mockResolvedValue(undefined);

      const { UNSAFE_getAllByType } = renderScreen();

      await waitFor(() => {
        expect(quizService.getQuizWithQuestions).toHaveBeenCalled();
      });

      // Find delete option button (close-circle icon)
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const deleteOptionButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'close-circle';
      });

      expect(deleteOptionButton).toBeTruthy();
      fireEvent.press(deleteOptionButton);

      await waitFor(() => {
        expect(quizService.deleteOption).toHaveBeenCalledWith('opt1');
      });
    });

    it('calls updateOption when toggle correct is pressed', async () => {
      (quizService.updateOption as jest.Mock).mockResolvedValue(undefined);

      const { UNSAFE_getAllByType } = renderScreen();

      await waitFor(() => {
        expect(quizService.getQuizWithQuestions).toHaveBeenCalled();
      });

      // Find checkbox button
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const checkboxButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && 
          (children.props.name === 'checkmark-circle' || children.props.name === 'ellipse-outline');
      });

      expect(checkboxButton).toBeTruthy();
      fireEvent.press(checkboxButton);

      await waitFor(() => {
        expect(quizService.updateOption).toHaveBeenCalled();
      });
    });
  });

  // ============================================================================
  // Question Reordering Tests
  // ============================================================================

  describe('Question Reordering', () => {
    it('calls updateQuestionOrder when reorder up is pressed', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: 'Question 1',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 0,
            options: [],
          },
          {
            id: 'q2',
            quiz_id: 'quiz-1',
            question_text: 'Question 2',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 1,
            options: [],
          },
        ],
      });

      (quizService.updateQuestionOrder as jest.Mock).mockResolvedValue(undefined);

      const { UNSAFE_getAllByType } = renderScreen();

      await waitFor(() => {
        expect(quizService.getQuizWithQuestions).toHaveBeenCalled();
      });

      // Find arrow-up button
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const upButtons = touchables.filter((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-up';
      });

      // Press up button on second question
      expect(upButtons.length).toBeGreaterThan(0);
      fireEvent.press(upButtons[1]);

      await waitFor(() => {
        expect(quizService.updateQuestionOrder).toHaveBeenCalled();
      });
    });

    it('calls updateQuestionOrder when reorder down is pressed', async () => {
      (quizService.getQuizWithQuestions as jest.Mock).mockResolvedValue({
        ...mockQuiz,
        questions: [
          {
            id: 'q1',
            quiz_id: 'quiz-1',
            question_text: 'Question 1',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 0,
            options: [],
          },
          {
            id: 'q2',
            quiz_id: 'quiz-1',
            question_text: 'Question 2',
            question_type: 'single_choice' as const,
            points: 10,
            order_index: 1,
            options: [],
          },
        ],
      });

      (quizService.updateQuestionOrder as jest.Mock).mockResolvedValue(undefined);

      const { UNSAFE_getAllByType } = renderScreen();

      await waitFor(() => {
        expect(quizService.getQuizWithQuestions).toHaveBeenCalled();
      });

      // Find arrow-down button
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const downButtons = touchables.filter((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-down';
      });

      // Press down button on first question
      expect(downButtons.length).toBeGreaterThan(0);
      fireEvent.press(downButtons[0]);

      await waitFor(() => {
        expect(quizService.updateQuestionOrder).toHaveBeenCalled();
      });
    });
  });
});
