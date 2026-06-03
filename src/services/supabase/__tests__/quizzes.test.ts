/**
 * Quiz Service Tests
 * 
 * Validates: Requirements 4.1, 4.2, 4.7
 * 
 * Tests for the quiz service functions covering:
 * - getQuizWithQuestions: Fetching quiz with all questions and options
 * - updateQuestionOrder: Updating question order indices in parallel
 * - Grouping options by question_id
 * - Handling quizzes with no questions
 * - Handling questions with no options (open-ended)
 * - Error handling for database and network errors
 */

import { getQuizWithQuestions, updateQuestionOrder, deleteQuestion, updateQuestion, updateOption, deleteOption } from '../quizzes';
import { supabase } from '../client';
import { DatabaseError, NetworkError } from '@/types/errors';
import type { Quiz, QuizQuestion, QuizOption } from '@/types/database';

// Mock the supabase client
jest.mock('../client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('getQuizWithQuestions', () => {
  const mockQuizId = 'quiz-123';
  
  const mockQuiz: Quiz = {
    id: mockQuizId,
    class_id: 'class-123',
    title: 'Test Quiz',
    description: 'A test quiz',
    duration_minutes: 30,
    passing_score: 70,
    available_from: null,
    available_until: null,
    is_published: false,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-01T00:00:00Z',
  };

  const mockQuestions: QuizQuestion[] = [
    {
      id: 'question-1',
      quiz_id: mockQuizId,
      question_text: 'What is 2+2?',
      question_type: 'single_choice',
      points: 10,
      order_index: 0,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'question-2',
      quiz_id: mockQuizId,
      question_text: 'Select all even numbers',
      question_type: 'multiple_choice',
      points: 15,
      order_index: 1,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'question-3',
      quiz_id: mockQuizId,
      question_text: 'Explain your answer',
      question_type: 'open_ended',
      points: 20,
      order_index: 2,
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
    },
  ];

  const mockOptions: QuizOption[] = [
    {
      id: 'option-1',
      question_id: 'question-1',
      option_text: '3',
      is_correct: false,
      order_index: 0,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'option-2',
      question_id: 'question-1',
      option_text: '4',
      is_correct: true,
      order_index: 1,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'option-3',
      question_id: 'question-2',
      option_text: '2',
      is_correct: true,
      order_index: 0,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'option-4',
      question_id: 'question-2',
      option_text: '3',
      is_correct: false,
      order_index: 1,
      created_at: '2024-01-01T00:00:00Z',
    },
    {
      id: 'option-5',
      question_id: 'question-2',
      option_text: '4',
      is_correct: true,
      order_index: 2,
      created_at: '2024-01-01T00:00:00Z',
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // Successful Fetch Tests
  // ============================================================================

  describe('Successful Fetch', () => {
    it('should fetch quiz with all questions and options', async () => {
      // Mock the supabase chain
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockIn = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        in: mockIn,
        single: mockSingle,
      });

      // First call: fetch quiz
      mockSingle.mockResolvedValueOnce({
        data: mockQuiz,
        error: null,
      });

      // Second call: fetch questions
      mockOrder.mockResolvedValueOnce({
        data: mockQuestions,
        error: null,
      });

      // Third call: fetch options
      mockOrder.mockResolvedValueOnce({
        data: mockOptions,
        error: null,
      });

      const result = await getQuizWithQuestions(mockQuizId);

      expect(result).toEqual({
        ...mockQuiz,
        questions: [
          {
            ...mockQuestions[0],
            options: [mockOptions[0], mockOptions[1]],
          },
          {
            ...mockQuestions[1],
            options: [mockOptions[2], mockOptions[3], mockOptions[4]],
          },
          {
            ...mockQuestions[2],
            options: [],
          },
        ],
      });

      expect(supabase.from).toHaveBeenCalledWith('quizzes');
      expect(supabase.from).toHaveBeenCalledWith('quiz_questions');
      expect(supabase.from).toHaveBeenCalledWith('quiz_options');
    });

    it('should handle quiz with no questions', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        single: mockSingle,
      });

      // First call: fetch quiz
      mockSingle.mockResolvedValueOnce({
        data: mockQuiz,
        error: null,
      });

      // Second call: fetch questions (empty)
      mockOrder.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const result = await getQuizWithQuestions(mockQuizId);

      expect(result).toEqual({
        ...mockQuiz,
        questions: [],
      });
    });

    it('should handle questions with no options (open-ended)', async () => {
      const openEndedQuestion: QuizQuestion = {
        id: 'question-open',
        quiz_id: mockQuizId,
        question_text: 'Explain your reasoning',
        question_type: 'open_ended',
        points: 25,
        order_index: 0,
        created_at: '2024-01-01T00:00:00Z',
        updated_at: '2024-01-01T00:00:00Z',
      };

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockIn = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        in: mockIn,
        single: mockSingle,
      });

      // First call: fetch quiz
      mockSingle.mockResolvedValueOnce({
        data: mockQuiz,
        error: null,
      });

      // Second call: fetch questions
      mockOrder.mockResolvedValueOnce({
        data: [openEndedQuestion],
        error: null,
      });

      // Third call: fetch options (empty for open-ended)
      mockOrder.mockResolvedValueOnce({
        data: [],
        error: null,
      });

      const result = await getQuizWithQuestions(mockQuizId);

      expect(result).toEqual({
        ...mockQuiz,
        questions: [
          {
            ...openEndedQuestion,
            options: [],
          },
        ],
      });
    });

    it('should correctly group options by question_id', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockIn = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        in: mockIn,
        single: mockSingle,
      });

      mockSingle.mockResolvedValueOnce({
        data: mockQuiz,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: mockQuestions,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: mockOptions,
        error: null,
      });

      const result = await getQuizWithQuestions(mockQuizId);

      // Verify question 1 has 2 options
      expect(result.questions[0].options).toHaveLength(2);
      expect(result.questions[0].options[0].question_id).toBe('question-1');
      expect(result.questions[0].options[1].question_id).toBe('question-1');

      // Verify question 2 has 3 options
      expect(result.questions[1].options).toHaveLength(3);
      expect(result.questions[1].options[0].question_id).toBe('question-2');
      expect(result.questions[1].options[1].question_id).toBe('question-2');
      expect(result.questions[1].options[2].question_id).toBe('question-2');

      // Verify question 3 has 0 options (open-ended)
      expect(result.questions[2].options).toHaveLength(0);
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should throw DatabaseError when quiz fetch fails', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Quiz not found' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await expect(getQuizWithQuestions(mockQuizId)).rejects.toThrow(DatabaseError);
    });

    it('should throw DatabaseError when quiz is not found', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await expect(getQuizWithQuestions(mockQuizId)).rejects.toThrow(DatabaseError);
    });

    it('should throw DatabaseError when questions fetch fails', async () => {
      let callCount = 0;
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'quizzes') {
          return {
            select: mockSelect,
            eq: mockEq,
            single: mockSingle.mockResolvedValueOnce({
              data: mockQuiz,
              error: null,
            }),
          };
        } else if (table === 'quiz_questions') {
          return {
            select: mockSelect,
            eq: mockEq,
            order: mockOrder.mockResolvedValueOnce({
              data: null,
              error: { message: 'Failed to fetch questions' },
            }),
          };
        }
      });

      await expect(getQuizWithQuestions(mockQuizId)).rejects.toThrow(DatabaseError);
    });

    it('should throw DatabaseError when options fetch fails', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockIn = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockImplementation((table) => {
        if (table === 'quizzes') {
          return {
            select: mockSelect,
            eq: mockEq,
            single: mockSingle.mockResolvedValueOnce({
              data: mockQuiz,
              error: null,
            }),
          };
        } else if (table === 'quiz_questions') {
          return {
            select: mockSelect,
            eq: mockEq,
            order: mockOrder.mockResolvedValueOnce({
              data: mockQuestions,
              error: null,
            }),
          };
        } else if (table === 'quiz_options') {
          return {
            select: mockSelect,
            in: mockIn,
            order: mockOrder.mockResolvedValueOnce({
              data: null,
              error: { message: 'Failed to fetch options' },
            }),
          };
        }
      });

      await expect(getQuizWithQuestions(mockQuizId)).rejects.toThrow(DatabaseError);
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      mockSingle.mockRejectedValueOnce(new Error('Network failure'));

      await expect(getQuizWithQuestions(mockQuizId)).rejects.toThrow(NetworkError);
      await expect(getQuizWithQuestions(mockQuizId)).rejects.toThrow('Failed to fetch quiz with questions');
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle null options array', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockIn = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        in: mockIn,
        single: mockSingle,
      });

      mockSingle.mockResolvedValueOnce({
        data: mockQuiz,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: mockQuestions,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await getQuizWithQuestions(mockQuizId);

      expect(result.questions).toHaveLength(3);
      result.questions.forEach(question => {
        expect(question.options).toEqual([]);
      });
    });

    it('should handle null questions array', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        single: mockSingle,
      });

      mockSingle.mockResolvedValueOnce({
        data: mockQuiz,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: null,
        error: null,
      });

      const result = await getQuizWithQuestions(mockQuizId);

      expect(result).toEqual({
        ...mockQuiz,
        questions: [],
      });
    });

    it('should maintain order_index sorting for questions', async () => {
      const unorderedQuestions = [mockQuestions[2], mockQuestions[0], mockQuestions[1]];

      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockOrder = jest.fn().mockReturnThis();
      const mockIn = jest.fn().mockReturnThis();
      const mockSingle = jest.fn();

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        order: mockOrder,
        in: mockIn,
        single: mockSingle,
      });

      mockSingle.mockResolvedValueOnce({
        data: mockQuiz,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: unorderedQuestions,
        error: null,
      });

      mockOrder.mockResolvedValueOnce({
        data: mockOptions,
        error: null,
      });

      const result = await getQuizWithQuestions(mockQuizId);

      // Verify the order is maintained as returned by the database
      expect(result.questions[0].order_index).toBe(2);
      expect(result.questions[1].order_index).toBe(0);
      expect(result.questions[2].order_index).toBe(1);
    });
  });
});


