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

function normalizeRpcBooleanResult(result: any): boolean {
  if (result === true) return true;
  if (Array.isArray(result) && result.length === 1 && result[0] === true) return true;
  if (typeof result === 'object' && result !== null && Object.values(result).includes(true)) return true;
  return false;
}

async function deleteTeacherDirect(teacherId: string) {
  const { data, error, count } = await supabase
    .from('teachers')
    .delete({ count: 'exact' })
    .eq('id', teacherId);

  console.log('deleteTeacherDirect result', { data, error, count });

  if (error) {
    throw new DatabaseError(`Supabase error: ${error.message} (code: ${error.code})`);
  }

  if (count === 0) {
    throw new DatabaseError('No se eliminó ningún profesor. Verifica el identificador.');
  }
}

export async function deleteTeacher(teacherId: string) {
  try {
    console.log('deleteTeacher called', { teacherId });
    const { data, error } = await (supabase as any).rpc('admin_delete_teacher_profile', {
      p_teacher_id: teacherId,
    });

    console.log('deleteTeacher RPC response', { data, error });

    if (error) {
      console.warn('RPC deleteTeacher failed, falling back to direct delete', error);
      return deleteTeacherDirect(teacherId);
    }

    if (!normalizeRpcBooleanResult(data)) {
      console.warn('RPC deleteTeacher returned unexpected result, falling back to direct delete', data);
      return deleteTeacherDirect(teacherId);
    }
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error('deleteTeacher exception', error);
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

async function deleteStudentDirect(studentId: string) {
  const { error, count } = await supabase
    .from('students')
    .delete({ count: 'exact' })
    .eq('id', studentId);

  if (error) {
    throw new DatabaseError(`Supabase error: ${error.message} (code: ${error.code})`);
  }

  if (count === 0) {
    throw new DatabaseError('No se eliminó ningún estudiante. Verifica el identificador.');
  }
}

export async function deleteStudent(studentId: string) {
  try {
    console.log('deleteStudent called', { studentId });
    const { data, error } = await (supabase as any).rpc('admin_delete_student_profile', {
      p_student_id: studentId,
    });

    console.log('deleteStudent RPC response', { data, error });

    if (error) {
      console.warn('RPC deleteStudent failed, falling back to direct delete', error);
      return deleteStudentDirect(studentId);
    }

    if (!normalizeRpcBooleanResult(data)) {
      console.warn('RPC deleteStudent returned unexpected result, falling back to direct delete', data);
      return deleteStudentDirect(studentId);
    }
  } catch (error) {
    if (error instanceof DatabaseError) throw error;
    console.error('deleteStudent exception', error);
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
