-- Migration: Update Quiz Schema for Quiz Editor System
-- Date: 2024
-- Description: Updates question_type enum, adds indexes, and verifies CASCADE DELETE constraints

-- ============================================================================
-- STEP 1: Update question_type enum
-- ============================================================================

-- First, check if the old enum exists and create the new one
DO $$ 
BEGIN
    -- Create new enum type with updated values
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type_new') THEN
        CREATE TYPE question_type_new AS ENUM (
            'single_choice',
            'multiple_choice',
            'open_ended'
        );
    END IF;
END $$;

-- Add a temporary column with the new type
ALTER TABLE quiz_questions 
    ADD COLUMN question_type_new question_type_new;

-- Migrate existing data with mapping:
-- 'multiple_choice' -> 'multiple_choice' (stays the same)
-- 'true_false' -> 'single_choice' (true/false is a type of single choice)
-- 'short_answer' -> 'open_ended' (short answer is open-ended)
UPDATE quiz_questions
SET question_type_new = CASE 
    WHEN question_type::text = 'multiple_choice' THEN 'multiple_choice'::question_type_new
    WHEN question_type::text = 'true_false' THEN 'single_choice'::question_type_new
    WHEN question_type::text = 'short_answer' THEN 'open_ended'::question_type_new
    ELSE 'single_choice'::question_type_new  -- default fallback
END;

-- Drop the old column and rename the new one
ALTER TABLE quiz_questions DROP COLUMN question_type;
ALTER TABLE quiz_questions RENAME COLUMN question_type_new TO question_type;

-- Make the column NOT NULL
ALTER TABLE quiz_questions ALTER COLUMN question_type SET NOT NULL;

-- Drop the old enum type if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_type WHERE typname = 'question_type_enum') THEN
        DROP TYPE question_type_enum;
    END IF;
END $$;

-- Rename the new type to the standard name
ALTER TYPE question_type_new RENAME TO question_type_enum;

-- ============================================================================
-- STEP 2: Add performance indexes
-- ============================================================================

-- Index on quiz_questions for efficient quiz lookup and ordering
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id 
    ON quiz_questions(quiz_id);

CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id_order 
    ON quiz_questions(quiz_id, order_index);

-- Index on quiz_options for efficient question lookup and ordering
CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id 
    ON quiz_options(question_id);

CREATE INDEX IF NOT EXISTS idx_quiz_options_question_id_order 
    ON quiz_options(question_id, order_index);

-- ============================================================================
-- STEP 3: Verify and update CASCADE DELETE constraints
-- ============================================================================

-- Drop existing foreign key constraints if they exist
ALTER TABLE quiz_questions
    DROP CONSTRAINT IF EXISTS quiz_questions_quiz_id_fkey;

ALTER TABLE quiz_options
    DROP CONSTRAINT IF EXISTS quiz_options_question_id_fkey;

-- Add foreign key constraints with CASCADE DELETE
ALTER TABLE quiz_questions
    ADD CONSTRAINT quiz_questions_quiz_id_fkey
    FOREIGN KEY (quiz_id)
    REFERENCES quizzes(id)
    ON DELETE CASCADE;

ALTER TABLE quiz_options
    ADD CONSTRAINT quiz_options_question_id_fkey
    FOREIGN KEY (question_id)
    REFERENCES quiz_questions(id)
    ON DELETE CASCADE;

-- ============================================================================
-- VERIFICATION QUERIES (for manual testing)
-- ============================================================================

-- Verify the new enum values
-- SELECT enum_range(NULL::question_type_enum);

-- Verify indexes exist
-- SELECT indexname, indexdef 
-- FROM pg_indexes 
-- WHERE tablename IN ('quiz_questions', 'quiz_options')
-- ORDER BY tablename, indexname;

-- Verify CASCADE DELETE constraints
-- SELECT
--     tc.table_name, 
--     tc.constraint_name, 
--     tc.constraint_type,
--     kcu.column_name,
--     ccu.table_name AS foreign_table_name,
--     ccu.column_name AS foreign_column_name,
--     rc.delete_rule
-- FROM information_schema.table_constraints AS tc 
-- JOIN information_schema.key_column_usage AS kcu
--     ON tc.constraint_name = kcu.constraint_name
--     AND tc.table_schema = kcu.table_schema
-- JOIN information_schema.constraint_column_usage AS ccu
--     ON ccu.constraint_name = tc.constraint_name
--     AND ccu.table_schema = tc.table_schema
-- LEFT JOIN information_schema.referential_constraints AS rc
--     ON tc.constraint_name = rc.constraint_name
-- WHERE tc.table_name IN ('quiz_questions', 'quiz_options')
--     AND tc.constraint_type = 'FOREIGN KEY';
