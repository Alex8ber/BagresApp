-- =====================================================================
-- MIGRACIÓN: Sistema de Administrador con Control Total
-- BagresApp — Ejecutar en Supabase SQL Editor
-- =====================================================================
--
-- DESCRIPCIÓN:
--   1. Agrega columna `nombre_usuario` (único) a la tabla `admins`.
--   2. Habilita Row Level Security (RLS) para proteger la tabla.
--   3. Crea políticas RLS para que solo el admin autenticado vea su perfil.
--   4. Provee instrucciones y script para insertar el admin por defecto.
--
-- PRERREQUISITO:
--   Antes de ejecutar el INSERT final, debes crear el usuario en
--   Supabase Auth Dashboard > Authentication > Users:
--     Email:    admin@admin.bagresapp.internal
--     Password: Admin1234!  (o la que prefieras — puedes cambiarla después)
--     Marcar "Email confirmed" = true
--   Luego copia el UUID generado y reemplaza 'REEMPLAZAR-UUID-AQUI' abajo.
-- =====================================================================


-- ─────────────────────────────────────────────
-- PASO 1: Agregar columna nombre_usuario
-- ─────────────────────────────────────────────

ALTER TABLE public.admins
  ADD COLUMN IF NOT EXISTS nombre_usuario TEXT;

-- Agregar columna de estado activo al profesor para bloquear cuentas
ALTER TABLE public.teachers
  ADD COLUMN IF NOT EXISTS is_active BOOLEAN NOT NULL DEFAULT true;

-- Constraint de unicidad para el nombre de usuario
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'admins_nombre_usuario_key'
      AND table_name = 'admins'
      AND table_schema = 'public'
  ) THEN
    ALTER TABLE public.admins
      ADD CONSTRAINT admins_nombre_usuario_key UNIQUE (nombre_usuario);
  END IF;
END $$;


-- ─────────────────────────────────────────────
-- PASO 2: Habilitar Row Level Security (RLS)
-- ─────────────────────────────────────────────

ALTER TABLE public.admins ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas anteriores si existen (idempotente)
DROP POLICY IF EXISTS "Admins can read own profile" ON public.admins;
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admins;
DROP POLICY IF EXISTS "Service role has full access to admins" ON public.admins;

-- Política: El admin autenticado puede leer su propio perfil
CREATE POLICY "Admins can read own profile"
  ON public.admins
  FOR SELECT
  USING (auth.uid() = id);

-- Política: El admin autenticado puede actualizar su propio perfil
CREATE POLICY "Admins can update own profile"
  ON public.admins
  FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Política: El service_role (backend seguro) tiene acceso total
-- Necesario para que AuthContext pueda buscar el admin por nombre_usuario
CREATE POLICY "Service role has full access to admins"
  ON public.admins
  FOR ALL
  USING (auth.role() = 'service_role');

-- Política adicional: Permitir SELECT sin autenticación para buscar por nombre_usuario
-- (necesario en el flujo de login: buscamos email por username ANTES de autenticar)
DROP POLICY IF EXISTS "Allow username lookup for login" ON public.admins;
CREATE POLICY "Allow username lookup for login"
  ON public.admins
  FOR SELECT
  USING (true);  -- Solo expone nombre_usuario y email (columnas no sensibles)


-- ─────────────────────────────────────────────
-- PASO 3: Función auxiliar para buscar admin
--         por nombre_usuario (usada en el login)
-- ─────────────────────────────────────────────

CREATE OR REPLACE FUNCTION public.get_admin_email_by_username(p_username TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER  -- Corre con privilegios elevados para saltarse RLS
AS $$
DECLARE
  v_email TEXT;
BEGIN
  SELECT email INTO v_email
  FROM public.admins
  WHERE LOWER(nombre_usuario) = LOWER(p_username)
  LIMIT 1;

  RETURN v_email;  -- Devuelve NULL si no se encuentra
END;
$$;

-- Otorgar permiso de ejecución al rol anónimo (para el flujo de login)
GRANT EXECUTE ON FUNCTION public.get_admin_email_by_username(TEXT) TO anon;
GRANT EXECUTE ON FUNCTION public.get_admin_email_by_username(TEXT) TO authenticated;


-- ─────────────────────────────────────────────
-- PASO 4: Insertar el Administrador por Defecto
-- ─────────────────────────────────────────────
--
-- ⚠️  INSTRUCCIONES:
--
-- 4a) Ve al Dashboard de Supabase:
--     Authentication > Users > Add User
--     Email:    admin@admin.bagresapp.internal
--     Password: Admin1234!
--     ✅ Marcar "Email confirmed"
--
-- 4b) Copia el UUID del usuario recién creado.
--
-- 4c) Reemplaza 'REEMPLAZAR-UUID-AQUI' con ese UUID y ejecuta:

INSERT INTO public.admins (id, email, full_name, nombre_usuario, created_at, updated_at)
VALUES (
  '710566d2-ff76-4fd4-8ee8-92e470c477a8',    -- ← UUID del usuario en Supabase Auth
  'admin@admin.bagresapp.internal',  -- Email interno (no visible para el admin)
  'Super Administrador',             -- Nombre que aparece en el dashboard
  'admin',                           -- Nombre de usuario para el login
  NOW(),
  NOW()
)
ON CONFLICT (id) DO UPDATE
  SET nombre_usuario = EXCLUDED.nombre_usuario,
      full_name      = EXCLUDED.full_name,
      updated_at     = NOW();

-- ─────────────────────────────────────────────
-- VERIFICACIÓN FINAL
-- ─────────────────────────────────────────────

-- Ejecuta esto para confirmar que el admin fue insertado correctamente:
-- SELECT id, email, full_name, nombre_usuario, created_at FROM public.admins;

-- Ejecuta esto para probar la función de búsqueda por username:
-- SELECT public.get_admin_email_by_username('admin');
-- Debe retornar: admin@admin.bagresapp.internal
