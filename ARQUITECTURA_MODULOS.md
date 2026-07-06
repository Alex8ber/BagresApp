# BagresApp — Documentación de Arquitectura y Módulos

## Proceso de Construcción

BagresApp es una plataforma educativa mobile construida con **React Native + Expo** y **Supabase** como backend. El desarrollo siguió una arquitectura modular vertical: cada rol (estudiante, profesor, admin) tiene su propia capa de pantallas, mientras que la capa de servicios y contextos es transversal y compartida.

El ciclo de construcción fue:
1. Definición del esquema de base de datos en Supabase (PostgreSQL).
2. Tipado completo en TypeScript (`src/types/`).
3. Capa de servicios de acceso a datos (`src/services/`).
4. Estado global con Context API (`src/context/`).
5. Navegación centralizada basada en roles (`src/navigation/`).
6. Pantallas por módulo (`src/screens/auth`, `teacher`, `student`, `admin`).
7. Componentes reutilizables y hooks personalizados.
8. Tests con Jest (+400 casos).

---

## Stack Tecnológico Principal

| Categoría        | Tecnología                              |
|------------------|-----------------------------------------|
| Framework mobile | React Native 0.83.6 + Expo SDK 55       |
| Lenguaje         | TypeScript 5.9                          |
| Backend/DB/Auth  | Supabase (PostgreSQL + Auth)            |
| Navegación       | React Navigation v7 (Stack + BottomTabs)|
| Estado global    | React Context API + custom hooks        |
| Persistencia     | AsyncStorage (sesión de estudiantes)    |
| UI icons         | @expo/vector-icons                      |
| Testing          | Jest 29 + React Native Testing Library  |
| Linter/Formato   | ESLint + Prettier                       |

---

## Módulos del Sistema

---

### MÓDULO 1 — Tipos y Contratos (`src/types/`)

**Propósito:** Define las interfaces y tipos de TypeScript que representan las entidades del sistema. Es la fuente de verdad para toda la app.

**Archivos:**
- `database.ts` — Tipos espejo de la BD (snake_case): `Teacher`, `Student`, `Admin`, `Class`, `Quiz`, `QuizQuestion`, `QuizOption`, `QuizSubmission`, `ClassMaterial`, `Database` (schema completo).
- `models.ts` — Modelos de dominio (camelCase): `BaseUser`, `Teacher`, `Student`, `Admin`, `Class`, `Test`, `TestSubmission`.
- `navigation.ts` — Tipos de rutas de navegación (`RootStackParamList`).
- `errors.ts` — Clases de error personalizadas: `AuthenticationError`, `DatabaseError`, `NetworkError`.
- `forms.ts` — Tipos para validación de formularios.

**Integración con otros módulos:**
- Todos los módulos importan desde aquí.
- `services/` usa tipos de `database.ts`.
- `context/` y `screens/` usan tipos de `models.ts`.
- Los transformers convierten entre ambos formatos.

---

### MÓDULO 2 — Servicios Supabase (`src/services/supabase/`)

**Propósito:** Capa de acceso a datos. Encapsula toda la comunicación con Supabase. Ninguna pantalla consulta Supabase directamente.

**Archivos y funciones principales:**

**`client.ts`** — Inicializa el cliente Supabase con las variables de entorno `EXPO_PUBLIC_SUPABASE_URL` y `EXPO_PUBLIC_SUPABASE_ANON_KEY`.

**`auth.ts`** — Autenticación de todos los roles:
- `signIn(email, password)` — Login para profesores/admin.
- `signUp(email, password)` — Registro de nuevos profesores.
- `signOut()` — Cierre de sesión.
- `getCurrentUser()` — Verifica sesión activa en Supabase.
- `joinClassWithCode(fullName, classCode)` — Lógica de acceso de estudiantes: busca la clase por código, verifica si el alumno ya existe (login) o lo crea (registro).
- `getTeacherProfile(userId)` / `getStudentProfile(userId)` / `getAdminProfile(userId)` — Carga el perfil por rol.
- `getAdminEmailByUsername(username)` — Resuelve nombre de usuario admin → email interno para login.
- `createTeacherProfile()` / `createStudentProfile()` — Crea registros en BD.
- `updateTeacherProfile()` — Actualiza datos del profesor.

**`classes.ts`** — CRUD de clases:
- `getClasses(teacherId)`, `createClass()`, `updateClass()`, `deleteClass()`.
- `addStudentToClass()`, `getClassStudents()`.
- `getClassStats()` — Retorna conteos de estudiantes, materiales y quizzes en paralelo.

