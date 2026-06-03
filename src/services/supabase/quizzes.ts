import { supabase } from './client';
import type {
  Quiz,
  QuizInsert,
  QuizUpdate,
  QuizQuestion,
  QuizQuestionInsert,
  QuizOption,
  QuizOptionInsert,
} from '@/types/database';
import { DatabaseError, NetworkError } from '@/types/errors';

/**
 * Question with its options
 */
export interface QuestionWithOptions extends QuizQuestion {
  options: QuizOption[];
}

/**
 * Quiz with all questions and options
 */
export interface QuizWithQuestions extends Quiz {
  questions: QuestionWithOptions[];
}

/**
 * Get all quizzes for a specific class
 * 
 * @param classId - The class ID
 * @returns Array of quizzes for the class
 */
export async function getClassQuizzes(classId: string): Promise<Quiz[]> {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch class quizzes');
  }
}

/**
 * Get all quizzes for a teacher's classes
 * 
 * @param teacherId - The teacher's user ID
 * @returns Array of quizzes
 */
export async function getTeacherQuizzes(teacherId: string): Promise<Quiz[]> {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        classes!inner(teacher_id)
      `)
      .eq('classes.teacher_id', teacherId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch teacher quizzes');
  }
}

/**
 * Create a new quiz
 * 
 * @param quizData - The quiz data to insert
 * @returns The created quiz
 */
export async function createQuiz(quizData: QuizInsert): Promise<Quiz> {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .insert(quizData as any)
      .select()
      .single();

    if (error) {
      console.error('[createQuiz] Database error:', error);
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No quiz data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to create quiz');
  }
}

/**
 * Update an existing quiz
 * 
 * @param quizId - The quiz ID to update
 * @param updates - Partial quiz data to update
 * @returns The updated quiz
 */
export async function updateQuiz(
  quizId: string,
  updates: QuizUpdate
): Promise<Quiz> {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .update(updates as any)
      .eq('id', quizId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No quiz data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update quiz');
  }
}

/**
 * Delete a quiz
 * 
 * @param quizId - The quiz ID to delete
 */
export async function deleteQuiz(quizId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('quizzes')
      .delete()
      .eq('id', quizId);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to delete quiz');
  }
}

/**
 * Get all questions for a quiz
 * 
 * @param quizId - The quiz ID
 * @returns Array of questions with their options
 */
export async function getQuizQuestions(quizId: string): Promise<QuizQuestion[]> {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch quiz questions');
  }
}

/**
 * Create a new question
 * 
 * @param questionData - The question data to insert
 * @returns The created question
 */
export async function createQuestion(questionData: QuizQuestionInsert): Promise<QuizQuestion> {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .insert(questionData as any)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No question data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to create question');
  }
}

/**
 * Get all options for a question
 * 
 * @param questionId - The question ID
 * @returns Array of options
 */
export async function getQuestionOptions(questionId: string): Promise<QuizOption[]> {
  try {
    const { data, error } = await supabase
      .from('quiz_options')
      .select('*')
      .eq('question_id', questionId)
      .order('order_index', { ascending: true });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch question options');
  }
}

/**
 * Create a new option
 * 
 * @param optionData - The option data to insert
 * @returns The created option
 */
export async function createOption(optionData: QuizOptionInsert): Promise<QuizOption> {
  try {
    const { data, error } = await supabase
      .from('quiz_options')
      .insert(optionData as any)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No option data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to create option');
  }
}

/**
 * Update option fields by ID
 * 
 * @param optionId - The option ID to update
 * @param updates - Partial option data to update
 * @returns The updated option
 */
export async function updateOption(
  optionId: string,
  updates: Partial<QuizOption>
): Promise<QuizOption> {
  try {
    const { data, error } = await supabase
      .from('quiz_options')
      .update(updates as any)
      .eq('id', optionId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No option data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update option');
  }
}

/**
 * Delete option by ID
 * 
 * @param optionId - The option ID to delete
 */
export async function deleteOption(optionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('quiz_options')
      .delete()
      .eq('id', optionId);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to delete option');
  }
}

/**
 * Get quiz with all questions and options in a single optimized call
 * 
 * @param quizId - The quiz ID
 * @returns Quiz with all questions and their options
 */
export async function getQuizWithQuestions(
  quizId: string
): Promise<QuizWithQuestions> {
  try {
    // Fetch quiz
    const { data: quiz, error: quizError } = await supabase
      .from('quizzes')
      .select('*')
      .eq('id', quizId)
      .single();

    if (quizError) {
      throw new DatabaseError(quizError.message);
    }

    if (!quiz) {
      throw new DatabaseError('Quiz not found');
    }

    // Fetch all questions for this quiz
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('*')
      .eq('quiz_id', quizId)
      .order('order_index', { ascending: true });

    if (questionsError) {
      throw new DatabaseError(questionsError.message);
    }

    // If no questions, return quiz with empty questions array
    if (!questions || questions.length === 0) {
      return {
        ...quiz,
        questions: [],
      };
    }

    // Fetch all options for all questions in a single query
    const questionIds = questions.map(q => q.id);
    const { data: options, error: optionsError } = await supabase
      .from('quiz_options')
      .select('*')
      .in('question_id', questionIds)
      .order('order_index', { ascending: true });

    if (optionsError) {
      throw new DatabaseError(optionsError.message);
    }

    // Group options by question_id
    const questionsWithOptions: QuestionWithOptions[] = questions.map(question => ({
      ...question,
      options: (options || []).filter(opt => opt.question_id === question.id),
    }));

    return {
      ...quiz,
      questions: questionsWithOptions,
    };
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch quiz with questions');
  }
}

/**
 * Update question order indices
 * 
 * @param updates - Array of {id, order_index} updates
 * @returns Promise that resolves when all updates are complete
 */
export async function updateQuestionOrder(
  updates: Array<{ id: string; order_index: number }>
): Promise<void> {
  try {
    // Update all question order indices in parallel
    const promises = updates.map(({ id, order_index }) =>
      supabase
        .from('quiz_questions')
        .update({ order_index })
        .eq('id', id)
    );

    const results = await Promise.all(promises);
    
    // Check if any updates failed
    const errors = results.filter(r => r.error);
    if (errors.length > 0) {
      throw new DatabaseError('Failed to update question order');
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update question order');
  }
}

/**
 * Delete question by ID (CASCADE deletes options)
 * 
 * @param questionId - The question ID to delete
 */
export async function deleteQuestion(questionId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('id', questionId);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to delete question');
  }
}
/**
 * Update question fields by ID
 * 
 * @param questionId - The question ID to update
 * @param updates - Partial question data to update
 * @returns The updated question
 */
export async function updateQuestion(
  questionId: string,
  updates: Partial<QuizQuestion>
): Promise<QuizQuestion> {
  try {
    const { data, error } = await supabase
      .from('quiz_questions')
      .update(updates as any)
      .eq('id', questionId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No question data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update question');
  }
}
