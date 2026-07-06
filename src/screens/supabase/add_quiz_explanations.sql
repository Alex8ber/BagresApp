-- =====================================================================
-- MIGRACIÓN: Agregar explicaciones a las preguntas de los quizzes
-- BagresApp — Ejecutar en Supabase SQL Editor
-- =====================================================================
--
-- DESCRIPCIÓN:
--   Agrega la columna `explanation` a la tabla `quiz_questions`.
--   Esto permitirá a los profesores agregar retroalimentación detallada
--   o explicaciones de cómo resolver una pregunta, la cual los estudiantes
--   podrán ver al finalizar el quiz.
--
-- =====================================================================

ALTER TABLE public.quiz_questions
  ADD COLUMN IF NOT EXISTS explanation TEXT;