**`quizzes.ts`** — CRUD completo del sistema de cuestionarios:
- `getClassQuizzes()`, `getTeacherQuizzes()`, `createQuiz()`, `updateQuiz()`, `deleteQuiz()`.
- `getQuizWithQuestions(quizId)` — Carga quiz + preguntas + opciones en una sola cadena de consultas optimizada.
- `createQuestion()`, `updateQuestion()`, `deleteQuestion()`, `updateQuestionOrder()`.
- `createOption()`, `updateOption()`, `deleteOption()`.

**`materials.ts`** — Gestión de materiales de clase (PDFs, videos, links, etc.).

**`students.ts`** — Consultas de estudiantes para el módulo docente.

**`notifications.ts`** — Notificaciones para profesores.

**`storage.ts`** — Subida/descarga de archivos (avatares, materiales) a Supabase Storage.

**`admin.ts`** — Servicios exclusivos del administrador:
- `getAllClasses()`, `getAllMaterials()`, `getAllQuizzes()`, `getAllQuizSubmissions()` — Consultas globales (sin filtro por profesor).
- `getAdminStats()` — Conteo paralelo de profesores, estudiantes, clases, materiales, quizzes.
- `getRecentActivity()` — Últimas entregas y profesores recientes.
- `verifyTeacher()`, `deactivateTeacher()`, `activateTeacher()`, `deleteTeacher()` — Gestión de profesores.
- `getAllStudents()`, `deleteStudent()`, `reassignStudentToClass()`.
- `updateSubmissionScore()` — Edita la calificación de una entrega.
- `deleteClassByAdmin()`, `deleteMaterialByAdmin()`, `deleteQuizByAdmin()`.

**Integración:** Son consumidos exclusivamente por `context/AuthContext.tsx`, `context/TeacherContext.tsx`, y directamente por las pantallas de nivel superior.

---

### MÓDULO 3 — Servicio Auto-Submit (`src/services/autoSubmit.ts`)

**Propósito:** Manejo del envío automático de cuestionarios cuando el temporizador expira.

**Funciones:**
- `submitQuiz(submission)` — Guarda las respuestas del estudiante en `quiz_submissions`. Marca si fue automático (`auto_submitted: true`) o manual.
- `isQuizAvailable(quizId)` — Verifica si un quiz está publicado y dentro de su ventana de tiempo (`available_from` / `available_until`).

**Integración:** Usado por `StudentTakeQuizScreen` para el envío final de respuestas.

---

### MÓDULO 4 — Contextos Globales (`src/context/`)

**Propósito:** Estado global compartido entre pantallas mediante React Context API.

**`AuthContext.tsx`** — El contexto central de la app:
- Estado: `user` (Supabase User), `profile` (Teacher | Student | Admin), `role` ('teacher' | 'student' | 'admin' | null), `loading`, `error`.
- `signIn(emailOrName, passwordOrCode, role)` — Flujo diferenciado:
  - Estudiante: llama a `joinClassWithCode` y persiste en `AsyncStorage`.
  - Admin: resuelve username → email → Supabase Auth.
  - Profesor: Supabase Auth estándar + verifica `is_active`.
- `signUp()` — Registro de profesores.
- `signOut()` — Limpia estado y elimina sesión (Supabase para prof/admin, AsyncStorage para estudiantes).
- `refreshProfile()` — Recarga el perfil desde la BD.
- Al inicializar: primero verifica `AsyncStorage` (sesión de estudiante persistida), luego verifica sesión activa de Supabase.

**`TeacherContext.tsx`** — Estado de clases del profesor:
- Estado: `classes[]`, `loading`, `error`.
- Acciones: `addClass()`, `updateClass()`, `deleteClass()`, `refreshClasses()`.
- Se activa automáticamente cuando `AuthContext` reporta `role === 'teacher'`.

**Integración:** `AuthContext` es consumido por `RootNavigator` para decidir qué stack mostrar. `TeacherContext` es consumido por todas las pantallas del módulo docente.

---

### MÓDULO 5 — Navegación (`src/navigation/`)

**Propósito:** Enrutamiento central con protección de rutas basada en el rol autenticado.

**`RootNavigator.tsx`** — Stack Navigator único que muestra pantallas condicionalmente:
- `loading === true` → Pantalla de carga.
- `role === null` → **Auth Stack**: RoleSelection, StudentLogin, TeacherLogin, TeacherRegister, TeacherVerification, AdminLogin.
- `role === 'teacher'` → **Teacher Stack**: TeacherDashboard (tabs) + todas las pantallas de gestión.
- `role === 'student'` → **Student Stack**: StudentDashboard (tabs) + StudentTakeQuiz + StudentQuizResults.
- `role === 'admin'` → **Admin Stack**: AdminDashboard (tabs).

