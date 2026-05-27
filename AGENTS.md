# AGENTS.md — Reglas del proyecto MERN Stack LinkedIn

Eres un agente experto en MongoDB, Express, React y Node.js trabajando sobre este repositorio. Sigue estas reglas **siempre**, sin excepciones, en cualquier respuesta o cambio de código.

---

## 1. Idioma

- Responde **siempre en español**, sin importar el idioma de la pregunta.
- Comentarios de código, nombres de variables y mensajes al usuario también en español (excepto términos técnicos consolidados como `useState`, `fetch`, `props`, etc.).
- Tono claro, directo, sin relleno. Cero emojis salvo que el usuario los pida.

---

## 2. Stack y herramientas

- **Frontend:** React 19 + Vite + Tailwind CSS 4 + lucide-react.
- **Backend:** Node.js + Express 5 + Mongoose + MongoDB Atlas + Cloudinary (almacenamiento) + multer + uuid.
- **Lenguaje:** JavaScript (no TypeScript). Prefiere `.jsx` en componentes React.
- **Estilo de código:** ESM en frontend (`import/export`), CommonJS en backend (`require/module.exports`) para mantener consistencia con lo existente.

---

## 3. Reglas de UI / UX (frontend)

### 3.1 Diseño y paleta

Mantén la coherencia visual estilo LinkedIn ya establecida:

- **Azul principal:** `#0A66C2`
- **Azul hover:** `#004182`
- **Fondo de la app:** `#F3F2EF`
- **Bordes neutros:** `border-gray-200` / `border-gray-300`
- **Texto principal:** `text-gray-900`
- **Texto secundario:** `text-gray-500`/`text-gray-600`
- **Tarjetas:** `bg-white rounded-lg border border-gray-200`
- **Botones primarios:** `rounded-full`, fondo `#0A66C2`, hover `#004182`, texto blanco semibold.

### 3.2 Animaciones — restricciones estrictas

- **NUNCA uses `animate-pulse`** (provoca sensación de zoom/latido). Para skeletons usa la clase global `skeleton-shimmer` definida en `src/assets/css/index.css`.
- **Nunca uses `box-shadow` ni utilidades `shadow-*` de Tailwind** para el chrome de la app. LinkedIn usa bordes finos, no sombras. Excepción: `shadow-2xl` solo dentro del modal de crear publicación (ya implementado).
- Las animaciones permitidas son las definidas en `index.css` (`modal-overlay-in`, `modal-card-in`, `skeleton-shimmer`). Si necesitas una nueva, agrégala al CSS global, no inline.

### 3.3 Iconografía

- **Solo lucide-react.** No mezcles con otras librerías de íconos.
- Usa `strokeWidth={1.8}` por defecto, `2.5` cuando un elemento esté activo o necesite énfasis.

---

## 4. Reglas de código React (frontend)

### 4.1 React moderno

- Usa **hooks** y componentes funcionales. Nada de clases.
- Aprovecha **React 19 / React Compiler** ya activos: no añadas `useMemo`, `useCallback` ni `React.memo` salvo que haya un caso medido. El compiler ya optimiza renders.
- Evita la **prop drilling**: si pasarías el mismo prop por más de 2 niveles, plantea un Context.

### 4.2 Effects y setState

- En `useEffect`, **nunca llames `setState` síncronamente al inicio** (rompe con el React Compiler y causa "cascading renders"). Si necesitas marcar `loading=true`, haz que sea el estado inicial.
- Patrón canónico para fetch dentro de un effect:

  ```jsx
  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(URL)
        const data = await res.json()
        if (cancelled) return
        setX(data)
      } catch (err) {
        if (cancelled) return
        setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    })()
    return () => { cancelled = true }
  }, [deps])
  ```

- Para reintentos, usa un `reloadKey` que se incrementa desde un event handler.

### 4.3 Menos JS, más declarativo

- **Escribe el menor JavaScript posible.** Si una lógica puede expresarse con CSS, JSX condicional o un componente reutilizable, hazlo así.
- Prefiere expresiones a funciones largas, e early returns a anidación profunda.
- Reemplaza `formatTime`, `formatDate`, lógica de fechas casera por **`dayjs`** ya instalado (con plugin `relativeTime` y locale `es`).

### 4.4 Reutilización

- **Si un bloque de JSX se repite ≥ 2 veces, extráelo a un componente** en `src/components/`.
- **Si una lógica se repite ≥ 2 veces, extráela a un hook** `src/hooks/useXxx.js` o a un helper en `src/utils/`.
- Mantén los componentes **pequeños y de una sola responsabilidad** (ej. `FilePreview`, `HomeSkeleton`, `PostCard`).

### 4.5 Estilos

- **Tailwind sobre CSS plano.** Solo usa CSS global (`index.css`) para keyframes, resets o variables.
- No uses inline `style={{}}` salvo para valores dinámicos (color generado, animación con duración variable, etc.). Para todo lo demás, clases de Tailwind.

---

## 5. Variables de entorno

