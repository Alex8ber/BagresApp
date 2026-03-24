/**
 * useAuth Hook
 * 
 * Re-exports the useAuth hook from AuthContext for backward compatibility.
 * This file maintains the hook interface that was defined before AuthContext was implemented.
 * 
 * Requirements: 4.1, 4.2, 4.3, 6.6, 6.7
 * 
 * @example
 * ```tsx
 * function LoginScreen() {
 *   const { user, signIn, loading, error } = useAuth();
 *   
 *   const handleLogin = async () => {
 *     await signIn(email, password, 'teacher');
 *   };
 *   
 *   return <View>...</View>;
 * }
 * ```
 */

export {
  useAuth,
  type UserRole,
  type AuthContextState,
  type AuthContextActions,
  type AuthContextValue,
} from '@/context/AuthContext';