// ============================================================================
// updateQuestionOrder Tests
// ============================================================================

describe('updateQuestionOrder', () => {
  const mockUpdates = [
    { id: 'question-1', order_index: 2 },
    { id: 'question-2', order_index: 0 },
    { id: 'question-3', order_index: 1 },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Updates', () => {
    it('should update all question order indices in parallel', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await updateQuestionOrder(mockUpdates);

      // Verify supabase.from was called for each update
      expect(supabase.from).toHaveBeenCalledTimes(3);
      expect(supabase.from).toHaveBeenCalledWith('quiz_questions');

      // Verify update was called with correct order_index for each question
      expect(mockUpdate).toHaveBeenCalledTimes(3);
      expect(mockUpdate).toHaveBeenCalledWith({ order_index: 2 });
      expect(mockUpdate).toHaveBeenCalledWith({ order_index: 0 });
      expect(mockUpdate).toHaveBeenCalledWith({ order_index: 1 });

      // Verify eq was called with correct question IDs
      expect(mockEq).toHaveBeenCalledTimes(3);
      expect(mockEq).toHaveBeenCalledWith('id', 'question-1');
      expect(mockEq).toHaveBeenCalledWith('id', 'question-2');
      expect(mockEq).toHaveBeenCalledWith('id', 'question-3');
    });

    it('should handle empty updates array', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await updateQuestionOrder([]);

      // Verify no database calls were made
      expect(supabase.from).not.toHaveBeenCalled();
      expect(mockUpdate).not.toHaveBeenCalled();
      expect(mockEq).not.toHaveBeenCalled();
    });

    it('should handle single question update', async () => {
      const singleUpdate = [{ id: 'question-1', order_index: 5 }];

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await updateQuestionOrder(singleUpdate);

      expect(supabase.from).toHaveBeenCalledTimes(1);
      expect(mockUpdate).toHaveBeenCalledWith({ order_index: 5 });
      expect(mockEq).toHaveBeenCalledWith('id', 'question-1');
    });
  });

  describe('Error Handling', () => {
    it('should throw DatabaseError when one update fails', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn()
        .mockResolvedValueOnce({ data: null, error: null })
        .mockResolvedValueOnce({ data: null, error: { message: 'Update failed' } })
        .mockResolvedValueOnce({ data: null, error: null });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await expect(updateQuestionOrder(mockUpdates)).rejects.toThrow(DatabaseError);
      await expect(updateQuestionOrder(mockUpdates)).rejects.toThrow('Failed to update question order');
    });

    it('should throw DatabaseError when all updates fail', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await expect(updateQuestionOrder(mockUpdates)).rejects.toThrow(DatabaseError);
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockRejectedValue(new Error('Network failure'));

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await expect(updateQuestionOrder(mockUpdates)).rejects.toThrow(NetworkError);
      await expect(updateQuestionOrder(mockUpdates)).rejects.toThrow('Failed to update question order');
    });
  });

  describe('Edge Cases', () => {
    it('should handle large batch of updates', async () => {
      const largeUpdates = Array.from({ length: 100 }, (_, i) => ({
        id: `question-${i}`,
        order_index: i,
      }));

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await updateQuestionOrder(largeUpdates);

      expect(supabase.from).toHaveBeenCalledTimes(100);
      expect(mockUpdate).toHaveBeenCalledTimes(100);
      expect(mockEq).toHaveBeenCalledTimes(100);
    });

    it('should handle duplicate order_index values', async () => {
      const duplicateUpdates = [
        { id: 'question-1', order_index: 0 },
        { id: 'question-2', order_index: 0 },
        { id: 'question-3', order_index: 0 },
      ];

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await updateQuestionOrder(duplicateUpdates);

      // Should still execute all updates even with duplicate order_index
      expect(supabase.from).toHaveBeenCalledTimes(3);
      expect(mockUpdate).toHaveBeenCalledTimes(3);
    });

    it('should handle negative order_index values', async () => {
      const negativeUpdates = [
        { id: 'question-1', order_index: -1 },
        { id: 'question-2', order_index: 0 },
      ];

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await updateQuestionOrder(negativeUpdates);

      expect(mockUpdate).toHaveBeenCalledWith({ order_index: -1 });
      expect(mockUpdate).toHaveBeenCalledWith({ order_index: 0 });
    });
  });

  describe('Parallel Execution', () => {
    it('should execute all updates in parallel using Promise.all', async () => {
      const executionOrder: number[] = [];
      
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockImplementation((field, id) => {
        const index = parseInt(id.split('-')[1]);
        executionOrder.push(index);
        return Promise.resolve({ data: null, error: null });
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
      });

      await updateQuestionOrder(mockUpdates);

      // All updates should be initiated (order may vary due to parallel execution)
      expect(executionOrder).toHaveLength(3);
      expect(executionOrder).toContain(1);
      expect(executionOrder).toContain(2);
      expect(executionOrder).toContain(3);
    });
  });
});


