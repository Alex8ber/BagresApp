/**
 * Notifications Services
 * 
 * Services for managing notifications for students and teachers
 */

import { supabase } from './client';
import { DatabaseError, NetworkError } from '@/types/errors';

export interface Notification {
  id: string;
  user_id: string;
  user_type: 'student' | 'teacher';
  type: 'quiz_added' | 'material_added' | 'quiz_completed' | 'class_update';
  title: string;
  message: string;
  read: boolean;
  related_id?: string; // ID of quiz, material, etc.
  created_at: string;
}

/**
 * Get notifications for a user
 */
export async function getNotifications(userId: string, userType: 'student' | 'teacher') {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .eq('user_type', userType)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch notifications');
  }
}

/**
 * Get unread notification count
 */
export async function getUnreadCount(userId: string, userType: 'student' | 'teacher') {
  try {
    const { count, error } = await supabase
      .from('notifications')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('read', false);

    if (error) {
      throw new DatabaseError(error.message);
    }

    return count || 0;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch unread count');
  }
}

/**
 * Mark notification as read
 */
export async function markAsRead(notificationId: string) {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to mark notification as read');
  }
}

/**
 * Mark all notifications as read
 */
export async function markAllAsRead(userId: string, userType: 'student' | 'teacher') {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ read: true })
      .eq('user_id', userId)
      .eq('user_type', userType)
      .eq('read', false);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to mark all as read');
  }
}

/**
 * Create notification for students when teacher adds material
 */
export async function notifyStudentsNewMaterial(classId: string, materialTitle: string, materialId: string) {
  try {
    // Get all students in the class
    const { data: enrollments, error: enrollError } = await supabase
      .from('class_students')
      .select('student_id')
      .eq('class_id', classId);

    if (enrollError) {
      throw new DatabaseError(enrollError.message);
    }

    if (!enrollments || enrollments.length === 0) {
      return; // No students to notify
    }

    // Create notifications for all students
    const notifications = enrollments.map(enrollment => ({
      user_id: enrollment.student_id,
      user_type: 'student' as const,
      type: 'material_added' as const,
      title: 'Nuevo Material',
      message: `Tu profesor ha subido: ${materialTitle}`,
      related_id: materialId,
      read: false,
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    console.error('Error creating material notifications:', error);
    // Don't throw - notifications are not critical
  }
}

/**
 * Create notification for students when teacher adds quiz
 */
export async function notifyStudentsNewQuiz(classId: string, quizTitle: string, quizId: string) {
  try {
    // Get all students in the class
    const { data: enrollments, error: enrollError } = await supabase
      .from('class_students')
      .select('student_id')
      .eq('class_id', classId);

    if (enrollError) {
      throw new DatabaseError(enrollError.message);
    }

    if (!enrollments || enrollments.length === 0) {
      return;
    }

    // Create notifications for all students
    const notifications = enrollments.map(enrollment => ({
      user_id: enrollment.student_id,
      user_type: 'student' as const,
      type: 'quiz_added' as const,
      title: 'Nuevo Quiz Disponible',
      message: `Nuevo quiz: ${quizTitle}`,
      related_id: quizId,
      read: false,
    }));

    const { error } = await supabase
      .from('notifications')
      .insert(notifications);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    console.error('Error creating quiz notifications:', error);
  }
}

/**
 * Create notification for teacher when student completes quiz
 */
export async function notifyTeacherQuizCompleted(
  teacherId: string,
  studentName: string,
  quizTitle: string,
  score: number,
  quizId: string
) {
  try {
    const { error } = await supabase
      .from('notifications')
      .insert({
        user_id: teacherId,
        user_type: 'teacher',
        type: 'quiz_completed',
        title: 'Quiz Completado',
        message: `${studentName} completó "${quizTitle}" con ${score} puntos`,
        related_id: quizId,
        read: false,
      });

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    console.error('Error creating teacher notification:', error);
  }
}
