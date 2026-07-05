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
// Admin Utilities: stats, activity, user management
// ============================================================================

export async function getAdminStats() {
  try {
    const [teachersRes, studentsRes, classesRes, materialsRes, quizzesRes] = await Promise.all([
      supabase.from('teachers').select('*', { count: 'exact', head: true }),
      supabase.from('students').select('*', { count: 'exact', head: true }),
      supabase.from('classes').select('*', { count: 'exact', head: true }),
      supabase.from('class_materials').select('*', { count: 'exact', head: true }),
      supabase.from('quizzes').select('*', { count: 'exact', head: true }),
    ]);

    return {
      teachers: teachersRes.count || 0,
      students: studentsRes.count || 0,
      classes: classesRes.count || 0,
      materials: materialsRes.count || 0,
      quizzes: quizzesRes.count || 0,
    };
  } catch (error) {
    throw new NetworkError('Failed to fetch admin stats');
  }
}

export async function getRecentActivity(limit = 8) {
  try {
    const { data: recentSubmissions, error: subErr } = await supabase
      .from('quiz_submissions')
      .select(`*, students:student_id(full_name), quizzes:quiz_id(title)`) 
      .order('submitted_at', { ascending: false })
      .limit(limit);

    if (subErr) throw new DatabaseError(subErr.message);

    const { data: recentTeachers, error: tErr } = await supabase
      .from('teachers')
      .select(`id, full_name, email, created_at, verified`)
      .order('created_at', { ascending: false })
      .limit(5);

    if (tErr) throw new DatabaseError(tErr.message);

    return {
      submissions: recentSubmissions || [],
      newTeachers: recentTeachers || [],
    };
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch recent activity');
  }
}

export async function getPendingTeachers() {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('verified', false)
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message);
    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch pending teachers');
  }
}

export async function getAllTeachers() {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message);
    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch teachers');
  }
}

export async function verifyTeacher(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update({ verified: true } as any)
      .eq('id', teacherId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to verify teacher');
  }
}

export async function deactivateTeacher(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update({ is_active: false } as any)
      .eq('id', teacherId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to deactivate teacher');
  }
}

export async function activateTeacher(teacherId: string) {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update({ is_active: true } as any)
      .eq('id', teacherId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to activate teacher');
  }
}

export async function deleteTeacher(teacherId: string) {
  try {
    const { error } = await supabase.from('teachers').delete().eq('id', teacherId);
    if (error) throw new DatabaseError(error.message);
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to delete teacher');
  }
}

export async function getAllStudents() {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`*, classes:class_id(name)`) 
      .order('created_at', { ascending: false });

    if (error) throw new DatabaseError(error.message);
    return data || [];
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to fetch students');
  }
}

export async function deleteStudent(studentId: string) {
  try {
    const { error } = await supabase.from('students').delete().eq('id', studentId);
    if (error) throw new DatabaseError(error.message);
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to delete student');
  }
}

export async function reassignStudentToClass(studentId: string, classId: string) {
  try {
    const { data, error } = await supabase
      .from('students')
      .update({ class_id: classId } as any)
      .eq('id', studentId)
      .select()
      .single();

    if (error) throw new DatabaseError(error.message);
    return data;
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    throw new NetworkError('Failed to reassign student');
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
