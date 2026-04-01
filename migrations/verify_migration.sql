-- Verification Script for Migration 001_update_quiz_schema.sql
-- Run this script after applying the migration to verify all changes were applied correctly

\echo '========================================='
\echo 'Quiz Schema Migration Verification'
\echo '========================================='
\echo ''

-- ============================================================================
-- 1. Verify question_type enum values
-- ============================================================================
\echo '1. Checking question_type enum values...'
SELECT enum_range(NULL::question_type_enum) AS question_type_values;
\echo 'Expected: {single_choice,multiple_choice,open_ended}'
\echo ''

-- ============================================================================
-- 2. Verify indexes on quiz_questions table
-- ============================================================================
\echo '2. Checking indexes on quiz_questions table...'
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'quiz_questions'
    AND indexname LIKE 'idx_%'
ORDER BY indexname;
\echo 'Expected indexes:'
\echo '  - idx_quiz_questions_quiz_id'
\echo '  - idx_quiz_questions_quiz_id_order'
\echo ''

-- ============================================================================
-- 3. Verify indexes on quiz_options table
-- ============================================================================
\echo '3. Checking indexes on quiz_options table...'
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'quiz_options'
    AND indexname LIKE 'idx_%'
ORDER BY indexname;
\echo 'Expected indexes:'
\echo '  - idx_quiz_options_question_id'
\echo '  - idx_quiz_options_question_id_order'
\echo ''

-- ============================================================================
-- 4. Verify CASCADE DELETE constraints
-- ============================================================================
\echo '4. Checking CASCADE DELETE constraints...'
SELECT
    tc.table_name, 
    tc.constraint_name,
    kcu.column_name,
    ccu.table_name AS references_table,
    ccu.column_name AS references_column,
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
    AND tc.constraint_type = 'FOREIGN KEY'
ORDER BY tc.table_name;
\echo 'Expected:'
\echo '  - quiz_questions.quiz_id -> quizzes.id (CASCADE)'
\echo '  - quiz_options.question_id -> quiz_questions.id (CASCADE)'
\echo ''

-- ============================================================================
-- 5. Check for any existing data with old question types
-- ============================================================================
\echo '5. Checking for data integrity...'
SELECT 
    COUNT(*) as total_questions,
    question_type,
    COUNT(*) * 100.0 / SUM(COUNT(*)) OVER () as percentage
FROM quiz_questions
GROUP BY question_type
ORDER BY question_type;
\echo 'All question_type values should be one of: single_choice, multiple_choice, open_ended'
\echo ''

-- ============================================================================
-- 6. Summary
-- ============================================================================
\echo '========================================='
\echo 'Verification Complete'
\echo '========================================='
\echo ''
\echo 'Review the output above to ensure:'
\echo '  ✓ Enum has correct values (single_choice, multiple_choice, open_ended)'
\echo '  ✓ All 4 indexes are created'
\echo '  ✓ Both foreign keys have CASCADE delete rule'
\echo '  ✓ All existing questions have valid question_type values'
\echo ''
