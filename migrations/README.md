# Database Migrations

This directory contains SQL migration files for the Quiz Editor System.

## Migration Files

### 001_update_quiz_schema.sql

**Purpose**: Updates the database schema to support the Quiz Editor System with three question types.

**Changes**:
1. Updates `question_type` enum from `('multiple_choice', 'true_false', 'short_answer')` to `('single_choice', 'multiple_choice', 'open_ended')`
2. Adds performance indexes:
   - `idx_quiz_questions_quiz_id` on `quiz_questions(quiz_id)`
   - `idx_quiz_questions_quiz_id_order` on `quiz_questions(quiz_id, order_index)`
   - `idx_quiz_options_question_id` on `quiz_options(question_id)`
   - `idx_quiz_options_question_id_order` on `quiz_options(question_id, order_index)`
3. Ensures CASCADE DELETE constraints on foreign keys:
   - `quiz_questions.quiz_id` → `quizzes.id`
   - `quiz_options.question_id` → `quiz_questions.id`

**Data Migration**:
- `multiple_choice` → `multiple_choice` (unchanged)
- `true_false` → `single_choice` (true/false is a type of single choice question)
- `short_answer` → `open_ended` (short answer is an open-ended question)

## How to Apply Migrations

### Using Supabase Dashboard

1. Log in to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy the contents of `001_update_quiz_schema.sql`
4. Paste into the SQL Editor
5. Click "Run" to execute the migration

### Using Supabase CLI

```bash
# If you have Supabase CLI installed
supabase db push

# Or apply directly
psql $DATABASE_URL -f migrations/001_update_quiz_schema.sql
```

### Verification

After applying the migration, you can verify the changes by running the verification queries included at the bottom of the migration file:

```sql
-- Verify the new enum values
SELECT enum_range(NULL::question_type_enum);

-- Verify indexes exist
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename IN ('quiz_questions', 'quiz_options')
ORDER BY tablename, indexname;

-- Verify CASCADE DELETE constraints
SELECT
    tc.table_name, 
    tc.constraint_name, 
    tc.constraint_type,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
LEFT JOIN information_schema.referential_constraints AS rc
    ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name IN ('quiz_questions', 'quiz_options')
    AND tc.constraint_type = 'FOREIGN KEY';
```

## Rollback

If you need to rollback this migration, you would need to:

1. Revert the enum type back to the old values
2. Remove the indexes
3. Update any data that was migrated

**Note**: Rollback is not recommended after data has been created with the new schema. Always test migrations in a development environment first.

## Requirements Satisfied

This migration satisfies the following requirements from the Quiz Editor System spec:

- **Requirement 9.1**: Update question_type enum to support 'single_choice', 'multiple_choice', 'open_ended'
- **Requirement 9.3**: Add indexes on quiz_id for quiz_questions table
- **Requirement 9.4**: Add indexes on question_id for quiz_options table
- **Requirement 9.5**: Maintain referential integrity with CASCADE delete for questions and options
