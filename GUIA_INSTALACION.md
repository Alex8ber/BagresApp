# Guía de Instalación y Despliegue - Prototipo BagresApp

Esta guía detalla el proceso técnico para instalar y desplegar el prototipo educativo en un entorno de pruebas o directamente en los dispositivos móviles de los evaluadores.

---

## 1. Requisitos Previos

Antes de comenzar la instalación, asegúrate de cumplir con los siguientes requisitos:

### Hardware
- **Desarrollador / Servidor Local:** PC o Mac con al menos 8GB de RAM, procesador moderno y 10GB de espacio en disco disponible.
- **Evaluadores (Dispositivos):** Smartphone o tablet Android (versión 9.0 o superior) o iOS (versión 13.0 o superior).

### Software y Dependencias
- **Entorno de ejecución:** [Node.js](https://nodejs.org/) (v18.x o superior recomendado).
- **Gestor de paquetes:** `npm` (incluido por defecto con Node.js).
- **Framework Móvil:** [Expo CLI](https://expo.dev/), el cual viene incluido en el proyecto y se ejecuta vía `npx expo` (SDK 55).
- **Aplicación Cliente (Evaluadores):** Instalar la app gratuita **Expo Go** desde Google Play Store (Android) o App Store (iOS) en los dispositivos de prueba físicos.
- **Control de Versiones:** Git.

### Base de Datos y Backend
- Una cuenta activa en [Supabase](https://supabase.com/).
- Un proyecto nuevo creado en Supabase (utiliza PostgreSQL bajo el capó).

### Configuraciones de Red
- **LAN:** El equipo host (donde se ejecuta el servidor de Expo) y los dispositivos móviles de los evaluadores deben estar conectados a la **misma red Wi-Fi local**.
- **Firewall:** Si usas Windows, asegúrate de que el perfil de red esté configurado como "Privado" para permitir conexiones entrantes en el puerto 8081.
- **Internet:** Se requiere conexión a internet tanto para descargar las dependencias como para que la app se comunique con el backend de Supabase.

---

## 2. Procedimiento Paso a Paso de Instalación

El tiempo estimado para completar todo el proceso desde cero es de **15 a 25 minutos**.

### Paso 1: Clonar el Repositorio (⏱️ 2 min)
Abre una terminal y clona el código fuente en tu máquina local:
```bash
git clone <URL_DEL_REPOSITORIO>
cd BagresApp
```

### Paso 2: Instalación de Dependencias (⏱️ 3 - 5 min)
Instala todos los paquetes y librerías de Node (React Native 0.83.6, dependencias de Expo, etc.) definidos en el `package.json`:
```bash
npm install
```

### Paso 3: Configuración del Backend en Supabase (⏱️ 10 min)
La aplicación depende de la estructura de la base de datos para autenticación de profesores y estudiantes, y gestión de cuestionarios.
1. Ingresa al panel de tu proyecto en Supabase.
2. Dirígete a la sección **SQL Editor**.
3. Ejecuta los scripts de migración necesarios. Por ejemplo, para inicializar el sistema de cuestionarios, ejecuta:
   ```sql
   CREATE TYPE question_type_enum AS ENUM (
       'single_choice',
       'multiple_choice',
       'open_ended'
   );
   -- Asegúrate de ejecutar también las migraciones adicionales para políticas RLS y usuarios descritas en migrations/STUDENT_LOGIN_SETUP.md
   ```

### Paso 4: Configuración de Variables de Entorno (⏱️ 2 min)
La aplicación móvil necesita saber cómo conectarse a tu proyecto de Supabase.
1. Crea un archivo `.env` a partir de la plantilla:
   ```bash
   cp .env.example .env
   ```
2. Obtén tus credenciales en Supabase yendo a **Project Settings → API**.
3. Edita el archivo `.env` en la raíz del proyecto y reemplaza los valores:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=tu-clave-anon-aqui
   ```

### Paso 5: Inicio del Servidor de Desarrollo (⏱️ 1 min)
Arranca el empaquetador Metro de React Native. Se recomienda usar el flag `-c` para limpiar la caché y asegurar que lea las variables de entorno:
```bash
npx expo start -c
```
Al finalizar, la terminal mostrará un **código QR**. Mantén esta terminal abierta.

### Paso 6: Despliegue en Dispositivos de Evaluadores (⏱️ 2 min)
1. Pide a los evaluadores que abran la aplicación **Expo Go** en sus dispositivos.
2. **En Android:** Toca el botón "Scan QR code" dentro de Expo Go y escanea el código de la terminal de tu PC.
3. **En iOS:** Abre la aplicación nativa de Cámara, escanea el código QR de la terminal y toca la notificación superior que dice "Open in Expo Go".
4. La aplicación descargará el bundle de JavaScript a través de la red Wi-Fi e iniciará el prototipo en el dispositivo, listo para probar.

---

## 3. Resolución de Problemas Frecuentes

> [!WARNING]
> **Error de Red o "Network Response Timed Out"**
> Esto ocurre si el dispositivo móvil no puede alcanzar a la PC en la red local. Verifica que ambos dispositivos estén en la misma Wi-Fi. Si persiste, usa el modo túnel reiniciando el servidor con `npx expo start --tunnel`.

> [!NOTE]
> **Errores de Conexión a Base de Datos en la App**
> Si la app carga pero muestra errores al intentar hacer login, verifica que el archivo `.env` contenga el prefijo exacto `EXPO_PUBLIC_` en las variables y que hayas reiniciado el servidor borrando caché (`-c`).
