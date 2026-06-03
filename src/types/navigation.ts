import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

/**
 * Root Stack Parameter List
 * 
 * Defines all routes in the main navigation stack with their required parameters.
 * Use `undefined` for routes that don't require parameters.
 */
export type RootStackParamList = {
  RoleSelection: undefined;
  StudentLogin: undefined;
  StudentRegister: undefined;
  TeacherLogin: undefined;
  TeacherRegister: undefined;
  TeacherVerification: { email: string };
  StudentDashboard: undefined;
  TeacherDashboard: undefined;
  TeacherStudentsList: { classId: string };
  TeacherCreateTest: { classId?: string };
  TeacherCreateClass: undefined;
  TeacherCreateMaterial: { classId: string; className: string };
  TeacherCreateQuiz: { classId: string; className: string };
  QuizEditor: { quizId: string; classId: string; className: string };
  QuizDetail: { quizId: string; classId: string };
  StudentQuiz: { quizId: string };
  StudentTakeQuiz: { quizId: string };
  StudentQuizResults: {
    quizId: string;
    quizTitle: string;
    score: number;
    correctAnswers: number;
    totalQuestions: number;
    passed: boolean;
    passingScore: number;
  };
  TeacherMaterialDetail: { materialId: string; classId: string };
  TeacherReports: { classId?: string };
  TeacherSubmissionDetail: {
    submissionId: string;
    quizId: string;
    studentName: string;
    score: number;
  };
  TeacherEditProfile: undefined;
  TeacherNotifications: undefined;
  TeacherSchedule: undefined;
};

/**
 * Teacher Dashboard Tabs Parameter List
 * 
 * Defines all tabs in the teacher dashboard bottom tab navigator.
 */
export type TeacherTabParamList = {
  Main: undefined;
  Classes: undefined;
  Library: undefined;
  Profile: undefined;
};

/**
 * Student Dashboard Tabs Parameter List
 * 
 * Defines all tabs in the student dashboard bottom tab navigator.
 * Note: Students join only one class, so no Classes tab needed.
 */
export type StudentTabParamList = {
  Main: undefined;
  Library: undefined;
  Profile: undefined;
};

/**
 * Root Stack Screen Props
 * 
 * Type-safe props for screens in the root stack navigator.
 * Provides typed navigation and route props.
 * 
 * @example
 * ```tsx
 * type Props = RootStackScreenProps<'TeacherVerification'>;
 * 
 * function TeacherVerificationScreen({ navigation, route }: Props) {
 *   const { email } = route.params; // Typed as string
 *   navigation.navigate('TeacherDashboard'); // Type-checked
 * }
 * ```
 */
export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

/**
 * Teacher Tab Screen Props
 * 
 * Type-safe props for screens in the teacher dashboard tab navigator.
 * Provides typed navigation and route props for tab screens.
 * 
 * @example
 * ```tsx
 * type Props = TeacherTabScreenProps<'Classes'>;
 * 
 * function TeacherClassesScreen({ navigation }: Props) {
 *   navigation.navigate('Main'); // Type-checked
 * }
 * ```
 */
export type TeacherTabScreenProps<T extends keyof TeacherTabParamList> =
  BottomTabScreenProps<TeacherTabParamList, T>;

/**
 * Student Tab Screen Props
 * 
 * Type-safe props for screens in the student dashboard tab navigator.
 * Provides typed navigation and route props for tab screens.
 * 
 * @example
 * ```tsx
 * type Props = StudentTabScreenProps<'Classes'>;
 * 
 * function StudentClassesScreen({ navigation }: Props) {
 *   navigation.navigate('Main'); // Type-checked
 * }
 * ```
 */
export type StudentTabScreenProps<T extends keyof StudentTabParamList> =
  BottomTabScreenProps<StudentTabParamList, T>;

/**
 * Global namespace declaration for React Navigation
 * 
 * This extends the React Navigation types globally to provide
 * autocomplete and type-checking for navigation throughout the app.
 * 
 * With this declaration, you can use:
 * - useNavigation() hook with full type safety
 * - navigation.navigate() with autocomplete for route names
 * - Compile-time validation of route parameters
 */
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
