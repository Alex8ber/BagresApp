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
  TeacherDashboard: undefined;
  TeacherStudentsList: { classId: string };
  TeacherCreateTest: { classId?: string };
  TeacherCreateClass: undefined;
  TeacherReports: { classId?: string };
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
