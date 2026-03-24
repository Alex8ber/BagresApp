import { createClient } from '@supabase/supabase-js';
import type { Database, TypedSupabaseClient } from '@/types/database';

/**
 * Supabase Configuration
 * 
 * TODO: Replace these with your actual Supabase credentials
 * You can find these in your Supabase project settings:
 * https://app.supabase.com/project/_/settings/api
 */
const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';

/**
 * Typed Supabase Client Instance
 * 
 * This is the main Supabase client used throughout the application.
 * It's configured with TypeScript types for full type safety on all
 * database operations.
 * 
 * @example
 * ```tsx
 * import { supabase } from '@/services/supabase/client';
 * 
 * // All operations are type-safe
 * const { data, error } = await supabase
 *   .from('teachers')
 *   .select('*');
 * // data is typed as Teacher[]
 * ```
 */
export const supabase: TypedSupabaseClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);
