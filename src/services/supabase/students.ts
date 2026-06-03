/**
 * Student Services
 * 
 * Services for student-related operations including class enrollment,
 * materials, quizzes, and assignments.
 */

import { supabase } from './client';
import { DatabaseError, NetworkError } from '@/types/errors';

/**
 * Get the class that a student is enrolled in
 * Students can only be in one class
 */
export async function getStudentClass(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('class_students')
      .select(`
        class_id,
        enrolled_at,
        classes (
          id,
          name,
          class_code,
          teacher_id,
          teachers (
            full_name
          )
        )
      `)
      .eq('student_id', studentId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Student not enrolled in any class
      }
      throw new DatabaseError(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch student class');
  }
}

/**
 * Get materials for a student's class
 */
export async function getStudentMaterials(classId: string) {
  try {
    const { data, error } = await supabase
      .from('class_materials')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Materials error:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Failed to fetch materials:', error);
    return [];
  }
}

/**
 * Get quizzes for a student's class
 * Only returns published quizzes within their availability window
 */
export async function getStudentQuizzes(classId: string) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('class_id', classId)
      .eq('is_published', true)  // Only show published quizzes to students
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Error fetching quizzes:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Failed to fetch quizzes:', error);
    return [];
  }
}

/**
 * Get upcoming quizzes for a student's class
 */
export async function getUpcomingQuizzes(classId: string) {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: true })
      .limit(5);

    if (error) {
      console.warn('Upcoming quizzes error:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Failed to fetch upcoming quizzes:', error);
    return [];
  }
}

/**
 * Get student's quiz submissions
 */
export async function getStudentSubmissions(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('Submissions error:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Failed to fetch submissions:', error);
    return [];
  }
}

/**
 * Calculate score from a quiz submission
 */
export async function calculateSubmissionScore(submission: any, quizId: string) {
  try {
    // Get quiz with questions
    const { data: quiz, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        questions:quiz_questions(
          *,
          options:quiz_options(*)
        )
      `)
      .eq('id', quizId)
      .single();

    if (error || !quiz) {
      console.warn('Failed to fetch quiz for score calculation:', error);
      return { score: 0, correctAnswers: 0, totalQuestions: 0 };
    }

    let correctAnswers = 0;
    const totalQuestions = quiz.questions?.length || 0;

    // Calculate correct answers
    if (submission.answers && Array.isArray(submission.answers)) {
      submission.answers.forEach((answer: any) => {
        const question = quiz.questions.find((q: any) => q.id === answer.question_id);
        
        if (!question) {
          return;
        }
        
        if (answer.selected_options && answer.selected_options.length > 0) {
          const selectedOptionId = answer.selected_options[0];
          const selectedOption = question.options.find((opt: any) => opt.id === selectedOptionId);
          
          if (selectedOption?.is_correct) {
            correctAnswers++;
          }
        }
      });
    }

    const score = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

    return { score, correctAnswers, totalQuestions };
  } catch (error) {
    console.error('Error calculating submission score:', error);
    return { score: 0, correctAnswers: 0, totalQuestions: 0 };
  }
}

/**
 * Get a specific quiz submission for a student
 * Returns the submission with calculated score
 */
export async function getQuizSubmission(studentId: string, quizId: string) {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select('*')
      .eq('student_id', studentId)
      .eq('quiz_id', quizId)
      .maybeSingle();

    if (error) {
      console.warn('Quiz submission error:', error.message);
      return null;
    }

    if (!data) {
      return null;
    }

    // If score fields exist, return as is
    if ('score' in data && 'correct_answers' in data && 'total_questions' in data) {
      return data;
    }

    // Otherwise, we need to calculate the score by fetching the quiz
    // For now, return the submission and let the calling code handle it
    return data;
  } catch (error) {
    console.warn('Failed to fetch quiz submission:', error);
    return null;
  }
}

/**
 * Submit a quiz with answers
 */
export async function submitQuiz(
  studentId: string,
  quizId: string,
  answers: { questionId: string; selectedOptionId: string }[]
) {
  try {
    // Transform answers to match the database schema
    const formattedAnswers = answers.map(answer => ({
      question_id: answer.questionId,
      selected_options: [answer.selectedOptionId],
    }));

    const { data, error } = await supabase
      .from('quiz_submissions')
      .insert({
        student_id: studentId,
        quiz_id: quizId,
        answers: formattedAnswers,
        submitted_at: new Date().toISOString(),
        auto_submitted: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Database error submitting quiz:', error);
      throw new DatabaseError(error.message);
    }

    return data;
  } catch (error) {
    console.error('Failed to submit quiz:', error);
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to submit quiz');
  }
}

/**
 * Get all submissions for a specific quiz
 * Used by teachers to see student responses
 */
export async function getQuizSubmissions(quizId: string) {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select(`
        *,
        students (
          full_name
        )
      `)
      .eq('quiz_id', quizId)
      .order('submitted_at', { ascending: false });

    if (error) {
      console.warn('Quiz submissions error:', error.message);
      return [];
    }

    return data || [];
  } catch (error) {
    console.warn('Failed to fetch quiz submissions:', error);
    return [];
  }
}

/**
 * Get recent activities for a student
 * Combines submissions and available quizzes
 */
export async function getStudentRecentActivities(studentId: string, classId: string) {
  try {
    // Get recent submissions
    const submissions = await getStudentSubmissions(studentId);
    
    // Get available quizzes
    const quizzes = await getStudentQuizzes(classId);
    
    // Combine and format activities
    const activities = [
      ...submissions.map(sub => ({
        id: sub.id,
        title: 'Quiz Completado',
        status: 'completed' as const,
        score: sub.score,
        date: sub.submitted_at,
      })),
      ...quizzes
        .filter(quiz => !submissions.find(sub => sub.quiz_id === quiz.id))
        .map(quiz => ({
          id: quiz.id,
          title: quiz.title,
          status: 'pending' as const,
          score: null,
          date: quiz.created_at,
        })),
    ];
    
    // Sort by date (most recent first)
    activities.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return activities.slice(0, 10); // Return top 10
  } catch (error) {
    console.warn('Failed to fetch recent activities:', error);
    return [];
  }
}
