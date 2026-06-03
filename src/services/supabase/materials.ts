import { supabase } from './client';
import type {
  ClassMaterial,
  ClassMaterialInsert,
  ClassMaterialUpdate,
} from '@/types/database';
import { DatabaseError, NetworkError } from '@/types/errors';

/**
 * Get all materials for a specific class
 * 
 * @param classId - The class ID
 * @returns Array of materials for the class
 */
export async function getClassMaterials(classId: string): Promise<ClassMaterial[]> {
  try {
    const { data, error } = await supabase
      .from('class_materials')
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
    throw new NetworkError('Failed to fetch class materials');
  }
}

/**
 * Get all materials for a teacher's classes
 * 
 * @param teacherId - The teacher's user ID
 * @returns Array of materials grouped by class
 */
export async function getTeacherMaterials(teacherId: string): Promise<ClassMaterial[]> {
  try {
    const { data, error } = await supabase
      .from('class_materials')
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
    throw new NetworkError('Failed to fetch teacher materials');
  }
}

/**
 * Create a new material
 * 
 * @param materialData - The material data to insert
 * @returns The created material
 */
export async function createMaterial(materialData: ClassMaterialInsert): Promise<ClassMaterial> {
  try {
    const { data, error } = await supabase
      .from('class_materials')
      .insert(materialData as any)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No material data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to create material');
  }
}

/**
 * Update an existing material
 * 
 * @param materialId - The material ID to update
 * @param updates - Partial material data to update
 * @returns The updated material
 */
export async function updateMaterial(
  materialId: string,
  updates: ClassMaterialUpdate
): Promise<ClassMaterial> {
  try {
    const { data, error } = await supabase
      .from('class_materials')
      .update(updates as any)
      .eq('id', materialId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No material data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update material');
  }
}

/**
 * Delete a material
 * 
 * @param materialId - The material ID to delete
 */
export async function deleteMaterial(materialId: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('class_materials')
      .delete()
      .eq('id', materialId);

    if (error) {
      throw new DatabaseError(error.message);
    }
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to delete material');
  }
}
