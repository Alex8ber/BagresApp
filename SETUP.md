# BagresApp - Configuración

## Configuración de Variables de Entorno

Para que la aplicación funcione correctamente, necesitas configurar las credenciales de Supabase:

### Paso 1: Crear archivo .env

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

### Paso 2: Obtener credenciales de Supabase

1. Ve a tu proyecto en Supabase: https://app.supabase.com
2. Navega a **Settings** → **API**
3. Copia los siguientes valores:
   - **Project URL** → `EXPO_PUBLIC_SUPABASE_URL`
   - **anon/public key** → `EXPO_PUBLIC_SUPABASE_ANON_KEY`

### Paso 3: Actualizar .env

Edita el archivo `.env` con tus credenciales reales:

```env
EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
```

### Paso 4: Reiniciar el servidor de desarrollo

Después de configurar las variables de entorno, reinicia el servidor:

```bash
# Detén el servidor actual (Ctrl+C)
# Limpia la caché
npx expo start -c
```

## Notas Importantes

- Las variables de entorno en Expo deben tener el prefijo `EXPO_PUBLIC_` para ser accesibles en el código
- El archivo `.env` está en `.gitignore` para proteger tus credenciales
- Nunca compartas tus credenciales de Supabase públicamente

## Solución Temporal (Solo para desarrollo)

Si solo quieres probar la UI sin backend, puedes dejar los valores por defecto. La app mostrará errores de conexión pero la interfaz funcionará.
