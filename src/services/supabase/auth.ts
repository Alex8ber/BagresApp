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
    console.log('🔐 Attempting signup with:', { email, passwordLength: password.length });
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          email_confirm: true, // Auto-confirm for development
        },
      }
    });

    if (error) {
      console.error('❌ Signup error:', error);
      
      // Handle specific error cases
      if (error.message.includes('rate limit')) {
        throw new AuthenticationError('Has intentado registrarte demasiadas veces. Por favor espera unos minutos e intenta de nuevo.');
      }
      
      if (error.message.includes('invalid')) {
        throw new AuthenticationError('El formato del email no es válido. Intenta con otro email.');
      }
      
      throw new AuthenticationError(`Error al registrarse: ${error.message}`);
    }

    if (!data.user) {
      throw new AuthenticationError('No se recibieron datos del usuario');
    }

    console.log('✅ Signup successful:', data.user.id);
    return data.user;
  } catch (error) {
    console.error('❌ Signup exception:', error);
    if (error instanceof AuthenticationError) {
      throw error;
    }
    throw new NetworkError('Error de conexión con el servicio de autenticación');
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
      if (error.message.includes('not authenticated') || error.message.includes('session missing')) {
        return null;
      }
      console.error('getCurrentUser error:', error);
      return null; // Return null instead of throwing for any auth error
    }

    return data.user;
  } catch (error) {
    console.error('getCurrentUser exception:', error);
    return null; // Return null instead of throwing
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

/**
 * Join a class using a class code (for students)
 * If student already exists in the class, returns existing profile (login)
 * If student doesn't exist, creates new profile (register)
 * 
 * @param fullName - Student's full name (case-insensitive)
 * @param classCode - The 6-character class code
 * @returns Object with student profile and class ID
 * @throws {AuthenticationError} If class code is invalid
 * @throws {DatabaseError} If database operation fails
 */
export async function joinClassWithCode(
  fullName: string,
  classCode: string
): Promise<{ student: Student; classId: string; isNewStudent: boolean }> {
  try {
    // Normalize inputs
    const normalizedCode = classCode.trim().toUpperCase();
    const normalizedName = fullName.trim();
    
    console.log('🔍 Joining class with code:', normalizedCode, 'Name:', normalizedName);
    
    // 1. Validate class code exists
    const { data: classes, error: classError } = await supabase
      .from('classes')
      .select('id, teacher_id, class_code, name')
      .ilike('class_code', normalizedCode);

    console.log('📊 Query result:', { classes, classError });

    if (classError) {
      console.error('❌ Database error:', classError);
      throw new DatabaseError(classError.message);
    }

    if (!classes || classes.length === 0) {
      console.error('❌ No class found with code:', normalizedCode);
      throw new AuthenticationError('Código de clase inválido. Verifica con tu profesor.');
    }

    const classData = classes[0];
    console.log('✅ Class found:', classData);

    // 2. Check if student already exists in this class (case-insensitive name match)
    const { data: existingEnrollments, error: enrollError } = await supabase
      .from('class_students')
      .select(`
        student_id,
        students (
          id,
          full_name
        )
      `)
      .eq('class_id', classData.id);

    console.log('📊 Existing enrollments:', existingEnrollments);

    if (enrollError) {
      console.error('❌ Error checking enrollments:', enrollError);
      throw new DatabaseError(enrollError.message);
    }

    // Find student with matching name (case-insensitive)
    const existingStudent = existingEnrollments?.find(enrollment => 
      enrollment.students?.full_name?.toLowerCase() === normalizedName.toLowerCase()
    );

    if (existingStudent) {
      // Student already exists - this is a LOGIN
      console.log('✅ Student already exists, logging in:', existingStudent.students);
      
      // Fetch full student profile
      const { data: studentProfile, error: profileError } = await supabase
        .from('students')
        .select('*')
        .eq('id', existingStudent.student_id)
        .single();

      if (profileError || !studentProfile) {
        console.error('❌ Error fetching student profile:', profileError);
        throw new DatabaseError('Error al cargar perfil de estudiante');
      }

      return {
        student: studentProfile,
        classId: classData.id,
        isNewStudent: false,
      };
    }

    // 3. Student doesn't exist - CREATE NEW STUDENT
    console.log('👤 Creating new student profile...');
    
    // Generate a unique ID for the student
    const studentId = `student_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    const { data: student, error: studentError } = await supabase
      .from('students')
      .insert({
        id: studentId,
        full_name: normalizedName,
      } as any)
      .select()
      .single();

    console.log('📊 Student profile result:', { student: student?.id, studentError });

    if (studentError || !student) {
      console.error('❌ Student profile error:', studentError);
      throw new DatabaseError('Error al crear perfil de estudiante');
    }

    // 4. Enroll student in class
    console.log('📝 Enrolling student in class...');
    const { error: enrollmentError } = await supabase
      .from('class_students')
      .insert({
        class_id: classData.id,
        student_id: studentId,
      });

    console.log('📊 Enrollment result:', { enrollmentError });

    if (enrollmentError) {
      console.error('❌ Enrollment error:', enrollmentError);
      throw new DatabaseError('Error al inscribirse en la clase');
    }

    console.log('✅ New student successfully joined class!');
    return {
      student,
      classId: classData.id,
      isNewStudent: true,
    };
  } catch (error) {
    if (error instanceof AuthenticationError || error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Error de conexión al unirse a la clase');
  }
}

/**
 * Update teacher profile
 * 
 * @param userId - The teacher's user ID
 * @param updates - Partial teacher data to update
 * @returns The updated teacher profile
 * @throws {DatabaseError} If database operation fails
 * @throws {NetworkError} If network request fails
 */
export async function updateTeacherProfile(
  userId: string,
  updates: Partial<Omit<Teacher, 'id' | 'created_at' | 'updated_at'>>
): Promise<Teacher> {
  try {
    const { data, error } = await supabase
      .from('teachers')
      .update(updates as any)
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      throw new DatabaseError(error.message);
    }

    if (!data) {
      throw new DatabaseError('No teacher data returned');
    }

    return data;
  } catch (error) {
    if (error instanceof DatabaseError) {
      throw error;
    }
    throw new NetworkError('Failed to update teacher profile');
  }
}