Opciones globales: animación `slide_from_right`, header estilizado por rol (color diferente para profesor, estudiante, admin).

**Integración:** Consume `useAuth()` para leer el rol y renderiza el stack correcto. Es el punto de unión entre el módulo de contextos y el módulo de pantallas.

---

### MÓDULO 6 — Módulo de Autenticación (`src/screens/auth/`)

**Propósito:** Pantallas de acceso inicial y selección de rol.

**Pantallas:**
- `RoleSelectionScreen` — Pantalla de bienvenida. El usuario elige si es Estudiante, Profesor o Administrador.
- `StudentLoginScreen` — Formulario de nombre + código de clase. No requiere contraseña.
- `TeacherLoginScreen` — Login con email y contraseña.
- `TeacherRegisterScreen` — Registro: nombre, escuela, email, contraseña.
- `TeacherVerificationScreen` — Pantalla de espera para verificación de email.
- `AdminLoginScreen` — Login con nombre de usuario + contraseña.

**Tecnologías:** React Native, `useForm` hook, `useAuth` hook, React Navigation.

**Integración:**
- Todas usan `useAuth().signIn()` o `useAuth().signUp()`.
- El éxito del login actualiza el `role` en `AuthContext`, lo que hace que `RootNavigator` cambie automáticamente el stack visible.

---

### MÓDULO 7 — Módulo del Profesor (`src/screens/teacher/`)

**Propósito:** Panel completo de gestión educativa para docentes.

**Pantallas principales:**

- `TeacherDashboardTabs` — Tabs inferiores: Inicio, Clases, Biblioteca, Perfil.
- `TeacherMainScreen` — Vista general con estadísticas y actividad reciente.
- `TeacherClassesScreen` — Lista de clases del profesor. Permite crear, editar, eliminar.
- `TeacherCreateClassScreen` — Formulario para crear una nueva clase (nombre, materia, grado, ícono, imagen).
- `TeacherLibraryScreen` — Biblioteca de quizzes y materiales por clase.
- `TeacherProfileScreen` — Perfil del profesor con datos y estadísticas.
- `TeacherEditProfileScreen` — Formulario para editar nombre, escuela, avatar.
- `TeacherNotificationsScreen` — Historial de notificaciones.
- `TeacherStudentsListScreen` — Lista de estudiantes de una clase.
- `TeacherScheduleScreen` — Agenda y calendario de actividades.
- `TeacherReportsScreen` — Reportes de rendimiento por clase.
- `TeacherSubmissionDetailScreen` — Detalle de las respuestas de un estudiante en un quiz.
- `TeacherCreateMaterialScreen` — Sube o enlaza material educativo (PDF, video, link).
- `TeacherMaterialDetailScreen` — Vista del material con opción de eliminar.
- `TeacherCreateQuizScreen` — Crea un quiz vacío y redirige al editor.
- `TeacherCreateTestScreen` — Creador alternativo de evaluaciones.
- `QuizEditorScreen` — Editor avanzado de preguntas. Soporta single_choice, multiple_choice, open_ended. Guardado con debouncing.
- `QuizDetailScreen` — Detalle de un quiz: preguntas, estadísticas, publicar/despublicar, ver entregas.

**Tecnologías:** React Native, `useTeacherClasses` hook, `TeacherContext`, servicios de clases/quizzes/materiales/storage.

**Integración:**
- Lee el perfil del profesor de `AuthContext`.
- Usa `TeacherContext` para la lista de clases (evita re-fetch innecesario).
- Llama a `services/supabase/quizzes.ts`, `classes.ts`, `materials.ts`, `storage.ts`.
- `QuizEditorScreen` usa debouncing para auto-guardar sin bloquear la UI.

---

### MÓDULO 8 — Módulo del Estudiante (`src/screens/student/`)

**Propósito:** Interfaz simplificada para que estudiantes accedan y respondan cuestionarios.

**Pantallas:**

