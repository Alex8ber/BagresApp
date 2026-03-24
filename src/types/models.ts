/**
 * Domain Model Types
 * 
 * Defines business entities and domain models for the application.
 * These models represent the core business logic and are used throughout
 * the application for type-safe data handling.
 * 
 * Note: These models use camelCase and Date objects for better TypeScript
 * ergonomics, while database types use snake_case and string timestamps.
 * Use transformers to convert between database and domain models.
 */

/**
 * Base User
 * 
 * Common properties shared by all user types in the system.
 */
export interface BaseUser {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Teacher
 * 
 * Represents a teacher user with additional teacher-specific properties.
 * Extends BaseUser with school, verification status, and subjects.
 */
export interface Teacher extends BaseUser {
  school: string;
  verified: boolean;
  subjects: string[];
}

/**
 * Student
 * 
 * Represents a student user with grade level and enrolled classes.
 * Extends BaseUser with student-specific properties.
 */
export interface Student extends BaseUser {
  grade: string;
  enrolledClasses: string[];
}

/**
 * Class
 * 
 * Represents a class/course in the system.
 * Contains basic class information without related entities.
 */
export interface Class {
  id: string;
  teacherId: string;
  name: string;
  subject: string;
  grade: string;
  description: string | null;
  studentCount: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * ClassWithTeacher
 * 
 * Extended class model that includes teacher information.
 * Useful for displaying class details with teacher context.
 * 
 * @example
 * ```tsx
 * const classWithTeacher: ClassWithTeacher = {
 *   ...classData,
 *   teacher: {
 *     id: 'teacher-123',
 *     fullName: 'John Doe',
 *     email: 'john@school.edu'
 *   }
 * };
 * ```
 */
export interface ClassWithTeacher extends Class {
  teacher: Pick<Teacher, 'id' | 'fullName' | 'email'>;
}

/**
 * ClassWithStudents
 * 
 * Extended class model that includes the full list of enrolled students.
 * Useful for class management and student roster views.
 * 
 * @example
 * ```tsx
 * const classWithStudents: ClassWithStudents = {
 *   ...classData,
 *   students: [
 *     { id: '1', fullName: 'Alice', ... },
 *     { id: '2', fullName: 'Bob', ... }
 *   ]
 * };
 * ```
 */
export interface ClassWithStudents extends Class {
  students: Student[];
}

/**
 * Test
 * 
 * Represents a test/assignment in the system.
 * Contains test metadata and scheduling information.
 */
export interface Test {
  id: string;
  classId: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  totalPoints: number;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * TestSubmission
 * 
 * Represents a student's submission for a test.
 * Tracks submission status, score, and grading information.
 */
export interface TestSubmission {
  id: string;
  testId: string;
  studentId: string;
  score: number | null;
  submittedAt: Date | null;
  gradedAt: Date | null;
}
