/**
 * Admin Services
 * 
 * Global services for administrators to view and manage all content and qualifications.
 */

import { supabase } from './client';
import { DatabaseError, NetworkError } from '@/types/errors';

// ============================================================================
// Global Queries (Admin Only)
// ============================================================================

export async function getAllClasses() {
  try {
    const { data, error } = await supabase
      .from('classes')
      .select(`
        *,
        teachers:teacher_id (
          full_name,
          email
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message);
    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch all classes');
  }
}

export async function getAllMaterials() {
  try {
    const { data, error } = await supabase
      .from('class_materials')
      .select(`
        *,
        classes:class_id (
          name,
          teachers:teacher_id (
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message);
    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch all materials');
  }
}

export async function getAllQuizzes() {
  try {
    const { data, error } = await supabase
      .from('quizzes')
      .select(`
        *,
        classes:class_id (
          name,
          teachers:teacher_id (
            full_name
          )
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message);
    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch all quizzes');
  }
}

export async function getAllQuizSubmissions() {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .select(`
        *,
        students:student_id (
          full_name
        ),
        quizzes:quiz_id (
          title,
          classes:class_id (
            name
          )
        )
      `)
      .order('submitted_at', { ascending: false });

    if (error) throw new DatabaseError(error.message);
    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch all quiz submissions');
  }
}

// ============================================================================
// Modifying Actions (Admin Only)
// ============================================================================

export async function updateSubmissionScore(submissionId: string, newScore: number) {
  try {
    const { data, error } = await supabase
      .from('quiz_submissions')
      .update({ score: newScore } as any)
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to update submission score');
  }
}

export async function deleteClassByAdmin(classId: string) {
  try {
    const { error } = await supabase.from('classes').delete().eq('id', classId);
    if (error) throw new DatabaseError(error.message);
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to delete class');
  }
}

export async function deleteMaterialByAdmin(materialId: string) {
  try {
    const { error } = await supabase.from('class_materials').delete().eq('id', materialId);
    if (error) throw new DatabaseError(error.message);
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to delete material');
  }
}

export async function deleteQuizByAdmin(quizId: string) {
  try {
    const { error } = await supabase.from('quizzes').delete().eq('id', quizId);
    if (error) throw new DatabaseError(error.message);
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to delete quiz');
  }
}
