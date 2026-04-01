# Quiz Editor System - Database Migration Guide

## Overview

This guide explains the database schema updates required for the Quiz Editor System and how to apply them.

## What Changed

### 1. Question Type Enum Update

**Before:**
```typescript
question_type: 'multiple_choice' | 'true_false' | 'short_answer'
```

**After:**
```typescript
question_type: 'single_choice' | 'multiple_choice' | 'open_ended'
```

**Data Migration Mapping:**
- `multiple_choice` → `multiple_choice` (unchanged)
- `true_false` → `single_choice` (true/false is a single choice question)
- `short_answer` → `open_ended` (short answer is open-ended)

### 2. Performance Indexes Added

Four new indexes were added to improve query performance:

**quiz_questions table:**
- `idx_quiz_questions_quiz_id` - Fast lookup of all questions for a quiz
- `idx_quiz_questions_quiz_id_order` - Fast ordered retrieval of questions

**quiz_options table:**
- `idx_quiz_options_question_id` - Fast lookup of all options for a question
- `idx_quiz_options_question_id_order` - Fast ordered retrieval of options

### 3. CASCADE DELETE Constraints

Ensured proper referential integrity with CASCADE DELETE:

- When a quiz is deleted → all its questions are automatically deleted
- When a question is deleted → all its options are automatically deleted

## Files Created

```
migrations/
├── 001_update_quiz_schema.sql    # Main migration SQL script
├── verify_migration.sql          # Verification queries
├── apply_migration.ts            # Helper script (informational)
└── README.md                     # Migration documentation

MIGRATION_GUIDE.md                # This file
```

## How to Apply the Migration

### Option 1: Supabase Dashboard (Recommended)

1. **Open Supabase Dashboard**
   - Go to https://app.supabase.com
   - Select your project

2. **Navigate to SQL Editor**
   - Click on "SQL Editor" in the left sidebar
   - Click "New query"

3. **Copy and Execute Migration**
   - Open `migrations/001_update_quiz_schema.sql`
   - Copy the entire contents
   - Paste into the SQL Editor
   - Click "Run" or press Ctrl+Enter

4. **Verify Success**
   - You should see "Success. No rows returned"
   - Run the verification queries (see below)

### Option 2: Supabase CLI

If you have the Supabase CLI installed:

```bash
# Initialize Supabase in your project (if not already done)
supabase init

# Link to your remote project
supabase link --project-ref your-project-ref

# Apply the migration
supabase db push
```

### Option 3: Direct PostgreSQL Connection

If you have direct database access:

```bash
# Using psql
psql $DATABASE_URL -f migrations/001_update_quiz_schema.sql

# Or using the connection string from Supabase settings
psql "postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].supabase.co:5432/postgres" \
  -f migrations/001_update_quiz_schema.sql
```

## Verification

After applying the migration, verify it was successful:

### Quick Verification (Supabase Dashboard)

Run this query in the SQL Editor:

```sql
-- Check enum values
SELECT enum_range(NULL::question_type_enum);

-- Check indexes
SELECT indexname FROM pg_indexes 
WHERE tablename IN ('quiz_questions', 'quiz_options')
AND indexname LIKE 'idx_%';

-- Check CASCADE constraints
SELECT tc.table_name, tc.constraint_name, rc.delete_rule
FROM information_schema.table_constraints tc
JOIN information_schema.referential_constraints rc 
  ON tc.constraint_name = rc.constraint_name
WHERE tc.table_name IN ('quiz_questions', 'quiz_options')
AND tc.constraint_type = 'FOREIGN KEY';
```

### Comprehensive Verification

Run the verification script:

```bash
psql $DATABASE_URL -f migrations/verify_migration.sql
```

Expected output:
- ✓ Enum values: `{single_choice,multiple_choice,open_ended}`
- ✓ 4 indexes created (2 on quiz_questions, 2 on quiz_options)
- ✓ 2 CASCADE DELETE constraints

## TypeScript Types Updated

The TypeScript types in `src/types/database.ts` have been updated to match the new schema:

```typescript
export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'open_ended';  // ← Updated
  points: number;
  order_index: number;
  created_at: string;
  updated_at: string;
}
```

## Impact on Existing Data

### If you have existing quiz data:

The migration includes automatic data conversion:
- Existing `true_false` questions → converted to `single_choice`
- Existing `short_answer` questions → converted to `open_ended`
- Existing `multiple_choice` questions → remain as `multiple_choice`

### If you have NO existing quiz data:

The migration will simply update the schema with no data changes.

## Rollback (Emergency Only)

If you need to rollback (not recommended after data is created):

```sql
-- This is a destructive operation - backup your data first!

-- Revert enum type
ALTER TYPE question_type_enum RENAME TO question_type_enum_old;
CREATE TYPE question_type_enum AS ENUM ('multiple_choice', 'true_false', 'short_answer');
ALTER TABLE quiz_questions ALTER COLUMN question_type TYPE question_type_enum 
  USING question_type::text::question_type_enum;
DROP TYPE question_type_enum_old;

-- Remove indexes
DROP INDEX IF EXISTS idx_quiz_questions_quiz_id;
DROP INDEX IF EXISTS idx_quiz_questions_quiz_id_order;
DROP INDEX IF EXISTS idx_quiz_options_question_id;
DROP INDEX IF EXISTS idx_quiz_options_question_id_order;
```

## Troubleshooting

### Error: "type question_type_enum already exists"

The migration is idempotent and checks for existing types. If you see this error, the enum might already be partially updated. Check the current enum values:

```sql
SELECT enum_range(NULL::question_type_enum);
```

### Error: "permission denied"

You need admin/service role privileges to modify the schema. Use the service role key or contact your database administrator.

### Error: "relation quiz_questions does not exist"

The quiz tables haven't been created yet. You may need to run the initial schema creation first.

## Requirements Satisfied

This migration satisfies Task 1 requirements:

- ✅ **Requirement 9.1**: Update question_type enum to support 'single_choice', 'multiple_choice', 'open_ended'
- ✅ **Requirement 9.3**: Add indexes on quiz_questions(quiz_id, order_index)
- ✅ **Requirement 9.4**: Add indexes on quiz_options(question_id, order_index)
- ✅ **Requirement 9.5**: Verify CASCADE DELETE constraints on quiz_questions and quiz_options tables

## Next Steps

After successfully applying this migration:

1. ✅ Verify the migration using the verification script
2. ⏭️ Proceed to Task 2: Extend quiz service layer with new functions
3. ⏭️ Continue with the remaining implementation tasks

## Support

If you encounter issues:

1. Check the Supabase dashboard logs
2. Review the verification output
3. Ensure you have proper database permissions
4. Check that the quiz tables exist in your database

For more information, see:
- `migrations/README.md` - Detailed migration documentation
- `.kiro/specs/quiz-editor-system/requirements.md` - Full requirements
- `.kiro/specs/quiz-editor-system/design.md` - Design specifications
