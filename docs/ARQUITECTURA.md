# Arquitectura

## Topología de producción

```mermaid
flowchart LR
    browser["Navegador"]
    static["Frontend estático<br/>/GestionDeIncidentes/"]
    api["API Node/Express<br/>Render · HTTPS"]
    db["PostgreSQL<br/>Render"]
    browser --> static
    static -->|HTTPS + JWT| api
    api --> db
```

El frontend React/Vite se compila como sitio estático. La API Express se ejecuta
en Render con `npm start` y se conecta a PostgreSQL mediante Prisma.

- Frontend: `https://diegoconstante.github.io/GestionDeIncidentes/`
- API: `https://gestiondeincidentes-49oe.onrender.com`

## Capas del backend

- `src/server.js`: arranque y cierre ordenado.
- `src/app.js`: Helmet, pino-http, CORS, rate limit, JSON, sanitización,
  health checks y routers.
- `src/routes/`: métodos HTTP, validación y permisos.
- `src/controllers/`: parámetros y respuestas.
- `src/services/`: operaciones Prisma y paginación.
- `src/middlewares/`: JWT, autorización por rol, validación y errores.
- `src/schemas/`: contratos Zod.
- `src/config/`: entorno y cliente Prisma.
- `src/utils/`: creación y verificación de JWT.

El frontend organiza la vista principal en `App.jsx`, componentes reutilizables
en `components/`, acceso HTTP en `services/`, estado local en hooks de React y
formateo en `utils/`. No usa router de React: la navegación visible usa anclas
del documento y el cambio entre login y panel es renderizado condicional.

## Producción y seguridad

- `CLIENT_ORIGIN` limita CORS al origen del frontend y `Authorization` está
  permitido explícitamente.
- `app.set("trust proxy", 1)` permite trabajar detrás del proxy de Render.
- El puerto se obtiene de `process.env.PORT` mediante `env.js`, con 3000 como
  respaldo del código.
- En `NODE_ENV=production`, los errores no 4xx se responden como
  `Error interno del servidor`; los logs de pino redactan
  `req.headers.authorization`.
- La conexión Prisma activa SSL explícito solo si el hostname termina en
  `.render.com`, que corresponde a la URL externa; la URL interna no lo activa.
- El plan gratuito puede suspender el servicio cuando está inactivo, por lo que
  la primera solicitud puede tardar más; esta condición debe considerarse al
  realizar demostraciones.
- `render.yaml` no ejecuta migraciones: el usuario de aplicación solo tiene
  permisos de CRUD. El esquema debe estar preparado antes de iniciar la API.

## Datos y autorización

`Usuario` tiene correo único, hash, rol y fechas. `Incidente` tiene título,
descripción, responsable, prioridad, estado y fechas. Los roles son `ADMIN` y
`ANALISTA`; solo `ADMIN` puede eliminar. La API protege las rutas de incidentes
con JWT y valida cuerpos con Zod.

## Estado del despliegue

- Frontend publicado en
  `https://diegoconstante.github.io/GestionDeIncidentes/`.
- API publicada en `https://gestiondeincidentes-49oe.onrender.com`.
- PostgreSQL está provisionado en Render.
- La validación manual de autenticación, CRUD y autorización por rol está
  aprobada.
- El archivo `BackEnd/docker-compose.yml` declara MySQL aunque la aplicación
  usa PostgreSQL; no forma parte de la topología de producción configurada:
  **POR CONFIRMAR** si se conservará como recurso local.