- **Nunca hardcodees** URLs, IDs, claves o configuraciones. Toda constante "importante" va en `.env` y `.env-example`/`.env.example`.
- En frontend (Vite): variables públicas **DEBEN** comenzar con `VITE_` y leerse vía `import.meta.env.VITE_FOO`.
- Recuerda al usuario que **debe reiniciar el dev server** tras cambiar un `.env`.
- Nunca metas `API_SECRET` o secretos en variables `VITE_*` (terminan en el bundle del cliente).

---

## 6. Reglas del backend

### 6.1 Estructura

- Conexiones externas → archivo dedicado en `conn/` (`configBD.js`, `configCloudinary.js`).
- Rutas y modelo Mongoose → `api/api.js`. Si crece, divide por feature en `api/<recurso>.js` y monta cada router en `app.js`.
- `app.js` solo orquesta: middlewares, montaje de routers y `app.listen`. No lógica de negocio.

### 6.2 Modelo y rutas

- **Schemas Mongoose** simples y planos. No agrupes campos innecesariamente; preferible `recomendaciones: Number` sobre `reacciones: { recomendacion: ... }` salvo necesidad real.
- **Endpoints en español, kebab cuando aplique**, ya establecidos:
  - `POST /api/agregarpublicacion`
  - `GET  /api/obtenerpublicaciones`
  - `POST /api/recomendarpublicacion`
  - `POST /api/subirarchivos`
- Mantén ese estilo consistente al añadir nuevos endpoints (`/api/<verbo><sustantivo>`).

### 6.3 Manejo de errores

- Cada handler async dentro de `try/catch`.
- En errores controlados (validación, "no encontrado") usa **status 4xx** con `{ error: "mensaje claro" }`.
- En errores de servidor usa **status 500** con un mensaje genérico (`"No se pudo procesar la solicitud"`) y `console.error` con el detalle interno.
- **Nunca devuelvas `err` crudo al cliente** (puede filtrar info sensible).

### 6.4 Subida de archivos

- **Cloudinary es la única fuente de verdad para archivos.** Nada de `uploads/` en disco, nada de `express.static('uploads')`.
- Multer en **memoria** (`multer.memoryStorage()`), nunca `diskStorage`.
- Cada archivo se sube a Cloudinary con `public_id = uuidv4()` y `folder = process.env.CLOUDINARY_FOLDER`.
- En MongoDB se guarda **solo `{ url, tipo }`**, nunca el binario.

### 6.5 Validaciones

- Valida en el handler antes de tocar la DB (`req.body.<campo>` requerido, tipos, longitudes razonables).
- Devuelve 400 con un mensaje claro si falla.
- No confíes en que el frontend valide; siempre revalida en backend.

---

## 7. Convenciones de naming

- **Variables y funciones:** `camelCase`.
- **Componentes React y modelos Mongoose:** `PascalCase`.
- **Archivos de componentes:** `PascalCase.jsx`.
- **Archivos de utilidades / hooks / config:** `camelCase.js`.
- **Constantes globales / env:** `SCREAMING_SNAKE_CASE`.

---

## 8. Antes de entregar un cambio

Cada vez que modifiques código, asegúrate de:

1. **Sin errores de linter** (`ReadLints`).
2. **Sin imports muertos** (no dejes `import { X }` si no usas `X`).
3. **Sin `console.log` de debug** (los `console.error` para errores reales sí están permitidos).
4. **Variables de entorno actualizadas** en `.env` y `.env-example` si introdujiste alguna nueva.
5. **README actualizado** si cambian endpoints, dependencias o pasos de setup.

---

## 9. Lo que NO debes hacer

- ❌ Reintroducir reacciones distintas a `recomendacion` (el modelo se simplificó a una sola).
- ❌ Guardar archivos en disco local del backend.
- ❌ Hardcodear `http://localhost:5000` o el cloud_name de Cloudinary.
- ❌ Mezclar Tailwind v3 syntax (`bg-gradient-to-*`) con v4 (`bg-linear-to-*`). Este proyecto usa **Tailwind 4**.
- ❌ Añadir librerías pesadas (lodash, moment, axios) cuando hay alternativas nativas o ya instaladas (`fetch`, `dayjs`).
- ❌ Crear archivos `.md` o documentación que el usuario no pidió explícitamente.
- ❌ Romper compatibilidad con publicaciones existentes en MongoDB sin avisar y proponer una migración.

---

## 10. Cómo proponer cambios grandes

Si una tarea implica refactor profundo, nuevas dependencias o cambio de arquitectura:

1. Resume en 3-5 líneas qué vas a hacer y por qué.
2. Lista las dependencias nuevas (justifica cada una).
3. Aplica los cambios.
4. Termina con un bloque de "**Próximos pasos sugeridos**" si descubriste deuda técnica relacionada.

---

> Al usuario lo que más le interesa es: **código limpio, poco JS, mucho declarativo, UI consistente con LinkedIn, y que no rompas lo que ya funciona.**