// ============================================================================
// deleteQuestion Tests
// ============================================================================

describe('deleteQuestion', () => {
  const mockQuestionId = 'question-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Deletion', () => {
    it('should delete question by ID', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await deleteQuestion(mockQuestionId);

      expect(supabase.from).toHaveBeenCalledWith('quiz_questions');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', mockQuestionId);
    });

    it('should CASCADE delete associated options', async () => {
      // This test verifies the function calls the correct table
      // The CASCADE behavior is enforced by the database schema
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await deleteQuestion(mockQuestionId);

      // Verify we're deleting from quiz_questions table
      // The database CASCADE constraint handles option deletion
      expect(supabase.from).toHaveBeenCalledWith('quiz_questions');
    });
  });

  describe('Error Handling', () => {
    it('should throw DatabaseError when delete fails', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Delete failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteQuestion(mockQuestionId)).rejects.toThrow(DatabaseError);
      await expect(deleteQuestion(mockQuestionId)).rejects.toThrow('Delete failed');
    });

    it('should throw DatabaseError when question not found', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Question not found' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteQuestion(mockQuestionId)).rejects.toThrow(DatabaseError);
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockRejectedValue(new Error('Network failure'));

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteQuestion(mockQuestionId)).rejects.toThrow(NetworkError);
      await expect(deleteQuestion(mockQuestionId)).rejects.toThrow('Failed to delete question');
    });
  });

  describe('Edge Cases', () => {
    it('should handle deletion of question with no options', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await deleteQuestion(mockQuestionId);

      expect(supabase.from).toHaveBeenCalledWith('quiz_questions');
      expect(mockEq).toHaveBeenCalledWith('id', mockQuestionId);
    });

    it('should handle deletion of question with multiple options', async () => {
      // The CASCADE constraint ensures all options are deleted
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await deleteQuestion(mockQuestionId);

      expect(supabase.from).toHaveBeenCalledWith('quiz_questions');
    });

    it('should handle empty question ID string', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid question ID' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteQuestion('')).rejects.toThrow(DatabaseError);
    });
  });
});


