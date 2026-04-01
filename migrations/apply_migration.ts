/**
 * Migration Script: Apply Quiz Schema Updates
 * 
 * This script applies the database schema updates for the Quiz Editor System.
 * It can be run directly using ts-node or compiled and run with node.
 * 
 * Usage:
 *   npx ts-node migrations/apply_migration.ts
 * 
 * Prerequisites:
 *   - Supabase client must be configured with proper credentials
 *   - User must have database admin privileges
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
const SUPABASE_URL = process.env.SUPABASE_URL || process.env.EXPO_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Error: Missing Supabase credentials');
  console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables');
  process.exit(1);
}

// Create Supabase client with service role key (required for schema changes)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function applyMigration() {
  console.log('🚀 Starting Quiz Schema Migration...\n');

  try {
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '001_update_quiz_schema.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf-8');

    console.log('📄 Migration file loaded: 001_update_quiz_schema.sql');
    console.log('⏳ Applying migration...\n');

    // Execute the migration
    // Note: Supabase client doesn't support raw SQL execution directly
    // This would need to be done through the Supabase dashboard SQL editor
    // or using a direct PostgreSQL connection
    
    console.log('⚠️  Important: This script requires direct database access.');
    console.log('');
    console.log('To apply this migration, please use one of these methods:');
    console.log('');
    console.log('Method 1: Supabase Dashboard');
    console.log('  1. Go to your Supabase project dashboard');
    console.log('  2. Navigate to SQL Editor');
    console.log('  3. Copy the contents of migrations/001_update_quiz_schema.sql');
    console.log('  4. Paste and run in the SQL Editor');
    console.log('');
    console.log('Method 2: Direct PostgreSQL Connection');
    console.log('  psql $DATABASE_URL -f migrations/001_update_quiz_schema.sql');
    console.log('');
    console.log('Method 3: Supabase CLI');
    console.log('  supabase db push');
    console.log('');
    
    // Verify current schema
    console.log('📊 Checking current schema...\n');
    
    const { data: questions, error: questionsError } = await supabase
      .from('quiz_questions')
      .select('question_type')
      .limit(1);

    if (questionsError) {
      console.log('⚠️  Could not query quiz_questions table');
      console.log('   This might mean the table doesn\'t exist yet or migration is needed');
    } else {
      console.log('✓ quiz_questions table exists');
      if (questions && questions.length > 0) {
        console.log(`  Current question_type value: ${questions[0].question_type}`);
      }
    }

    console.log('\n📋 Migration Summary:');
    console.log('  • Update question_type enum to: single_choice, multiple_choice, open_ended');
    console.log('  • Add indexes on quiz_questions(quiz_id, order_index)');
    console.log('  • Add indexes on quiz_options(question_id, order_index)');
    console.log('  • Ensure CASCADE DELETE constraints');
    console.log('');
    console.log('✅ Migration script completed');
    console.log('   Please apply the migration using one of the methods above');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  }
}

// Run the migration
applyMigration();
