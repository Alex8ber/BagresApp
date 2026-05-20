/**
 * QuestionCard Component Tests
 * 
 * Comprehensive unit tests for the QuestionCard component covering:
 * - Rendering for all three question types (single_choice, multiple_choice, open_ended)
 * - Option visibility based on question type
 * - Add/delete option interactions
 * - Edit/delete question functionality
 * - Reorder functionality
 */

import { render, fireEvent } from '@testing-library/react-native';

// Import types and component
type QuestionType = 'single_choice' | 'multiple_choice' | 'open_ended';

interface QuizOption {
  id: string;
  question_id: string;
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

interface QuestionWithOptions {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  points: number;
  order_index: number;
  options: QuizOption[];
}

// Import after type definitions
const QuestionCard = require('../QuestionCard').QuestionCard;

describe('QuestionCard', () => {
  const mockQuestion: QuestionWithOptions = {
    id: 'q1',
    quiz_id: 'quiz1',
    question_text: 'What is 2 + 2?',
    question_type: 'single_choice',
    points: 10,
    order_index: 0,
    options: [
      { id: 'opt1', question_id: 'q1', option_text: '3', is_correct: false, order_index: 0 },
      { id: 'opt2', question_id: 'q1', option_text: '4', is_correct: true, order_index: 1 },
    ],
  };

  // ============================================================================
  // Basic Rendering Tests
  // ============================================================================

  describe('Basic Rendering', () => {
    it('renders question in read-only mode', () => {
      const { getByText } = render(
        <QuestionCard question={mockQuestion} editable={false} />
      );

      expect(getByText('What is 2 + 2?')).toBeTruthy();
      expect(getByText('Selección Simple')).toBeTruthy();
      expect(getByText('10')).toBeTruthy();
    });

    it('renders question number correctly', () => {
      const { getByText } = render(
        <QuestionCard question={mockQuestion} editable={false} />
      );

      expect(getByText('#1')).toBeTruthy();
    });

    it('renders question header title', () => {
      const { getByText } = render(
        <QuestionCard question={mockQuestion} editable={false} />
      );

      expect(getByText('Pregunta')).toBeTruthy();
    });
  });

  // ============================================================================
  // Question Type Rendering Tests
  // ============================================================================

  describe('Question Type Rendering', () => {
    it('renders single_choice question type correctly', () => {
      const { getByText } = render(
        <QuestionCard question={mockQuestion} editable={false} />
      );

      expect(getByText('Selección Simple')).toBeTruthy();
    });

    it('renders multiple_choice question type correctly', () => {
      const multipleChoiceQuestion: QuestionWithOptions = {
        ...mockQuestion,
        question_type: 'multiple_choice',
      };

      const { getByText } = render(
        <QuestionCard question={multipleChoiceQuestion} editable={false} />
      );

      expect(getByText('Selección Múltiple')).toBeTruthy();
    });

    it('renders open_ended question type correctly', () => {
      const openEndedQuestion: QuestionWithOptions = {
        ...mockQuestion,
        question_type: 'open_ended',
        options: [],
      };

      const { getByText } = render(
        <QuestionCard question={openEndedQuestion} editable={false} />
      );

      expect(getByText('Respuesta Abierta')).toBeTruthy();
    });
  });

  // ============================================================================
  // Option Visibility Tests
  // ============================================================================

  describe('Option Visibility', () => {
    it('shows options for single_choice questions', () => {
      const { getByText } = render(
        <QuestionCard question={mockQuestion} editable={false} />
      );

      expect(getByText('Opciones')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
    });

    it('shows options for multiple_choice questions', () => {
      const multipleChoiceQuestion: QuestionWithOptions = {
        ...mockQuestion,
        question_type: 'multiple_choice',
      };

      const { getByText } = render(
        <QuestionCard question={multipleChoiceQuestion} editable={false} />
      );

      expect(getByText('Opciones')).toBeTruthy();
      expect(getByText('3')).toBeTruthy();
      expect(getByText('4')).toBeTruthy();
    });

    it('hides options for open_ended questions', () => {
      const openEndedQuestion: QuestionWithOptions = {
        ...mockQuestion,
        question_type: 'open_ended',
        options: [],
      };

      const { queryByText, getByText } = render(
        <QuestionCard question={openEndedQuestion} editable={false} />
      );

      expect(queryByText('Opciones')).toBeNull();
      expect(getByText('Los estudiantes responderán con texto libre')).toBeTruthy();
    });

    it('displays empty state when no options exist for choice questions', () => {
      const questionWithoutOptions: QuestionWithOptions = {
        ...mockQuestion,
        options: [],
      };

      const { getByText } = render(
        <QuestionCard question={questionWithoutOptions} editable={true} />
      );

      expect(getByText('No hay opciones. Agrega al menos 2 opciones.')).toBeTruthy();
    });

    it('does not show open-ended hint in editable mode', () => {
      const openEndedQuestion: QuestionWithOptions = {
        ...mockQuestion,
        question_type: 'open_ended',
        options: [],
      };

      const { queryByText } = render(
        <QuestionCard question={openEndedQuestion} editable={true} />
      );

      expect(queryByText('Los estudiantes responderán con texto libre')).toBeNull();
    });
  });

  // ============================================================================
  // Add/Delete Option Interaction Tests
  // ============================================================================

  describe('Add/Delete Option Interactions', () => {
    it('shows "Agregar Opción" button in editable mode for single_choice', () => {
      const onAddOption = jest.fn();

      const { getByText } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onAddOption={onAddOption}
        />
      );

      expect(getByText('Agregar Opción')).toBeTruthy();
    });

    it('calls onAddOption when "Agregar Opción" button is pressed', () => {
      const onAddOption = jest.fn();

      const { getByText } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onAddOption={onAddOption}
        />
      );

      const addButton = getByText('Agregar Opción');
      fireEvent.press(addButton);

      expect(onAddOption).toHaveBeenCalledTimes(1);
      expect(onAddOption).toHaveBeenCalledWith('q1');
    });

    it('shows delete option button in editable mode', () => {
      const onDeleteOption = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onDeleteOption={onDeleteOption}
        />
      );

      // Should have delete buttons for each option
      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      // Filter for delete option buttons (they have close-circle icon)
      const deleteButtons = touchables.filter((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'close-circle';
      });

      expect(deleteButtons.length).toBe(2); // One for each option
    });

    it('calls onDeleteOption when delete button is pressed', () => {
      const onDeleteOption = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onDeleteOption={onDeleteOption}
        />
      );

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const deleteButtons = touchables.filter((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'close-circle';
      });

      fireEvent.press(deleteButtons[0]);

      expect(onDeleteOption).toHaveBeenCalledTimes(1);
      expect(onDeleteOption).toHaveBeenCalledWith('opt1');
    });

    it('does not show "Agregar Opción" button for open_ended questions', () => {
      const openEndedQuestion: QuestionWithOptions = {
        ...mockQuestion,
        question_type: 'open_ended',
        options: [],
      };

      const { queryByText } = render(
        <QuestionCard
          question={openEndedQuestion}
          editable={true}
          onAddOption={jest.fn()}
        />
      );

      expect(queryByText('Agregar Opción')).toBeNull();
    });

    it('does not show "Agregar Opción" button in read-only mode', () => {
      const { queryByText } = render(
        <QuestionCard
          question={mockQuestion}
          editable={false}
        />
      );

      expect(queryByText('Agregar Opción')).toBeNull();
    });
  });

  // ============================================================================
  // Edit/Delete Question Functionality Tests
  // ============================================================================

  describe('Edit/Delete Question Functionality', () => {
    it('shows delete question button in editable mode', () => {
      const onDelete = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onDelete={onDelete}
        />
      );

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const deleteButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'trash-outline';
      });

      expect(deleteButton).toBeTruthy();
    });

    it('calls onDelete when delete question button is pressed', () => {
      const onDelete = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onDelete={onDelete}
        />
      );

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const deleteButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'trash-outline';
      });

      fireEvent.press(deleteButton);

      expect(onDelete).toHaveBeenCalledTimes(1);
      expect(onDelete).toHaveBeenCalledWith('q1');
    });

    it('allows editing question text in editable mode', () => {
      const onUpdateQuestionText = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onUpdateQuestionText={onUpdateQuestionText}
        />
      );

      const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
      const questionTextInput = textInputs.find((input: any) => 
        input.props.value === 'What is 2 + 2?'
      );

      fireEvent.changeText(questionTextInput, 'What is 3 + 3?');

      expect(onUpdateQuestionText).toHaveBeenCalledWith('q1', 'What is 3 + 3?');
    });

    it('allows editing points in editable mode', () => {
      const onUpdatePoints = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onUpdatePoints={onUpdatePoints}
        />
      );

      const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
      const pointsInput = textInputs.find((input: any) => 
        input.props.value === '10'
      );

      fireEvent.changeText(pointsInput, '20');

      expect(onUpdatePoints).toHaveBeenCalledWith('q1', 20);
    });

    it('allows editing option text in editable mode', () => {
      const onUpdateOptionText = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onUpdateOptionText={onUpdateOptionText}
        />
      );

      const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
      const optionInput = textInputs.find((input: any) => 
        input.props.value === '3'
      );

      fireEvent.changeText(optionInput, '5');

      expect(onUpdateOptionText).toHaveBeenCalledWith('opt1', '5');
    });

    it('does not show edit controls in read-only mode', () => {
      const { UNSAFE_queryAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={false}
        />
      );

      const textInputs = UNSAFE_queryAllByType(require('react-native').TextInput);
      expect(textInputs.length).toBe(0);
    });
  });

  // ============================================================================
  // Reorder Functionality Tests
  // ============================================================================

  describe('Reorder Functionality', () => {
    it('shows reorder buttons in editable mode when showReorderButtons is true', () => {
      const onReorder = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onReorder={onReorder}
          showReorderButtons={true}
        />
      );

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const upButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-up';
      });
      const downButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-down';
      });

      expect(upButton).toBeTruthy();
      expect(downButton).toBeTruthy();
    });

    it('hides reorder buttons when showReorderButtons is false', () => {
      const onReorder = jest.fn();

      const { UNSAFE_queryAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onReorder={onReorder}
          showReorderButtons={false}
        />
      );

      const touchables = UNSAFE_queryAllByType(require('react-native').TouchableOpacity);
      const upButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-up';
      });
      const downButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-down';
      });

      expect(upButton).toBeUndefined();
      expect(downButton).toBeUndefined();
    });

    it('calls onReorder with "up" when up button is pressed', () => {
      const onReorder = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onReorder={onReorder}
          showReorderButtons={true}
        />
      );

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const upButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-up';
      });

      fireEvent.press(upButton);

      expect(onReorder).toHaveBeenCalledTimes(1);
      expect(onReorder).toHaveBeenCalledWith('up');
    });

    it('calls onReorder with "down" when down button is pressed', () => {
      const onReorder = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onReorder={onReorder}
          showReorderButtons={true}
        />
      );

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      const downButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-down';
      });

      fireEvent.press(downButton);

      expect(onReorder).toHaveBeenCalledTimes(1);
      expect(onReorder).toHaveBeenCalledWith('down');
    });

    it('does not show reorder buttons in read-only mode', () => {
      const { UNSAFE_queryAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={false}
        />
      );

      const touchables = UNSAFE_queryAllByType(require('react-native').TouchableOpacity);
      const upButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-up';
      });
      const downButton = touchables.find((t: any) => {
        const children = t.props.children;
        return children && children.props && children.props.name === 'arrow-down';
      });

      expect(upButton).toBeUndefined();
      expect(downButton).toBeUndefined();
    });
  });

  // ============================================================================
  // Toggle Correct Functionality Tests
  // ============================================================================

  describe('Toggle Correct Functionality', () => {
    it('allows toggling correct answer in editable mode', () => {
      const onToggleCorrect = jest.fn();

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={true}
          onToggleCorrect={onToggleCorrect}
        />
      );

      const touchables = UNSAFE_getAllByType(require('react-native').TouchableOpacity);
      // Find checkbox buttons (they have checkmark-circle or ellipse-outline icons)
      const checkboxButtons = touchables.filter((t: any) => {
        const children = t.props.children;
        return children && children.props && 
          (children.props.name === 'checkmark-circle' || children.props.name === 'ellipse-outline');
      });

      fireEvent.press(checkboxButtons[0]);

      expect(onToggleCorrect).toHaveBeenCalledTimes(1);
      expect(onToggleCorrect).toHaveBeenCalledWith('opt1');
    });

    it('does not allow toggling correct answer in read-only mode', () => {
      const { UNSAFE_queryAllByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={false}
        />
      );

      const touchables = UNSAFE_queryAllByType(require('react-native').TouchableOpacity);
      // In read-only mode, there should be no touchable checkboxes
      const checkboxButtons = touchables.filter((t: any) => {
        const children = t.props.children;
        return children && children.props && 
          (children.props.name === 'checkmark-circle' || children.props.name === 'ellipse-outline');
      });

      expect(checkboxButtons.length).toBe(0);
    });
  });

  // ============================================================================
  // Edge Cases and Combined Props Tests
  // ============================================================================

  describe('Edge Cases', () => {
    it('handles question with many options', () => {
      const questionWithManyOptions: QuestionWithOptions = {
        ...mockQuestion,
        options: [
          { id: 'opt1', question_id: 'q1', option_text: 'Option 1', is_correct: false, order_index: 0 },
          { id: 'opt2', question_id: 'q1', option_text: 'Option 2', is_correct: false, order_index: 1 },
          { id: 'opt3', question_id: 'q1', option_text: 'Option 3', is_correct: true, order_index: 2 },
          { id: 'opt4', question_id: 'q1', option_text: 'Option 4', is_correct: false, order_index: 3 },
          { id: 'opt5', question_id: 'q1', option_text: 'Option 5', is_correct: false, order_index: 4 },
        ],
      };

      const { getByText } = render(
        <QuestionCard question={questionWithManyOptions} editable={false} />
      );

      expect(getByText('Option 1')).toBeTruthy();
      expect(getByText('Option 2')).toBeTruthy();
      expect(getByText('Option 3')).toBeTruthy();
      expect(getByText('Option 4')).toBeTruthy();
      expect(getByText('Option 5')).toBeTruthy();
    });

    it('handles question with empty text', () => {
      const questionWithEmptyText: QuestionWithOptions = {
        ...mockQuestion,
        question_text: '',
      };

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={questionWithEmptyText}
          editable={true}
          onUpdateQuestionText={jest.fn()}
        />
      );

      const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
      const questionTextInput = textInputs.find((input: any) => 
        input.props.placeholder === 'Escribe la pregunta aquí...'
      );

      expect(questionTextInput).toBeTruthy();
      expect(questionTextInput.props.value).toBe('');
    });

    it('handles question with zero points', () => {
      const questionWithZeroPoints: QuestionWithOptions = {
        ...mockQuestion,
        points: 0,
      };

      const { UNSAFE_getAllByType } = render(
        <QuestionCard
          question={questionWithZeroPoints}
          editable={true}
          onUpdatePoints={jest.fn()}
        />
      );

      const textInputs = UNSAFE_getAllByType(require('react-native').TextInput);
      const pointsInput = textInputs.find((input: any) => 
        input.props.placeholder === '0'
      );

      expect(pointsInput).toBeTruthy();
      expect(pointsInput.props.value).toBe('0');
    });

    it('handles multiple_choice with multiple correct answers', () => {
      const multipleCorrectQuestion: QuestionWithOptions = {
        ...mockQuestion,
        question_type: 'multiple_choice',
        options: [
          { id: 'opt1', question_id: 'q1', option_text: 'Correct 1', is_correct: true, order_index: 0 },
          { id: 'opt2', question_id: 'q1', option_text: 'Correct 2', is_correct: true, order_index: 1 },
          { id: 'opt3', question_id: 'q1', option_text: 'Wrong', is_correct: false, order_index: 2 },
        ],
      };

      const { getByText } = render(
        <QuestionCard question={multipleCorrectQuestion} editable={false} />
      );

      expect(getByText('Correct 1')).toBeTruthy();
      expect(getByText('Correct 2')).toBeTruthy();
      expect(getByText('Wrong')).toBeTruthy();
    });

    it('applies custom containerStyle prop', () => {
      const customStyle = { marginTop: 20 };

      const { UNSAFE_getByType } = render(
        <QuestionCard
          question={mockQuestion}
          editable={false}
          containerStyle={customStyle}
        />
      );

      const Card = require('@/components/shared/Card').Card;
      const card = UNSAFE_getByType(Card);
      expect(card).toBeTruthy();
    });
  });
});
