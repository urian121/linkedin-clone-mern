# MERN Stack LinkedIn

Un clon estilo LinkedIn construido con el **stack MERN** (MongoDB, Express, React y Node.js) para aprender y mostrar de punta a punta cómo se conecta un frontend moderno con una API REST real.
Permite crear publicaciones, adjuntar archivos, recomendar posts y ver el feed en tiempo real.
Una excusa práctica y divertida para dominar React 19, Tailwind CSS 4, Express 5 y MongoDB Atlas en un mismo proyecto.

---

## Tabla de contenido

- [Stack](#stack)
- [Estructura del proyecto](#estructura-del-proyecto)
- [Requisitos previos](#requisitos-previos)
- [Configuración del Backend](#configuración-del-backend)
- [Configuración del Frontend](#configuración-del-frontend)
- [Endpoints disponibles](#endpoints-disponibles)
- [Apoya el proyecto](#apoya-el-proyecto)

---

## Stack

**Frontend**
- React 19
- Vite
- Tailwind CSS 4
- lucide-react (íconos)

**Backend**
- Node.js
- Express 5
- Mongoose
- MongoDB Atlas
- Cloudinary (almacenamiento de archivos)
- multer + uuid
- dotenv + cors

---

## Estructura del proyecto

```
mern_stack_linkedin/
├── backend-expres-nodejs/        # API REST con Express + MongoDB
│   ├── api/api.js                # Rutas y modelo de publicaciones
│   ├── conn/configBD.js          # Conexión a MongoDB Atlas
│   ├── conn/configCloudinary.js  # Conexión a Cloudinary
│   ├── app.js                    # Punto de entrada del servidor
│   └── .env-example              # Plantilla de variables de entorno
│
└── frontend-react-js/            # SPA con React + Vite
    ├── src/
    │   ├── components/           # Header, PostCard, CreatePostModal, HomeSkeleton
    │   ├── pages/Home.jsx        # Feed principal
    │   └── App.jsx
    └── .env.example              # Plantilla de variables de entorno
```

---

## Requisitos previos

- [Node.js](https://nodejs.org/) 20+ y npm
- Una cuenta gratuita de [MongoDB Atlas](https://www.mongodb.com/atlas) con un cluster creado
- Una cuenta gratuita de [Cloudinary](https://cloudinary.com/users/register/free) (para guardar las imágenes y archivos subidos)

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

3. Completa las variables con tus credenciales de **MongoDB Atlas** y **Cloudinary**:

```env
DB_USER=tu_usuario
DB_PASS=tu_password
DB_HOST=tu_cluster.mongodb.net
DB_APP_NAME=Cluster01

# Configuración de Cloudinary
CLOUDINARY_CLOUD_NAME=tu_cloud_name
CLOUDINARY_API_KEY=tu_api_key
CLOUDINARY_API_SECRET=tu_api_secret
CLOUDINARY_FOLDER=files_mern_stack
```

> Las credenciales de Cloudinary están en **Dashboard → API Keys** de tu cuenta. La carpeta `CLOUDINARY_FOLDER` se crea automáticamente cuando se sube el primer archivo.

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
npm install
```

2. Crea tu archivo `.env` a partir del ejemplo:

```bash
cp .env.example .env
```

3. Verifica las variables (deben empezar con `VITE_` para que Vite las exponga al cliente):

```env
VITE_API_URL=http://localhost:5000/api
VITE_ACCEPTED_FILE_TYPES=image/*,video/*,application/pdf
VITE_DEFAULT_USER_ID=demo-user
```

4. Inicia el servidor de desarrollo:

```bash
npm run dev
```

App disponible en: **http://localhost:5173**

> Recuerda mantener el backend corriendo en paralelo para que el frontend pueda consumir la API.

---

## Endpoints disponibles

| Método | Ruta                            | Descripción                               |
|--------|---------------------------------|-------------------------------------------|
| POST   | `/api/subirarchivos`            | Sube uno o varios archivos a **Cloudinary** (`multipart/form-data`, campo `archivos`) y devuelve sus URLs públicas |
| POST   | `/api/agregarpublicacion`       | Crea una nueva publicación                |
| GET    | `/api/obtenerpublicaciones`     | Obtiene todas las publicaciones (recientes primero) |
| POST   | `/api/recomendarpublicacion`    | Suma una recomendación a una publicación  |

> Los archivos se almacenan en Cloudinary (carpeta `files_mern_stack`) con un nombre **UUID v4**. En MongoDB solo se guarda la URL pública del recurso, no el binario.

---

## Apoya el proyecto

Si este proyecto te resultó útil o te ayudó a aprender algo nuevo, considera **dejarle una estrellita** en GitHub. Es gratis, toma un segundo y motiva muchísimo a seguir creando contenido y proyectos open source de calidad.

> Hecho con dedicación por **Urian Viera**.
