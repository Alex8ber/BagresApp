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
      .from('materials')
      .select('*')
      .eq('class_id', classId)
      .eq('published', true)
      .order('created_at', { ascending: false });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch materials');
  }
}

/**
 * Get quizzes for a student's class
 * Only returns published quizzes within their availability window
 */
export async function getStudentQuizzes(classId: string) {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        quiz_questions (
          id
        )
      `)
      .eq('class_id', classId)
      .eq('published', true)
      .lte('available_from', now)
      .gte('available_until', now)
      .order('available_from', { ascending: false });

    if (error) {
      throw new DatabaseError(error.message);
    }

    // Add question count to each quiz
    return (data || []).map(quiz => ({
      ...quiz,
      question_count: quiz.quiz_questions?.length || 0,
    }));
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch quizzes');
  }
}

/**
 * Get upcoming quizzes for a student's class
 */
export async function getUpcomingQuizzes(classId: string) {
  try {
    const now = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('quizzes')
      .select('*')
      .eq('class_id', classId)
      .eq('published', true)
      .gte('available_from', now)
      .order('available_from', { ascending: true })
      .limit(5);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch upcoming quizzes');
  }
}

/**
 * Get student's quiz submissions
 */
export async function getStudentSubmissions(studentId: string) {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select(`
        *,
        quizzes (
          title,
          class_id
        )
      `)
      .eq('student_id', studentId)
      .order('submitted_at', { ascending: false });

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch submissions');
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
        title: sub.quizzes?.title || 'Quiz',
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
          date: quiz.available_from,
        })),
    ];
    
    // Sort by date (most recent first)
    activities.sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    return activities.slice(0, 10); // Return top 10
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch recent activities');
  }
}