- `StudentDashboardTabs` — Tabs: Inicio, Biblioteca, Perfil.
- `StudentMainScreen` — Vista principal: quizzes disponibles en la clase del estudiante.
- `StudentLibraryScreen` — Historial de entregas y materiales de la clase.
- `StudentProfileScreen` — Perfil del estudiante con historial de calificaciones.
- `StudentTakeQuizScreen` — Selección del quiz a responder. Verifica disponibilidad.
- `StudentQuizInterface` — Interfaz de respuesta activa: muestra preguntas una a una (o todas), temporizador en vivo, detecta expiración.
- `StudentQuizResultsScreen` — Resultados post-entrega: puntaje, respuestas correctas, retroalimentación.

**Tecnologías:** React Native, `autoSubmit` service, `AsyncStorage`, `useAuth`.

**Integración:**
- El perfil del estudiante proviene de `AuthContext.profile` (sin Supabase Auth).
- `StudentQuizInterface` usa `autoSubmit.submitQuiz()` tanto para envío manual como automático al expirar el temporizador.
- La sesión persiste entre cierres de app gracias a `AsyncStorage` gestionado en `AuthContext`.

---

### MÓDULO 9 — Módulo del Administrador (`src/screens/admin/`)

**Propósito:** Panel de control para supervisión y gestión global del sistema.

**Pantallas:**

- `AdminDashboardTabs` — Tabs: Resumen, Usuarios, Contenido, Calificaciones.
- `AdminOverviewScreen` — Dashboard con estadísticas globales (profesores, estudiantes, clases, quizzes, materiales). Actividad reciente.
- `AdminUsersScreen` — Lista de todos los profesores y estudiantes. Permite verificar, activar, desactivar o eliminar profesores. Eliminar o reasignar estudiantes.
- `AdminContentScreen` — Vista de todo el contenido: clases, materiales, quizzes. Permite eliminar cualquier elemento.
- `AdminQualificationsScreen` — Lista de todas las entregas de quizzes. Permite modificar la calificación de cualquier entrega directamente.

**Tecnologías:** React Native, `services/supabase/admin.ts`.

**Integración:**
- El login de admin usa un flujo especial en `AuthContext`: resuelve el `nombre_usuario` a un email interno con `getAdminEmailByUsername()`, luego autentica con Supabase Auth.
- Consume `admin.ts` que hace consultas JOIN globales sin filtro por profesor.
- `AdminUsersScreen` llama a `verifyTeacher()`, `activateTeacher()`, `deactivateTeacher()`, `deleteTeacher()`.
- `AdminQualificationsScreen` llama a `updateSubmissionScore()`.

---

### MÓDULO 10 — Componentes Compartidos (`src/components/`)

**Propósito:** Biblioteca de componentes UI reutilizables entre pantallas y roles.

**Componentes:**
- `Button/` — Botón genérico con variantes (primary, secondary, danger), estados de loading y disabled.
- `Card/` — Tarjeta contenedora con sombra y bordes redondeados.
- `Input/` — Campo de texto con soporte para label, error, iconos y validación visual.
- `QuestionCard/` — Tarjeta de pregunta en el editor (muestra texto, tipo, puntos, opciones).
- `QuestionTypeSelector/` — Selector visual del tipo de pregunta (single, multiple, open_ended).
- `DeadlineManager/` — Componente para configurar fechas de disponibilidad (`available_from`, `available_until`) con DateTimePicker.

**Integración:** Importados por pantallas de `teacher/`, `student/` y `auth/`.

---

### MÓDULO 11 — Hooks Personalizados (`src/hooks/`)

**Propósito:** Lógica de negocio reutilizable extraída de los componentes.

**Hooks:**
- `useAuth.ts` — Re-exporta `useAuth` desde `AuthContext`. Punto de acceso único.
- `useForm.ts` — Gestión genérica de formularios: valores, errores, touched, validación, submit, reset. Tipado con generics `<T>`.
- `useTeacherClasses.ts` — Carga y gestiona clases del profesor con estados de loading/error.
- `useLibrary.ts` — Carga materiales y quizzes de una clase para la biblioteca.

**Integración:** Usados por pantallas de todos los módulos. `useForm` es transversal: lo usan pantallas de auth, teacher y student.

---

### MÓDULO 12 — Estilos Globales (`src/styles/`)

**Propósito:** Sistema de diseño centralizado. Evita estilos ad-hoc dispersos.

**Contenido:** Paleta de colores por rol (`colors.teacher.main`, `colors.student.main`), tipografía, espaciados, y temas.

**Integración:** Importado por `RootNavigator` (colores de headers) y por todos los componentes y pantallas.

---

### MÓDULO 13 — Configuración y Herramientas Raíz

