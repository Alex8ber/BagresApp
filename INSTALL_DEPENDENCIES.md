# Instalar Dependencias Faltantes

Para que la funcionalidad de subir archivos funcione, necesitas instalar estos paquetes:

```bash
npx expo install expo-document-picker expo-image-picker
```

## ¿Qué hacen estos paquetes?

- **expo-document-picker**: Permite seleccionar documentos (PDFs, Word, Excel, etc.) desde el dispositivo
- **expo-image-picker**: Permite seleccionar imágenes y videos desde la galería o cámara

## Después de instalar

1. Reinicia el servidor de desarrollo (Ctrl+C y luego `npm start`)
2. Recarga la aplicación
3. Ahora podrás subir archivos desde el dispositivo

## Nota

Por ahora, los archivos se guardan como URIs locales. En producción, deberías:
1. Subir el archivo a Supabase Storage
2. Obtener la URL pública
3. Guardar esa URL en la base de datos

Esto lo implementaremos después si lo necesitas.
