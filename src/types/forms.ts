// Form Types for BagresApp
// Defines interfaces for all form data and validation errors

// Login Form
export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginFormErrors {
  email?: string;
  password?: string;
}

// Teacher Registration Form
export interface TeacherRegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  school: string;
}

export interface TeacherRegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  school?: string;
}

// Student Registration Form
export interface StudentRegisterFormData {
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  grade: string;
}

export interface StudentRegisterFormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  fullName?: string;
  grade?: string;
}

// Class Creation Form
export interface ClassFormData {
  name: string;
  subject: string;
  grade: string;
  description: string;
}

export interface ClassFormErrors {
  name?: string;
  subject?: string;
  grade?: string;
  description?: string;
}