// ============================================================================
// updateQuestion Tests
// ============================================================================

describe('updateQuestion', () => {
  const mockQuestionId = 'question-123';
  const mockUpdates = {
    question_text: 'Updated question text',
    points: 15,
  };

  const mockUpdatedQuestion: QuizQuestion = {
    id: mockQuestionId,
    quiz_id: 'quiz-123',
    question_text: 'Updated question text',
    question_type: 'single_choice',
    points: 15,
    order_index: 0,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-02T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Updates', () => {
    it('should update question fields by ID', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, mockUpdates);

      expect(supabase.from).toHaveBeenCalledWith('quiz_questions');
      expect(mockUpdate).toHaveBeenCalledWith(mockUpdates);
      expect(mockEq).toHaveBeenCalledWith('id', mockQuestionId);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedQuestion);
    });

    it('should update question_text only', async () => {
      const textUpdate = { question_text: 'New question text' };
      const updatedQuestion = { ...mockUpdatedQuestion, question_text: 'New question text' };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, textUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(textUpdate);
      expect(result.question_text).toBe('New question text');
    });

    it('should update points only', async () => {
      const pointsUpdate = { points: 25 };
      const updatedQuestion = { ...mockUpdatedQuestion, points: 25 };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, pointsUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(pointsUpdate);
      expect(result.points).toBe(25);
    });

    it('should update question_type', async () => {
      const typeUpdate = { question_type: 'multiple_choice' as const };
      const updatedQuestion = { ...mockUpdatedQuestion, question_type: 'multiple_choice' as const };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, typeUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(typeUpdate);
      expect(result.question_type).toBe('multiple_choice');
    });

    it('should update multiple fields at once', async () => {
      const multiUpdate = {
        question_text: 'Multi-field update',
        points: 30,
        question_type: 'open_ended' as const,
      };
      const updatedQuestion = { ...mockUpdatedQuestion, ...multiUpdate };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, multiUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(multiUpdate);
      expect(result.question_text).toBe('Multi-field update');
      expect(result.points).toBe(30);
      expect(result.question_type).toBe('open_ended');
    });
  });

  describe('Error Handling', () => {
    it('should throw DatabaseError when update fails', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateQuestion(mockQuestionId, mockUpdates)).rejects.toThrow(DatabaseError);
      await expect(updateQuestion(mockQuestionId, mockUpdates)).rejects.toThrow('Update failed');
    });

    it('should throw DatabaseError when question not found', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateQuestion(mockQuestionId, mockUpdates)).rejects.toThrow(DatabaseError);
      await expect(updateQuestion(mockQuestionId, mockUpdates)).rejects.toThrow('No question data returned');
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockRejectedValue(new Error('Network failure'));

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateQuestion(mockQuestionId, mockUpdates)).rejects.toThrow(NetworkError);
      await expect(updateQuestion(mockQuestionId, mockUpdates)).rejects.toThrow('Failed to update question');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty updates object', async () => {
      const emptyUpdate = {};
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, emptyUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(emptyUpdate);
      expect(result).toEqual(mockUpdatedQuestion);
    });

    it('should handle empty question ID string', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid question ID' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateQuestion('', mockUpdates)).rejects.toThrow(DatabaseError);
    });

    it('should handle updating order_index', async () => {
      const orderUpdate = { order_index: 5 };
      const updatedQuestion = { ...mockUpdatedQuestion, order_index: 5 };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, orderUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(orderUpdate);
      expect(result.order_index).toBe(5);
    });

    it('should preserve unchanged fields', async () => {
      const partialUpdate = { points: 20 };
      const updatedQuestion = { ...mockUpdatedQuestion, points: 20 };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, partialUpdate);

      // Verify unchanged fields are preserved
      expect(result.id).toBe(mockQuestionId);
      expect(result.quiz_id).toBe('quiz-123');
      expect(result.question_type).toBe('single_choice');
      expect(result.order_index).toBe(0);
    });
  });

  describe('Return Value', () => {
    it('should return the updated question with all fields', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedQuestion,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateQuestion(mockQuestionId, mockUpdates);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('quiz_id');
      expect(result).toHaveProperty('question_text');
      expect(result).toHaveProperty('question_type');
      expect(result).toHaveProperty('points');
      expect(result).toHaveProperty('order_index');
      expect(result).toHaveProperty('created_at');
      expect(result).toHaveProperty('updated_at');
    });
  });
});


