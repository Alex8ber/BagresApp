# BagresApp - Documentación General

Bienvenido a la documentación general de **BagresApp**, una plataforma educativa interactiva diseñada para conectar a profesores y estudiantes a través de un sistema de cuestionarios (quizzes) y clases virtuales.

## 🚀 Descripción General
BagresApp permite a los profesores crear, gestionar y publicar cuestionarios para sus estudiantes. Los estudiantes pueden unirse a las clases mediante códigos únicos y responder cuestionarios en tiempo real, con características avanzadas como temporizadores y envío automático.

## 🛠 Arquitectura y Tecnologías
La aplicación está construida con tecnologías modernas para asegurar escalabilidad, rendimiento y una excelente experiencia de usuario:
- **Frontend / Mobile:** [React Native](https://reactnative.dev/) (v0.83.6) y [Expo](https://expo.dev/) (SDK 55).
- **Lenguaje Principal:** TypeScript, con tipado estricto para mayor robustez.
- **Navegación:** React Navigation v7 (Stacks y Tabs).
- **Backend / Base de Datos:** [Supabase](https://supabase.com/), utilizado para autenticación (profesores) y base de datos PostgreSQL en tiempo real.
- **Testing:** Jest y React Native Testing Library.

## 📂 Estructura del Proyecto
El proyecto sigue una arquitectura modular en la carpeta `src/`:

```
src/
├── components/    # Componentes UI reutilizables (Botones, Tarjetas, Inputs).
├── screens/       # Vistas principales separadas por módulos:
│   ├── auth/      # Pantallas de inicio de sesión y registro.
│   ├── student/   # Interfaz del estudiante (Ingreso por código, Cuestionarios).
│   ├── teacher/   # Panel del profesor (Editor de quizzes, Gestión de clases).
│   └── supabase/  # Vistas de prueba/integración (si aplica).
├── hooks/         # Custom hooks de React para lógica de negocio.
├── context/       # Estado global (AuthContext, etc.).
├── navigation/    # Configuración de rutas principales y protección de pantallas por rol.
├── services/      # Lógica de comunicación con APIs y Supabase (ej. quizzes.ts).
├── types/         # Definiciones globales de TypeScript (Interfaces y Tipos).
├── styles/        # Sistema centralizado de diseño, temas y tipografía.
└── utils/         # Funciones utilitarias (Debouncing, validaciones, etc.).
```

*(Para más detalles sobre la arquitectura y alias de TypeScript, consulta `src/README.md`)*.

## 📊 Carta Estructurada del Sistema

La carta estructurada define la jerarquía de los módulos enfocados exclusivamente en los dos actores principales de la plataforma:

- **Módulo del Profesor**
  - **Autenticación:** Inicio de sesión y Registro (Email/Contraseña)
  - **Gestión de Clases:** Creación de salas y generación de códigos únicos
  - **Gestión de Cuestionarios:** Creador y editor avanzado (Selección simple, múltiple, texto)
  - **Monitoreo:** Panel de resultados y visualización de progreso en tiempo real

- **Módulo del Estudiante**
  - **Acceso:** Ingreso simplificado mediante Código de Clase (sin email/contraseña)
  - **Sala de Espera:** Lobby previo al inicio del cuestionario
  - **Resolución:** Interfaz de respuestas con temporizador y auto-envío
  - **Resultados:** Visualización de puntaje y feedback post-cuestionario

## 👥 Roles y Sistema de Acceso

La aplicación está diseñada en torno a dos roles principales:

### 1. Profesores
- Acceden mediante correo y contraseña (gestionado por **Supabase Auth**).
- Tienen permisos para crear clases, generar códigos únicos y administrar cuestionarios completos (crear, publicar, despublicar, eliminar).

### 2. Estudiantes
- Acceso simplificado **sin necesidad de contraseña ni email**.
- Los estudiantes se unen ingresando su nombre y un **Código de Clase** de 6 caracteres provisto por el profesor (similar a Google Classroom).
- El sistema detecta si es la primera vez (lo registra) o si ya existe en esa clase (inicia sesión automáticamente).

## 📝 Módulos Principales

### Sistema de Cuestionarios (Quizzes)
Es el núcleo de la aplicación, altamente optimizado (ver `QUIZ_SYSTEM_SETUP.md`):
- **Editor Avanzado:** Soporta creación dinámica de preguntas con guardado automático (debouncing).
- **Tipos de Pregunta:** 
  1. Selección Simple (`single_choice`)
  2. Selección Múltiple (`multiple_choice`)
  3. Respuesta Abierta (`open_ended`)
- **Interfaz del Estudiante:** Cuenta con temporizadores en vivo y funcionalidad de "Auto-submit" (envío automático al agotarse el tiempo).

## ⚙️ Configuración y Desarrollo

### Variables de Entorno
La aplicación requiere un archivo `.env` en la raíz (basado en `.env.example`) con las credenciales de Supabase:
```env
EXPO_PUBLIC_SUPABASE_URL=tu_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=tu_llave
```
*(Para instrucciones detalladas, consulta el archivo `SETUP.md`).*

### Comandos Principales
- **Iniciar app:** `npm start`
- **Verificar Tipos:** `npm run type-check`
- **Linter y Formato:** `npm run lint` / `npm run format`
- **Pruebas (Tests):** `npm run test` (Actualmente cuenta con una sólida base de más de 400 tests pasando).

---
**Documentos Complementarios:**
- 📄 `SETUP.md`: Guía paso a paso para configurar el entorno y Supabase.
- 📄 `QUIZ_SYSTEM_SETUP.md`: Estado detallado, migraciones SQL e implementaciones del sistema de cuestionarios.
- 📄 `src/README.md`: Normativas técnicas de código, ESLint y estructura de carpetas.
