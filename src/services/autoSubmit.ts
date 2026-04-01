/**
 * Auto-Submit Service
 * 
 * Service for handling automatic quiz submission when time expires.
 * Provides functions to submit quiz answers and check quiz availability.
 * 
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */

import { supabase } from './supabase/client';
import { DatabaseError, NetworkError } from '@/types/errors';

/**
 * Quiz submission data structure
 */
export interface QuizSubmission {
  quiz_id: string;
  student_id: string;
  answers: Array<{
    question_id: string;
    selected_options?: string[];
    text_answer?: string;
  }>;
  submitted_at: string;
  auto_submitted: boolean;
}

/**
 * Submit quiz answers to the database
 * 
 * Saves all student answers and marks submission as manual or automatic.
 * Used by both manual submit and auto-submit on timer expiration.
 * 
 * @param submission - The quiz submission data
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 * 
 * **Validates: Requirements 8.2, 8.5**
 */
export async function submitQuiz(
  submission: QuizSubmission
): Promise<void> {
  try {
    const { error } = await supabase
      .from('quiz_submissions')
      .insert({
        quiz_id: submission.quiz_id,
        student_id: submission.student_id,
        answers: submission.answers,
        submitted_at: submission.submitted_at,
        auto_submitted: submission.auto_submitted,
      });

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to submit quiz');
  }
}

/**
 * Check if a quiz is currently available for students
 * 
 * Validates that the quiz is published and within the availability window.
 * Returns false if quiz is unpublished, not yet available, or past deadline.
 * 
 * @param quizId - The quiz ID to check
 * @returns True if quiz is available, false otherwise
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 * 
 * **Validates: Requirements 1.4, 1.5**
 */
export async function isQuizAvailable(quizId: string): Promise<boolean> {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('available_from, available_until, is_published')
      .eq('id', quizId)
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      return false;
    }

    const now = new Date();
    const availableFrom = data.available_from ? new Date(data.available_from) : null;
    const availableUntil = data.available_until ? new Date(data.available_until) : null;

    // Check if quiz is published
    if (!data.is_published) {
      return false;
    }

    // Check if quiz is not yet available
    if (availableFrom && now < availableFrom) {
      return false;
    }

    // Check if quiz deadline has passed
    if (availableUntil && now > availableUntil) {
      return false;
    }

    return true;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to check quiz availability');
  }
}
