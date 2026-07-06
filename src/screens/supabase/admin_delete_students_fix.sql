-- =====================================================================
-- FIX: Políticas RLS para que el Admin pueda eliminar Estudiantes y Profesores
-- BagresApp — Ejecutar en Supabase SQL Editor
-- =====================================================================
--
-- PROBLEMA:
--   El admin no puede borrar estudiantes porque la tabla `students`
--   tiene RLS habilitado sin políticas de DELETE para el rol admin.
--   Lo mismo aplica para la tabla `teachers`.
--
-- SOLUCIÓN:
--   Crear una función auxiliar `is_admin()` que verifica si el usuario
--   autenticado es un administrador (existe en public.admins).
--   Luego agregar políticas RLS de DELETE (y demás operaciones CRUD)
--   sobre `students` y `teachers` usando esa función.
-- =====================================================================


-- ─────────────────────────────────────────────────────────────────────
-- PASO 1: Función auxiliar is_admin()
--   Devuelve TRUE si auth.uid() existe en public.admins
-- ─────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.admins WHERE id = auth.uid()
  );
$$;

-- Dar acceso de ejecución a usuarios autenticados
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;


-- ─────────────────────────────────────────────────────────────────────
-- PASO 2: Políticas RLS en la tabla `students`
-- ─────────────────────────────────────────────────────────────────────

-- Limpiar políticas anteriores relacionadas con admin si existen
DROP POLICY IF EXISTS "Admin can select all students"   ON public.students;
DROP POLICY IF EXISTS "Admin can update all students"   ON public.students;
DROP POLICY IF EXISTS "Admin can delete all students"   ON public.students;

-- El admin puede VER todos los estudiantes
CREATE POLICY "Admin can select all students"
  ON public.students
  FOR SELECT
  USING ( public.is_admin() );

-- El admin puede ACTUALIZAR cualquier estudiante (reasignar clases, etc.)
CREATE POLICY "Admin can update all students"
  ON public.students
  FOR UPDATE
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- El admin puede ELIMINAR cualquier estudiante  ← FIX PRINCIPAL
CREATE POLICY "Admin can delete all students"
  ON public.students
  FOR DELETE
  USING ( public.is_admin() );


-- ─────────────────────────────────────────────────────────────────────
-- PASO 3: Políticas RLS en la tabla `teachers`
--   (por si el deleteTeacher también falla por el mismo motivo)
-- ─────────────────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Admin can select all teachers"   ON public.teachers;
DROP POLICY IF EXISTS "Admin can update all teachers"   ON public.teachers;
DROP POLICY IF EXISTS "Admin can delete all teachers"   ON public.teachers;

-- El admin puede VER todos los profesores
CREATE POLICY "Admin can select all teachers"
  ON public.teachers
  FOR SELECT
  USING ( public.is_admin() );

-- El admin puede ACTUALIZAR cualquier profesor (verificar, activar/desactivar)
CREATE POLICY "Admin can update all teachers"
  ON public.teachers
  FOR UPDATE
  USING ( public.is_admin() )
  WITH CHECK ( public.is_admin() );

-- El admin puede ELIMINAR cualquier profesor
CREATE POLICY "Admin can delete all teachers"
  ON public.teachers
  FOR DELETE
  USING ( public.is_admin() );


-- ─────────────────────────────────────────────────────────────────────
-- VERIFICACIÓN
-- ─────────────────────────────────────────────────────────────────────
-- Ejecuta esto mientras estás logueado como admin para confirmar:
--
--   SELECT public.is_admin();
--   → Debe retornar: true
--
-- Luego intenta eliminar un estudiante de prueba desde la app.
-- =====================================================================
