# Sistema de Cuestionarios - Guía de Configuración

## Estado Actual
✅ Sistema completamente implementado y funcionando
✅ 418 tests pasando
✅ Base de datos configurada correctamente
✅ Sistema de acceso por código de clase para estudiantes implementado

## Componentes Implementados

### Pantallas
- **QuizEditorScreen** - Editor de preguntas con debouncing para mejor rendimiento
- **QuizDetailScreen** - Vista detallada con publicar/despublicar y eliminar
- **StudentQuizInterface** - Interfaz para estudiantes con timer y auto-submit

### Componentes Compartidos
- **QuestionCard** - Tarjeta de pregunta con soporte para 3 tipos
- **QuestionTypeSelector** - Selector de tipo de pregunta
- **DeadlineManager** - Gestor de fechas límite

### Servicios
- **quizzes.ts** - CRUD completo de quizzes, preguntas y opciones
- **autoSubmit.ts** - Servicio de auto-envío cuando expira el tiempo

## Tipos de Pregunta Soportados

1. **Selección Simple (single_choice)** - Una sola respuesta correcta
2. **Selección Múltiple (multiple_choice)** - Múltiples respuestas correctas
3. **Respuesta Abierta (open_ended)** - Texto libre

## Configuración de Base de Datos

### Si necesitas aplicar la migración:

Ejecuta este script en Supabase SQL Editor:

```sql
-- Crear enum correcto
DROP TYPE IF EXISTS question_type_new CASCADE;
DROP TYPE IF EXISTS question_type_enum CASCADE;

CREATE TYPE question_type_enum AS ENUM (
    'single_choice',
    'multiple_choice',
    'open_ended'
);

-- Actualizar columna
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'quiz_questions' 
        AND column_name = 'question_type'
    ) THEN
        ALTER TABLE quiz_questions DROP COLUMN question_type;
    END IF;
    
    ALTER TABLE quiz_questions 
        ADD COLUMN question_type question_type_enum NOT NULL DEFAULT 'single_choice';
END $$;
```

## Características Implementadas

### Editor de Preguntas
- ✅ Agregar/eliminar preguntas
- ✅ Reordenar preguntas (flechas arriba/abajo)
- ✅ Editar texto de pregunta (con debouncing)
- ✅ Cambiar tipo de pregunta
- ✅ Editar puntos
- ✅ Agregar/eliminar opciones
- ✅ Marcar respuestas correctas
- ✅ Validación completa
- ✅ Guardado automático en tiempo real

### Vista Detallada
- ✅ Publicar/despublicar quiz
- ✅ Editar configuración (título, duración, fechas)
- ✅ Eliminar quiz
- ✅ Ver preguntas en modo lectura

### Interfaz de Estudiante
- ✅ Timer con cuenta regresiva
- ✅ Auto-submit cuando expira el tiempo
- ✅ Navegación entre preguntas
- ✅ Renderizado según tipo de pregunta
- ✅ Validación de disponibilidad

## Optimizaciones Aplicadas

### Debouncing
El editor usa debouncing (500ms) para evitar lag al escribir:
- Actualización inmediata de UI
- Guardado retrasado a base de datos
- Timers independientes por campo

### Performance
- Índices en base de datos para queries rápidas
- CASCADE DELETE para integridad referencial
- useReducer para manejo eficiente de estado

## Testing

Ejecutar tests:
```bash
npm test
```

Resultados actuales: 418 tests pasando en 17 suites

## Problemas Resueltos

1. ✅ Error de constraint en question_type - Aplicado fix-question-type-simple.sql
2. ✅ Teclado lento al escribir - Implementado debouncing
3. ✅ SafeAreaView deprecated - Migrado a react-native-safe-area-context
4. ✅ Imports innecesarios - Limpiados
5. ✅ Console.log en producción - Eliminados
6. ✅ Registro de estudiantes - Cambiado a sistema de código de clase

## Sistema de Acceso para Estudiantes

### Flujo de Acceso (Login/Register Automático)
1. Estudiante ingresa su nombre completo
2. Estudiante ingresa el código de clase de 6 caracteres (proporcionado por el profesor)
3. Sistema valida el código contra la base de datos
4. **Sistema verifica si el estudiante ya existe en esa clase:**
   - **Si existe:** Carga el perfil existente (LOGIN) - "¡Bienvenido de nuevo!"
   - **Si no existe:** Crea nuevo perfil (REGISTER) - "¡Te has unido a la clase!"
5. Estudiante accede al dashboard con su perfil

### Características
- ✅ **NO requiere email ni contraseña** para estudiantes
- ✅ **Nombres únicos por clase** (case-insensitive: Ramses = ramses = RAMSES)
- ✅ **Login automático** si el estudiante ya existe
- ✅ **Registro automático** si es la primera vez
- ✅ IDs únicos generados por la aplicación (ej: `student_1234567890_abc123`)
- ✅ Sin cuentas de Supabase Auth para estudiantes
- ✅ Navegación basada en rol, no en usuario autenticado
- ✅ Similar a Google Classroom: un nombre = un estudiante por clase

### Ejemplo de Uso
```
Clase: Matemáticas 5to (Código: ABC123)

Primera vez:
- Estudiante: "Ramses" + "ABC123" → Crea perfil nuevo ✅

Segunda vez (mismo estudiante):
- Estudiante: "Ramses" + "ABC123" → Carga perfil existente ✅
- Estudiante: "ramses" + "ABC123" → Carga perfil existente ✅ (case-insensitive)
- Estudiante: "RAMSES" + "ABC123" → Carga perfil existente ✅ (case-insensitive)

Otro estudiante:
- Estudiante: "María" + "ABC123" → Crea perfil nuevo ✅
```

### Migraciones Requeridas

**IMPORTANTE:** Debes ejecutar estas migraciones en Supabase para que el login de estudiantes funcione:

1. **Permitir lectura anónima de clases** (para verificar códigos)
2. **Permitir IDs personalizados** (estudiantes no usan UUIDs de auth)
3. **Políticas RLS** (permitir inserción anónima de estudiantes)

Ver instrucciones completas en: `migrations/STUDENT_LOGIN_SETUP.md`

### Funciones Implementadas
- `joinClassWithCode()` - Valida código y crea perfil de estudiante (SIN auth)
- Actualizado `AuthContext` para manejar estudiantes sin objeto `user`
- Actualizado `RootNavigator` para usar `role` en lugar de `user`
- Actualizado `StudentLoginScreen` con UI de código de clase

## Próximos Pasos (Opcional)

- Implementar calificación automática
- Dashboard de resultados para profesores
- Exportar resultados a PDF/Excel
- Estadísticas por pregunta
- Banco de preguntas reutilizables

## Notas Importantes

- Todos los cambios se guardan automáticamente en tiempo real
- El botón "Guardar y Volver" valida y permite guardar con errores si es necesario
- Los estudiantes solo ven quizzes publicados y dentro del rango de fechas
- El timer se muestra solo si el quiz tiene duración configurada
