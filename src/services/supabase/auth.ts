import type { User } from '@supabase/supabase-js';
import { supabase } from './client';
import type {
  Teacher,
  Student,
  TeacherInsert,
  StudentInsert,
} from '@/types/database';
import { AuthenticationError, NetworkError, DatabaseError } from '@/types/errors';

/**
 * Sign in with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns The authenticated user object
 * @throws {AuthenticationError} If credentials are invalid
 * @throws {NetworkError} If network request fails
 */
export async function signIn(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new AuthenticationError(error.message);
    }

    if (!data.user) {
      throw new AuthenticationError('No user data returned');
    }

    return data.user;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new NetworkError('Failed to connect to authentication service');
  }
}

/**
 * Sign up a new user with email and password
 * 
 * @param email - User's email address
 * @param password - User's password
 * @returns The newly created user object
 * @throws {AuthenticationError} If signup fails
 * @throws {NetworkError} If network request fails
 */
export async function signUp(email: string, password: string): Promise<User> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new AuthenticationError(error.message);
    }

    if (!data.user) {
      throw new AuthenticationError('No user data returned');
    }

    return data.user;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new NetworkError('Failed to connect to authentication service');
  }
}

/**
 * Sign out the current user
 * 
 * @throws {AuthenticationError} If sign out fails
 * @throws {NetworkError} If network request fails
 */
export async function signOut(): Promise<void> {
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw new AuthenticationError(error.message);
    }
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new NetworkError('Failed to connect to authentication service');
  }
}

/**
 * Get the currently authenticated user
 * 
 * @returns The current user or null if not authenticated
 * @throws {NetworkError} If network request fails
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // If user is not authenticated, return null instead of throwing
      if (error.message.includes('not authenticated')) {
        return null;
      }
      throw new AuthenticationError(error.message);
    }

    return data.user;
  } catch (error) {
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new NetworkError('Failed to connect to authentication service');
  }
}

/**
 * Create a teacher profile in the database
 * 
 * @param userId - The auth user ID
 * @param data - Teacher profile data
 * @returns The created teacher profile
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function createTeacherProfile(
  userId: string,
  data: TeacherInsert
): Promise<Teacher> {
  try {
    // Type assertion needed due to Supabase TypeScript limitations
    const { data: teacher, error } = await supabase
      .from('teachers')
      .insert({
        ...data,
        id: userId,
      } as any)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!teacher) {
      throw new DatabaseError('No teacher data returned');
    }

    return teacher;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to create teacher profile');
  }
}

/**
 * Create a student profile in the database
 * 
 * @param userId - The auth user ID
 * @param data - Student profile data
 * @returns The created student profile
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function createStudentProfile(
  userId: string,
  data: StudentInsert
): Promise<Student> {
  try {
    // Type assertion needed due to Supabase TypeScript limitations
    const { data: student, error } = await supabase
      .from('students')
      .insert({
        ...data,
        id: userId,
      } as any)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!student) {
      throw new DatabaseError('No student data returned');
    }

    return student;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to create student profile');
  }
}

/**
 * Get a teacher profile by user ID
 * 
 * @param userId - The auth user ID
 * @returns The teacher profile or null if not found
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function getTeacherProfile(userId: string): Promise<Teacher | null> {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If teacher not found, return null instead of throwing
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new DatabaseError(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch teacher profile');
  }
}

/**
 * Get a student profile by user ID
 * 
 * @param userId - The auth user ID
 * @returns The student profile or null if not found
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function getStudentProfile(userId: string): Promise<Student | null> {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      // If student not found, return null instead of throwing
      if (error.code === 'PGRST116') {
        return null;
      }
      throw new DatabaseError(error.message);
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to fetch student profile');
  }
}
