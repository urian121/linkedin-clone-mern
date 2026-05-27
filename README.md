# MERN Stack LinkedIn

Un clon estilo LinkedIn construido con el **stack MERN** (MongoDB, Express, React y Node.js) para aprender y mostrar de punta a punta cómo se conecta un frontend moderno con una API REST real.
Incluye **autenticación con Google vía Firebase**, creación de publicaciones con texto, imágenes, videos, PDFs y PowerPoints, mejora de texto con **IA (Google Gemini)**, previews automáticos de YouTube, autoplay de videos al hacer scroll y un feed paginado con scroll infinito.
Una excusa práctica y divertida para dominar React 19, Tailwind CSS 4, Express 5, MongoDB Atlas y Firebase en un mismo proyecto.

---

## Tabla de contenido

- [Funcionalidades](#funcionalidades)
- [Stack](#stack)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Configuración del Backend](#configuración-del-backend)
- [Configuración del Frontend](#configuración-del-frontend)
- [Endpoints disponibles](#endpoints-disponibles)
- [Apoya el proyecto](#apoya-el-proyecto)

---

## Funcionalidades

- **Autenticación con Google** vía Firebase: login con un solo click, sesión persistente entre recargas y rutas protegidas.
- **Menú de usuario** en el header con foto de perfil real (de la cuenta de Google) y opción de cerrar sesión.
- **Feed paginado con scroll infinito**: las publicaciones se cargan de 3 en 3 a medida que el usuario hace scroll.
- **Crear publicaciones** con texto, emojis (`emoji-mart`), múltiples imágenes (hasta 6), videos, PDFs y PowerPoints.
- **Mejorar texto con IA** usando Google Gemini desde un botón en el modal de publicación.
- **Vista previa de YouTube** automática al pegar un enlace en el texto (`react-lite-youtube-embed`).
- **Mosaico de imágenes** estilo LinkedIn (1, 2, 3, 4+ imágenes con overlay `+N`).
- **Slider de páginas para PDFs** usando las transformaciones `pg_N` de Cloudinary.
- **Autoplay de videos** al entrar al viewport (con `IntersectionObserver`).
- **Recomendar publicaciones** (similar a "Me gusta", una por sesión).
- **Skeletons sincronizados** para una carga visual idéntica al layout final.
- **Navegación con React Router** y rutas placeholder para Mi red, Empleos, Mensajería y Notificaciones.
- **Animaciones suaves** de apertura y cierre del modal.

---

## Stack

**Frontend**
- React 19 + React Compiler
- Vite
- Tailwind CSS 4
- React Router DOM
- Firebase Authentication (Google Sign-in)
- lucide-react (íconos)
- dayjs (fechas relativas en español)
- emoji-mart (selector de emojis)
- react-lite-youtube-embed (previews ligeros de YouTube)
- react-infinite-scroll-component (scroll infinito)
- nextjs-toast-notify (toasts)

**Backend**
- Node.js + Express 5
- Mongoose + MongoDB Atlas
- Cloudinary (almacenamiento de archivos)
- multer + uuid (subida de archivos en memoria)
- @google/genai (Google Gemini para mejorar publicaciones)
- dotenv + cors

---

## Estructura del proyecto

```
mern_stack_linkedin/
├── backend-expres-nodejs/        # API REST con Express + MongoDB
│   ├── api/api.js                # Rutas, modelo de publicaciones e integración con IA
│   ├── conn/configBD.js          # Conexión a MongoDB Atlas
│   ├── conn/configCloudinary.js  # Conexión a Cloudinary
│   ├── app.js                    # Punto de entrada del servidor
│   └── .env-example              # Plantilla de variables de entorno
│
└── frontend-react-js/            # SPA con React + Vite
    ├── src/
    │   ├── components/           # Header, PostCard, CreatePostModal, ImageGrid, MediaSlider, ProtectedRoute, UserMenu, etc.
    │   ├── conn/firebase.js      # Inicialización de Firebase Auth + provider Google
    │   ├── contexts/             # authContext + AuthProvider (estado global de sesión)
    │   ├── hooks/                # usePosts, useInView, useAuth, usePostForm, useCloseAnimation
    │   ├── pages/Home.jsx        # Feed principal (ruta protegida)
    │   ├── pages/auth/Login.jsx  # Página de login con Google
    │   ├── pages/placeholders/   # Mi red, Empleos, Mensajería, Notificaciones
    │   ├── utils/youtube.js      # Helper para detectar URLs de YouTube
    │   ├── App.jsx               # Definición de rutas + AuthProvider
    │   └── main.jsx              # Punto de entrada (BrowserRouter)
    └── .env.example              # Plantilla de variables de entorno
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 20+ y npm
- Una cuenta gratuita de [MongoDB Atlas](https://www.mongodb.com/atlas) con un cluster creado
- Una cuenta gratuita de [Cloudinary](https://cloudinary.com/users/register/free) (para guardar imágenes y archivos subidos)
- Una API key gratuita de [Google AI Studio](https://aistudio.google.com/apikey) (para la funcionalidad "Mejorar con IA")
- Un proyecto en [Firebase Console](https://console.firebase.google.com/) con **Authentication → Google** habilitado (para el login)

---

## Configuración del Backend

1. Entra a la carpeta del backend e instala dependencias:

```bash
cd backend-expres-nodejs
npm install
```

2. Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env-example .env
```

3. Completa las variables con tus credenciales:

```env
# MongoDB Atlas
DB_USER=tu_usuario
DB_PASS=tu_password
DB_HOST=tu_cluster.mongodb.net
DB_APP_NAME=Cluster01

# Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=files_mern_stack
MAX_IMAGEN_MB=20
MAX_VIDEO_MB=100
MAX_IMAGES=6
ALLOWED_MIME_TYPES=image/*,video/*,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation

# Google Gemini (mejorar publicación con IA)
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-2.5-flash
```

> Las credenciales de Cloudinary están en **Dashboard → API Keys**. La carpeta `CLOUDINARY_FOLDER` se crea automáticamente al subir el primer archivo. La key de Gemini se obtiene en [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

4. Levanta el servidor en modo desarrollo (recarga automática con `node --watch`):

```bash
npm start
```

Servidor disponible en: **http://localhost:5000**

---

## Configuración del Frontend

1. En otra terminal, entra a la carpeta del frontend e instala dependencias:

```bash
cd frontend-react-js
npm install --legacy-peer-deps
```

> Se usa `--legacy-peer-deps` porque algunas librerías (`@emoji-mart/react`, `react-lite-youtube-embed`, `firebase`) aún no declaran React 19 como peer dependency, aunque funcionan perfecto en runtime.

2. Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

3. Verifica las variables (deben empezar con `VITE_` para que Vite las exponga al cliente):

```env
VITE_API_URL=http://localhost:5000/api
VITE_ACCEPTED_FILE_TYPES=image/*,.gif,video/*,application/pdf,.ppt,.pptx
VITE_DEFAULT_USER_ID=demo-user
VITE_MAX_IMAGES=6
VITE_MAX_IMAGEN_MB=20
VITE_MAX_VIDEO_MB=100
VITE_IMAGENES_MOSAICO_MAX=4
VITE_POSTS_POR_PAGINA=3

# Firebase (autenticación con Google)
VITE_FIREBASE_API_KEY=tu_api_key
VITE_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tu_proyecto
VITE_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=000000000000
VITE_FIREBASE_APP_ID=1:000000000000:web:0000000000000000000000
```

> Los valores de Firebase se obtienen en **Firebase Console → Configuración del proyecto → Tus apps → Configuración del SDK**. Asegúrate también de activar **Authentication → Sign-in method → Google** y agregar `localhost` a los dominios autorizados.

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

App disponible en: **http://localhost:5173**

> Recuerda mantener el backend corriendo en paralelo para que el frontend pueda consumir la API. Si cambias el `.env`, reinicia el dev server para que las variables se recarguen.

---

## Endpoints disponibles

| Método | Ruta                            | Descripción                               |
|--------|---------------------------------|-------------------------------------------|
| POST   | `/api/subirarchivos`            | Sube uno o varios archivos a **Cloudinary** (`multipart/form-data`, campo `archivos`) y devuelve sus URLs públicas + nº de páginas (PDF) |
| POST   | `/api/agregarpublicacion`       | Crea una nueva publicación con texto y archivos asociados |
| GET    | `/api/obtenerpublicaciones`     | Obtiene publicaciones paginadas (`?pagina=N&limite=M`, recientes primero) |
| POST   | `/api/recomendarpublicacion`    | Suma una recomendación a una publicación  |
| POST   | `/api/mejorarpost`              | Mejora el texto de una publicación usando **Google Gemini** |

> Los archivos se almacenan en Cloudinary (carpeta `files_mern_stack`) con un nombre **UUID v4** + extensión original. En MongoDB solo se guarda `{ url, tipo, nombre, paginas }`, nunca el binario.

---

## Apoya el proyecto

Si este proyecto te resultó útil o te ayudó a aprender algo nuevo, considera **dejarle una estrellita** en GitHub. Es gratis, toma un segundo y motiva muchísimo a seguir creando contenido y proyectos open source de calidad.

> Hecho con dedicación por **Urian Viera**.
