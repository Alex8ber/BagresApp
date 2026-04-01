# Sistema de Subida de Contenido a Biblioteca

## ✅ Implementación Completada

Se ha implementado el sistema completo para que los profesores puedan subir contenido (materiales y cuestionarios) a clases específicas.

## 🎯 Flujo Completo

### 1. Profesor va a la pestaña "Library"
- Ve todos sus materiales y cuestionarios organizados por clase
- Cada clase muestra su icono/imagen y nombre

### 2. Presiona el botón "+" (FAB flotante)
- Se abre un modal preguntando: "¿Qué deseas agregar?"
- Opciones:
  - 📚 Material de Estudio (PDF, videos, documentos, enlaces)
  - 📝 Cuestionario (Evaluaciones y pruebas)

### 3. Selecciona el tipo de contenido
- Se abre otro modal: "Selecciona la clase"
- Muestra todas las clases del profesor con:
  - Icono/imagen de la clase
  - Nombre de la clase
  - Materia y grado

### 4. Selecciona la clase específica
- Navega a la pantalla correspondiente:
  - **Material**: `TeacherCreateMaterialScreen`
  - **Cuestionario**: `TeacherCreateQuizScreen`

### 5. Llena el formulario
- La clase seleccionada se muestra en la parte superior
- Completa los campos requeridos
- Presiona "Crear Material" o "Crear Cuestionario"

### 6. Contenido guardado
- Se guarda en la base de datos vinculado a la clase específica
- Regresa automáticamente a la pantalla de Library
- El nuevo contenido aparece en la sección de la clase correspondiente

## 📁 Archivos Creados

### 1. `src/screens/teacher/TeacherCreateMaterialScreen.tsx`
Pantalla para crear materiales educativos:
- **Campos**:
  - Título (requerido)
  - Descripción (opcional)
  - Tipo de material (PDF, Video, Documento, Enlace, Imagen)
  - URL del archivo (requerido)
- **Características**:
  - Selector visual de tipo de material con iconos
  - Validación de campos
  - Muestra la clase seleccionada
  - Guarda en la base de datos

### 2. `src/screens/teacher/TeacherCreateQuizScreen.tsx`
Pantalla para crear cuestionarios:
- **Campos**:
  - Título (requerido)
  - Descripción (opcional)
  - Duración en minutos (requerido)
  - Calificación mínima para aprobar (requerido, 0-100%)
- **Características**:
  - Se crea como borrador (no publicado)
  - Validación de campos numéricos
  - Muestra la clase seleccionada
  - Guarda en la base de datos

## 📝 Archivos Modificados

### 1. `src/screens/teacher/TeacherLibraryScreen.tsx`
- ✅ Agregado botón FAB funcional
- ✅ Modal de selección de tipo de contenido
- ✅ Modal de selección de clase
- ✅ Navegación a pantallas de creación
- ✅ Validación de que existan clases antes de agregar contenido

### 2. `src/types/navigation.ts`
- ✅ Agregados tipos para las nuevas pantallas:
  - `TeacherCreateMaterial: { classId: string; className: string }`
  - `TeacherCreateQuiz: { classId: string; className: string }`

### 3. `src/navigation/RootNavigator.tsx`
- ✅ Agregadas las nuevas pantallas al stack de navegación
- ✅ Configurados headers con colores del tema de profesor

## 🎨 Características de UI/UX

### Modales
- Fondo semi-transparente
- Animación fade
- Se cierran al tocar fuera
- Botón "Cancelar" en la parte inferior

### Selector de Tipo de Material
- Grid de 5 opciones con iconos grandes
- Cada tipo tiene su color distintivo:
  - PDF: Rojo (#E53935)
  - Video: Azul (#1E88E5)
  - Documento: Verde (#43A047)
  - Enlace: Naranja (#FB8C00)
  - Imagen: Morado (#8E24AA)
- Borde resaltado cuando está seleccionado

### Selector de Clase
- Lista scrolleable de clases
- Muestra icono/imagen de cada clase
- Muestra nombre, materia y grado
- Flecha indicadora a la derecha

### Formularios
- Campos con validación en tiempo real
- Mensajes de error claros en español
- Botones grandes y accesibles
- Información de la clase seleccionada siempre visible
- Textos de ayuda (💡 hints)

## 🔄 Integración con Base de Datos

### Materiales
```typescript
await createMaterial({
  class_id: classId,
  title: "Título del material",
  description: "Descripción opcional",
  material_type: "pdf", // pdf, video, document, link, image
  file_url: "https://...",
  available_from: null, // Fecha de disponibilidad (opcional)
  available_until: null, // Fecha de expiración (opcional)
});
```

### Cuestionarios
```typescript
await createQuiz({
  class_id: classId,
  title: "Título del cuestionario",
  description: "Descripción opcional",
  duration_minutes: 30,
  passing_score: 70,
  available_from: null, // Fecha de disponibilidad (opcional)
  available_until: null, // Fecha de expiración (opcional)
  is_published: false, // Siempre se crea como borrador
});
```

## ✨ Validaciones Implementadas

### Material
- ✅ Título es requerido
- ✅ URL es requerida
- ✅ Tipo de material debe ser seleccionado
- ✅ Descripción es opcional

### Cuestionario
- ✅ Título es requerido
- ✅ Duración debe ser mayor a 0
- ✅ Calificación debe estar entre 0 y 100
- ✅ Descripción es opcional

## 🚀 Próximos Pasos Sugeridos

1. **Agregar selector de fechas** para `available_from` y `available_until`
2. **Implementar subida de archivos** en lugar de solo URLs
3. **Agregar pantalla de edición** de materiales y cuestionarios
4. **Implementar creación de preguntas** para los cuestionarios
5. **Agregar vista previa** del material antes de guardarlo
6. **Implementar búsqueda y filtros** en la biblioteca

## 📊 Organización del Contenido

El contenido se organiza automáticamente por clase:
- Cada clase tiene su propia sección
- Los materiales y cuestionarios se agrupan por clase
- El contador muestra cuántos items hay por clase
- Los estudiantes solo verán el contenido de su clase específica

## 🎓 Experiencia del Estudiante

Cuando un estudiante se une a una clase:
1. Solo ve los materiales de su clase
2. Solo ve los cuestionarios de su clase
3. No puede ver contenido de otras clases
4. El contenido está filtrado automáticamente por `class_id`

---

**Nota**: El sistema está completamente funcional. Los profesores pueden ahora subir contenido específico para cada una de sus clases, manteniendo todo organizado y separado por materia.
