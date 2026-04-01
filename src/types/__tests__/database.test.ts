/**
 * Database Types Test
 * 
 * Validates that the database types are correctly defined and match the schema.
 */

import type { QuizQuestion, QuizOption, Quiz } from '../database';

describe('Database Types', () => {
  describe('QuizQuestion', () => {
    it('should accept valid question_type values', () => {
      const validTypes: QuizQuestion['question_type'][] = [
        'single_choice',
        'multiple_choice',
        'open_ended',
      ];

      validTypes.forEach(type => {
        const question: Partial<QuizQuestion> = {
          question_type: type,
        };
        expect(question.question_type).toBe(type);
      });
    });

    it('should have all required fields', () => {
      const question: QuizQuestion = {
        id: 'test-id',
        quiz_id: 'quiz-id',
        question_text: 'What is 2+2?',
        question_type: 'single_choice',
        points: 10,
        order_index: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(question).toBeDefined();
      expect(question.id).toBe('test-id');
      expect(question.question_type).toBe('single_choice');
    });
  });

  describe('QuizOption', () => {
    it('should have all required fields', () => {
      const option: QuizOption = {
        id: 'option-id',
        question_id: 'question-id',
        option_text: 'Answer A',
        is_correct: true,
        order_index: 0,
        created_at: new Date().toISOString(),
      };

      expect(option).toBeDefined();
      expect(option.is_correct).toBe(true);
    });

    it('should support multiple correct options for multiple_choice', () => {
      const options: QuizOption[] = [
        {
          id: 'opt-1',
          question_id: 'q-1',
          option_text: 'Correct 1',
          is_correct: true,
          order_index: 0,
          created_at: new Date().toISOString(),
        },
        {
          id: 'opt-2',
          question_id: 'q-1',
          option_text: 'Correct 2',
          is_correct: true,
          order_index: 1,
          created_at: new Date().toISOString(),
        },
        {
          id: 'opt-3',
          question_id: 'q-1',
          option_text: 'Incorrect',
          is_correct: false,
          order_index: 2,
          created_at: new Date().toISOString(),
        },
      ];

      const correctCount = options.filter(o => o.is_correct).length;
      expect(correctCount).toBe(2);
    });
  });

  describe('Quiz', () => {
    it('should have all required fields', () => {
      const quiz: Quiz = {
        id: 'quiz-id',
        class_id: 'class-id',
        title: 'Math Quiz',
        description: 'A quiz about math',
        duration_minutes: 30,
        passing_score: 70,
        available_from: new Date().toISOString(),
        available_until: new Date(Date.now() + 86400000).toISOString(),
        is_published: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      expect(quiz).toBeDefined();
      expect(quiz.is_published).toBe(false);
    });

    it('should allow null for optional date fields', () => {
      const quiz: Partial<Quiz> = {
        available_from: null,
        available_until: null,
        duration_minutes: null,
        description: null,
      };

      expect(quiz.available_from).toBeNull();
      expect(quiz.available_until).toBeNull();
    });
  });

  describe('Question Type Enum', () => {
    it('should only allow the three valid question types', () => {
      // This test ensures TypeScript compilation catches invalid types
      const validTypes = ['single_choice', 'multiple_choice', 'open_ended'] as const;
      
      validTypes.forEach(type => {
        const question: Partial<QuizQuestion> = {
          question_type: type,
        };
        expect(['single_choice', 'multiple_choice', 'open_ended']).toContain(question.question_type);
      });
    });

    // TypeScript compile-time check - these should cause errors if uncommented:
    // const invalidQuestion: QuizQuestion = {
    //   question_type: 'true_false', // ❌ Should not compile
    // };
    // const invalidQuestion2: QuizQuestion = {
    //   question_type: 'short_answer', // ❌ Should not compile
    // };
  });
});
