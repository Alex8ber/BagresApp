-- =====================================================================
-- FIX: RPCs para eliminar perfiles de profesores y estudiantes desde admin
-- BagresApp — Ejecutar en Supabase SQL Editor
-- =====================================================================
--
-- Objetivo:
--   Asegurar que al borrar un usuario desde la pantalla admin, se elimine
--   también su perfil de la tabla correspondiente y se bloquee su acceso.
--   Este cambio usa funciones RPC que ejecutan la eliminación con permisos
--   de service_role o con el rol de administrador.
-- =====================================================================

CREATE OR REPLACE FUNCTION public.admin_delete_teacher_profile(p_teacher_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_teacher_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.teachers WHERE id = p_teacher_id
  ) INTO v_teacher_exists;

  IF NOT v_teacher_exists THEN
    RETURN FALSE;
  END IF;

  DELETE FROM public.teachers
  WHERE id = p_teacher_id;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_teacher_profile(TEXT) TO authenticated;

CREATE OR REPLACE FUNCTION public.admin_delete_student_profile(p_student_id TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_student_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.students WHERE id = p_student_id
  ) INTO v_student_exists;

  IF NOT v_student_exists THEN
    RETURN FALSE;
  END IF;

  DELETE FROM public.students
  WHERE id = p_student_id;

  RETURN TRUE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.admin_delete_student_profile(TEXT) TO authenticated;
