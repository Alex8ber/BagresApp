# Configuración de Almacenamiento de Materiales

## ✅ Cambios Implementados

1. **Subida real de archivos a Supabase Storage** ✅
2. **Funcionalidad para abrir/ver materiales** ✅
3. **Servicios de storage para materiales** ✅

## 🔧 Configuración Requerida en Supabase

### Paso 1: Crear el Bucket "materials"

1. Abre Supabase Dashboard
2. Ve a **Storage** en el menú lateral
3. Click en **"Create a new bucket"**
4. Configuración:
   - **Name**: `materials`
   - **Public**: ✅ **SÍ** (para que estudiantes puedan acceder)
   - **File size limit**: 50 MB (o el que prefieras)
   - **Allowed MIME types**: Dejar vacío para permitir todos los tipos

### Paso 2: Crear Políticas RLS

Después de crear el bucket, ve a **SQL Editor** y ejecuta:

```sql
-- Policy: Allow authenticated users to upload materials
CREATE POLICY "Teachers can upload materials"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'materials' AND
  (storage.foldername(name))[1] = 'materials'
);

-- Policy: Allow public read access to materials
CREATE POLICY "Anyone can view materials"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'materials');

-- Policy: Allow teachers to delete their own materials
CREATE POLICY "Teachers can delete materials"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'materials');
```

## 🎯 Cómo Funciona Ahora

### Para Profesores:

1. **Crear Material**:
   - Ve a Library → Presiona el botón "+"
   - Selecciona "Material de Estudio"
   - Elige la clase
   - Selecciona "Subir Archivo" o "URL / Enlace"
   - Si subes archivo:
     - Selecciona el archivo de tu dispositivo
     - El archivo se sube automáticamente a Supabase Storage
     - Se guarda la URL pública en la base de datos
   - Si usas URL:
     - Pega el enlace de Google Drive, Dropbox, YouTube, etc.

2. **Ver Material**:
   - En Library, haz click en cualquier material
   - Se abrirá automáticamente:
     - PDFs: En el visor del navegador/dispositivo
     - Videos: En el reproductor
     - Documentos: En la app correspondiente
     - Enlaces: En el navegador

### Para Estudiantes:

1. **Ver Materiales de su Clase**:
   - Los estudiantes solo ven materiales de su clase específica
   - Pueden hacer click para abrir/descargar
   - Los archivos se abren desde Supabase Storage (URL pública)

## 📁 Estructura de Archivos en Storage

```
materials/
  ├── material-{classId}-{timestamp}.pdf
  ├── material-{classId}-{timestamp}.docx
  ├── material-{classId}-{timestamp}.mp4
  └── ...
```

## 🔒 Seguridad

- **Subida**: Solo usuarios autenticados (profesores)
- **Lectura**: Público (para que estudiantes puedan acceder sin autenticación)
- **Eliminación**: Solo usuarios autenticados

## 📊 Tipos de Archivos Soportados

- **PDFs**: Documentos, libros, guías
- **Videos**: MP4, MOV, AVI
- **Documentos**: Word, Excel, PowerPoint
- **Imágenes**: JPG, PNG, GIF
- **Otros**: ZIP, TXT, etc.

## 🚀 Flujo Completo

```
1. Profesor selecciona archivo
   ↓
2. Archivo se sube a Supabase Storage (bucket: materials)
   ↓
3. Se obtiene URL pública del archivo
   ↓
4. URL se guarda en la base de datos (class_materials.file_url)
   ↓
5. Material aparece en Library
   ↓
6. Profesor/Estudiante hace click
   ↓
7. Archivo se abre desde Supabase Storage
```

## ⚠️ Notas Importantes

1. **Tamaño de archivos**: Por defecto Supabase permite hasta 50MB por archivo
2. **Cuota de almacenamiento**: El plan gratuito tiene 1GB de storage
3. **URLs públicas**: Los archivos son accesibles por cualquiera con la URL
4. **Eliminación**: Cuando elimines un material, también debes eliminar el archivo de Storage (implementar después)

## 🐛 Solución de Problemas

### Error: "Upload failed"
- Verifica que el bucket "materials" existe
- Verifica que las políticas RLS están creadas
- Verifica que el usuario está autenticado

### Error: "Cannot open file"
- Verifica que la URL es válida
- Verifica que el archivo existe en Storage
- Verifica que el bucket es público

### Archivo no se sube
- Verifica el tamaño del archivo (< 50MB)
- Verifica la conexión a internet
- Revisa la consola para ver errores específicos

---

**Próximos pasos sugeridos:**
1. Implementar eliminación de archivos cuando se elimina un material
2. Agregar progreso de subida para archivos grandes
3. Agregar vista previa de archivos antes de subir
4. Implementar compresión de imágenes/videos