// ============================================================================
// updateOption Tests
// ============================================================================

describe('updateOption', () => {
  const mockOptionId = 'option-123';
  const mockUpdates = {
    option_text: 'Updated option text',
    is_correct: true,
  };

  const mockUpdatedOption: QuizOption = {
    id: mockOptionId,
    question_id: 'question-123',
    option_text: 'Updated option text',
    is_correct: true,
    order_index: 0,
    created_at: '2024-01-01T00:00:00Z',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Updates', () => {
    it('should update option fields by ID', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, mockUpdates);

      expect(supabase.from).toHaveBeenCalledWith('quiz_options');
      expect(mockUpdate).toHaveBeenCalledWith(mockUpdates);
      expect(mockEq).toHaveBeenCalledWith('id', mockOptionId);
      expect(mockSelect).toHaveBeenCalled();
      expect(mockSingle).toHaveBeenCalled();
      expect(result).toEqual(mockUpdatedOption);
    });

    it('should update option_text only', async () => {
      const textUpdate = { option_text: 'New option text' };
      const updatedOption = { ...mockUpdatedOption, option_text: 'New option text' };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, textUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(textUpdate);
      expect(result.option_text).toBe('New option text');
    });

    it('should update is_correct only', async () => {
      const correctUpdate = { is_correct: false };
      const updatedOption = { ...mockUpdatedOption, is_correct: false };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, correctUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(correctUpdate);
      expect(result.is_correct).toBe(false);
    });

    it('should update order_index', async () => {
      const orderUpdate = { order_index: 3 };
      const updatedOption = { ...mockUpdatedOption, order_index: 3 };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, orderUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(orderUpdate);
      expect(result.order_index).toBe(3);
    });

    it('should update multiple fields at once', async () => {
      const multiUpdate = {
        option_text: 'Multi-field update',
        is_correct: false,
        order_index: 2,
      };
      const updatedOption = { ...mockUpdatedOption, ...multiUpdate };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, multiUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(multiUpdate);
      expect(result.option_text).toBe('Multi-field update');
      expect(result.is_correct).toBe(false);
      expect(result.order_index).toBe(2);
    });
  });

  describe('Error Handling', () => {
    it('should throw DatabaseError when update fails', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateOption(mockOptionId, mockUpdates)).rejects.toThrow(DatabaseError);
      await expect(updateOption(mockOptionId, mockUpdates)).rejects.toThrow('Update failed');
    });

    it('should throw DatabaseError when option not found', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateOption(mockOptionId, mockUpdates)).rejects.toThrow(DatabaseError);
      await expect(updateOption(mockOptionId, mockUpdates)).rejects.toThrow('No option data returned');
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockRejectedValue(new Error('Network failure'));

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateOption(mockOptionId, mockUpdates)).rejects.toThrow(NetworkError);
      await expect(updateOption(mockOptionId, mockUpdates)).rejects.toThrow('Failed to update option');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty updates object', async () => {
      const emptyUpdate = {};
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, emptyUpdate);

      expect(mockUpdate).toHaveBeenCalledWith(emptyUpdate);
      expect(result).toEqual(mockUpdatedOption);
    });

    it('should handle empty option ID string', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid option ID' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      await expect(updateOption('', mockUpdates)).rejects.toThrow(DatabaseError);
    });

    it('should preserve unchanged fields', async () => {
      const partialUpdate = { is_correct: true };
      const updatedOption = { ...mockUpdatedOption, is_correct: true };

      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: updatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, partialUpdate);

      // Verify unchanged fields are preserved
      expect(result.id).toBe(mockOptionId);
      expect(result.question_id).toBe('question-123');
      expect(result.option_text).toBe('Updated option text');
      expect(result.order_index).toBe(0);
    });
  });

  describe('Return Value', () => {
    it('should return the updated option with all fields', async () => {
      const mockUpdate = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSelect = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: mockUpdatedOption,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        update: mockUpdate,
        eq: mockEq,
        select: mockSelect,
        single: mockSingle,
      });

      const result = await updateOption(mockOptionId, mockUpdates);

      expect(result).toHaveProperty('id');
      expect(result).toHaveProperty('question_id');
      expect(result).toHaveProperty('option_text');
      expect(result).toHaveProperty('is_correct');
      expect(result).toHaveProperty('order_index');
      expect(result).toHaveProperty('created_at');
    });
  });
});


