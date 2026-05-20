/**
 * Auto-Submit Service Tests
 * 
 * Validates: Requirements 8.1, 8.2, 8.3, 8.4, 8.5, 1.4, 1.5
 * 
 * Tests for the auto-submit service functions covering:
 * - submitQuiz: Submitting quiz answers with auto-submit flag
 * - isQuizAvailable: Checking quiz availability based on publish status and dates
 * - Error handling for database and network errors
 * - Edge cases for date comparisons and null values
 */

import { submitQuiz, isQuizAvailable } from '../autoSubmit';
import { supabase } from '../supabase/client';
import { DatabaseError, NetworkError } from '@/types/errors';
import type { QuizSubmission } from '../autoSubmit';

// Mock the supabase client
jest.mock('../supabase/client', () => ({
  supabase: {
    from: jest.fn(),
  },
}));

describe('submitQuiz', () => {
  const mockSubmission: QuizSubmission = {
    quiz_id: 'quiz-123',
    student_id: 'student-456',
    answers: [
      {
        question_id: 'question-1',
        selected_options: ['option-1', 'option-2'],
      },
      {
        question_id: 'question-2',
        text_answer: 'This is my answer',
      },
    ],
    submitted_at: '2024-01-15T10:30:00Z',
    auto_submitted: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // Successful Submission Tests
  // ============================================================================

  describe('Successful Submission', () => {
    it('should submit quiz answers successfully', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await submitQuiz(mockSubmission);

      expect(supabase.from).toHaveBeenCalledWith('quiz_submissions');
      expect(mockInsert).toHaveBeenCalledWith({
        quiz_id: mockSubmission.quiz_id,
        student_id: mockSubmission.student_id,
        answers: mockSubmission.answers,
        submitted_at: mockSubmission.submitted_at,
        auto_submitted: mockSubmission.auto_submitted,
      });
    });

    it('should submit with auto_submitted flag set to true', async () => {
      const autoSubmission: QuizSubmission = {
        ...mockSubmission,
        auto_submitted: true,
      };

      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await submitQuiz(autoSubmission);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          auto_submitted: true,
        })
      );
    });

    it('should submit with empty answers array', async () => {
      const emptyAnswersSubmission: QuizSubmission = {
        ...mockSubmission,
        answers: [],
      };

      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await submitQuiz(emptyAnswersSubmission);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          answers: [],
        })
      );
    });

    it('should submit with only selected_options answers', async () => {
      const choiceOnlySubmission: QuizSubmission = {
        ...mockSubmission,
        answers: [
          {
            question_id: 'question-1',
            selected_options: ['option-1'],
          },
        ],
      };

      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await submitQuiz(choiceOnlySubmission);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          answers: [
            {
              question_id: 'question-1',
              selected_options: ['option-1'],
            },
          ],
        })
      );
    });

    it('should submit with only text_answer answers', async () => {
      const textOnlySubmission: QuizSubmission = {
        ...mockSubmission,
        answers: [
          {
            question_id: 'question-1',
            text_answer: 'Open-ended response',
          },
        ],
      };

      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await submitQuiz(textOnlySubmission);

      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          answers: [
            {
              question_id: 'question-1',
              text_answer: 'Open-ended response',
            },
          ],
        })
      );
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should throw DatabaseError when insert fails', async () => {
      const mockInsert = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Insert failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await expect(submitQuiz(mockSubmission)).rejects.toThrow(DatabaseError);
      await expect(submitQuiz(mockSubmission)).rejects.toThrow('Insert failed');
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockInsert = jest.fn().mockRejectedValue(new Error('Network failure'));

      (supabase.from as jest.Mock).mockReturnValue({
        insert: mockInsert,
      });

      await expect(submitQuiz(mockSubmission)).rejects.toThrow(NetworkError);
      await expect(submitQuiz(mockSubmission)).rejects.toThrow('Failed to submit quiz');
    });
  });
});

describe('isQuizAvailable', () => {
  const mockQuizId = 'quiz-123';

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock current date to 2024-01-15 12:00:00 UTC
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2024-01-15T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  // ============================================================================
  // Quiz Availability Tests
  // ============================================================================

  describe('Quiz Availability', () => {
    it('should return true for published quiz with no date restrictions', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: null,
          available_until: null,
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(true);
      expect(supabase.from).toHaveBeenCalledWith('quizzes');
      expect(mockSelect).toHaveBeenCalledWith('available_from, available_until, is_published');
      expect(mockEq).toHaveBeenCalledWith('id', mockQuizId);
    });

    it('should return true for published quiz within availability window', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T10:00:00Z', // 2 hours before current time
          available_until: '2024-01-15T14:00:00Z', // 2 hours after current time
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(true);
    });

    it('should return false for unpublished quiz', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: null,
          available_until: null,
          is_published: false,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(false);
    });

    it('should return false for quiz not yet available (before available_from)', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T14:00:00Z', // 2 hours after current time
          available_until: '2024-01-15T16:00:00Z',
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(false);
    });

    it('should return false for quiz past deadline (after available_until)', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T08:00:00Z',
          available_until: '2024-01-15T10:00:00Z', // 2 hours before current time
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(false);
    });

    it('should return true for quiz with only available_from set and current time after', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T10:00:00Z', // 2 hours before current time
          available_until: null,
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(true);
    });

    it('should return true for quiz with only available_until set and current time before', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: null,
          available_until: '2024-01-15T14:00:00Z', // 2 hours after current time
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(true);
    });

    it('should return false when quiz data is null', async () => {
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

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(false);
    });
  });

  // ============================================================================
  // Error Handling Tests
  // ============================================================================

  describe('Error Handling', () => {
    it('should throw DatabaseError when query fails', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Query failed' },
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await expect(isQuizAvailable(mockQuizId)).rejects.toThrow(DatabaseError);
      await expect(isQuizAvailable(mockQuizId)).rejects.toThrow('Query failed');
    });

    it('should throw NetworkError for unexpected errors', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockRejectedValue(new Error('Network failure'));

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      await expect(isQuizAvailable(mockQuizId)).rejects.toThrow(NetworkError);
      await expect(isQuizAvailable(mockQuizId)).rejects.toThrow('Failed to check quiz availability');
    });
  });

  // ============================================================================
  // Edge Cases
  // ============================================================================

  describe('Edge Cases', () => {
    it('should handle quiz available exactly at available_from time', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T12:00:00Z', // Exactly current time
          available_until: '2024-01-15T14:00:00Z',
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(true);
    });

    it('should handle quiz available exactly at available_until time', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T10:00:00Z',
          available_until: '2024-01-15T12:00:00Z', // Exactly current time
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(true);
    });

    it('should handle quiz one second past available_until', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T10:00:00Z',
          available_until: '2024-01-15T11:59:59Z', // 1 second before current time
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(false);
    });

    it('should handle quiz one second before available_from', async () => {
      const mockSelect = jest.fn().mockReturnThis();
      const mockEq = jest.fn().mockReturnThis();
      const mockSingle = jest.fn().mockResolvedValue({
        data: {
          available_from: '2024-01-15T12:00:01Z', // 1 second after current time
          available_until: '2024-01-15T14:00:00Z',
          is_published: true,
        },
        error: null,
      });

      (supabase.from as jest.Mock).mockReturnValue({
        select: mockSelect,
        eq: mockEq,
        single: mockSingle,
      });

      const result = await isQuizAvailable(mockQuizId);

      expect(result).toBe(false);
    });
  });
});