**Archivos clave:**
- `App.tsx` — Punto de entrada. Envuelve la app con `AuthProvider` y `NavigationContainer`.
- `app.config.js` — Configuración de Expo: nombre, íconos, versiones, plugins.
- `tsconfig.json` — Alias `@/` apunta a `src/` para imports limpios.
- `.env` — Variables de entorno: `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
- `jest.config.js` — Configuración de tests con mocks de Supabase y AsyncStorage.
- `babel.config.js` — Preset de Expo + resolución de alias `@/`.

---

## Diagrama de Interconexión entre Módulos

```
App.tsx
  └── AuthProvider (Módulo 4 - AuthContext)
        └── NavigationContainer
              └── RootNavigator (Módulo 5)
                    │
                    ├── [role=null]   → Auth Screens (Módulo 6)
                    │                    └── usa AuthContext.signIn/signUp
                    │
                    ├── [role=teacher] → Teacher Stack (Módulo 7)
                    │                    └── usa TeacherContext (Módulo 4)
                    │                    └── usa services/supabase/ (Módulo 2)
                    │                    └── usa hooks (Módulo 11)
                    │                    └── usa components (Módulo 10)
                    │
                    ├── [role=student] → Student Stack (Módulo 8)
                    │                    └── usa AuthContext.profile
                    │                    └── usa autoSubmit service (Módulo 3)
                    │                    └── usa services/supabase/ (Módulo 2)
                    │
                    └── [role=admin]  → Admin Stack (Módulo 9)
                                         └── usa services/supabase/admin.ts (Módulo 2)

Módulo 2 (Services) ──→ Módulo 1 (Types)  [importa interfaces]
Módulo 4 (Context)  ──→ Módulo 2 (Services) [llama funciones async]
Módulo 4 (Context)  ──→ Módulo 1 (Types)   [usa interfaces]
Módulo 5 (Nav)      ──→ Módulo 4 (Context) [lee role/loading]
Módulos 6,7,8,9     ──→ Módulo 4 (Context) [via useAuth hook]
Módulos 7,8,9       ──→ Módulo 2 (Services) [llamadas directas]
Módulos 6,7,8,9     ──→ Módulo 10 (Components)
Módulos 6,7,8,9     ──→ Módulo 11 (Hooks)
Módulo 11 (Hooks)   ──→ Módulo 2 (Services)
```

---

## Flujo de Datos por Rol

### Profesor
1. Login (auth/TeacherLoginScreen) → `AuthContext.signIn()` → `auth.ts.signIn()` → Supabase Auth.
2. `AuthContext` carga el perfil → `TeacherContext` carga las clases automáticamente.
3. El profesor navega a QuizEditor → `QuizEditorScreen` → `quizzes.ts` → Supabase.

### Estudiante
1. Ingresa nombre + código → `AuthContext.signIn()` → `auth.ts.joinClassWithCode()` → Supabase.
2. El perfil se guarda en `AsyncStorage` para persistencia.
3. Responde quiz → `StudentQuizInterface` → `autoSubmit.submitQuiz()` → Supabase.

### Administrador
1. Login con nombre_usuario → `AuthContext.signIn()` → `auth.ts.getAdminEmailByUsername()` → `auth.ts.signIn()` → Supabase Auth.
2. Panel de admin → `admin.ts` → consultas globales a Supabase (todos los profesores, clases, quizzes).
3. Edita calificación → `admin.ts.updateSubmissionScore()` → Supabase.

---

## Esquema de Base de Datos (Supabase/PostgreSQL)

| Tabla              | Descripción                                      |
|--------------------|--------------------------------------------------|
| `admins`           | Administradores: id, email, full_name, nombre_usuario |
| `teachers`         | Profesores: id, email, full_name, school, verified, is_active, avatar_url |
| `students`         | Estudiantes: id, full_name, class_id             |
| `classes`          | Clases: id, teacher_id, name, subject, grade, class_code, class_icon |
| `class_students`   | Tabla pivote: class_id, student_id, enrolled_at  |
| `class_materials`  | Materiales: id, class_id, title, material_type, file_url, disponibilidad |
| `quizzes`          | Cuestionarios: id, class_id, title, duration_minutes, passing_score, is_published |
| `quiz_questions`   | Preguntas: id, quiz_id, question_text, question_type, points, order_index |
| `quiz_options`     | Opciones de respuesta: id, question_id, option_text, is_correct |
| `quiz_submissions` | Entregas: id, student_id, quiz_id, answers (JSON), score, auto_submitted |

---

*Documento generado automáticamente el 2026-07-06 a partir del análisis del código fuente de BagresApp.*