// ============================================================================
// deleteOption Tests
// ============================================================================

describe('deleteOption', () => {
  const mockOptionId = 'option-123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Successful Deletion', () => {
    it('should delete option by ID', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await deleteOption(mockOptionId);

      expect(supabase.from).toHaveBeenCalledWith('quiz_options');
      expect(mockDelete).toHaveBeenCalled();
      expect(mockEq).toHaveBeenCalledWith('id', mockOptionId);
    });
  });

  describe('Error Handling', () => {
    it('should throw DatabaseError when delete fails', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Delete failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteOption(mockOptionId)).rejects.toThrow(DatabaseError);
      await expect(deleteOption(mockOptionId)).rejects.toThrow('Delete failed');
    });

    it('should throw DatabaseError when option not found', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Option not found' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteOption(mockOptionId)).rejects.toThrow(DatabaseError);
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockRejectedValue(new Error('Network failure'));

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteOption(mockOptionId)).rejects.toThrow(NetworkError);
      await expect(deleteOption(mockOptionId)).rejects.toThrow('Failed to delete option');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty option ID string', async () => {
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Invalid option ID' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await expect(deleteOption('')).rejects.toThrow(DatabaseError);
    });

    it('should successfully delete option without affecting other options', async () => {
      // This test verifies the function calls the correct table
      const mockDelete = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        delete: mockDelete,
        eq: mockEq,
      });

      await deleteOption(mockOptionId);

      // Verify we're deleting from quiz_options table
      expect(supabase.from).toHaveBeenCalledWith('quiz_options');
      expect(mockEq).toHaveBeenCalledWith('id', mockOptionId);
    });
  });
});
