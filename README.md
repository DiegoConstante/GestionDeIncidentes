# Gestión de incidentes

Aplicación web para autenticación y gestión de incidentes. El frontend estático
consume la API Express, que persiste los datos en PostgreSQL mediante Prisma.

## Requisitos y estructura

- Node.js 22.x.
- PostgreSQL administrado por el servicio configurado para la API.
- `BackEnd/`: API, Prisma, pruebas y scripts.
- `FrontEnd/`: aplicación React/Vite.
- `docs/`: documentación técnica, pruebas y manual.

La instalación de dependencias se realiza en cada aplicación con `npm ci`.
Los comandos de desarrollo y pruebas locales se describen en la documentación
específica de cada carpeta.

## Arquitectura de producción

```text
Navegador
  -> Frontend estático publicado en /GestionDeIncidentes/
  -> API Node/Express en Render (HTTPS)
  -> PostgreSQL en Render
```

El backend limita CORS a `CLIENT_ORIGIN`, permite `Authorization`, activa
`trust proxy`, utiliza Helmet, rate limit, sanitización y logs con la cabecera
de autorización redactada. La conexión PostgreSQL usa SSL cuando la URL apunta a
un host externo de Render; la URL interna de producción no activa esa opción
explícita del adaptador.

## Despliegue de producción

Servicios desplegados:

- API: `https://gestiondeincidentes-49oe.onrender.com`
- Frontend: `https://diegoconstante.github.io/GestionDeIncidentes/`

Orden previsto:

1. Crear/configurar PostgreSQL y sus credenciales de aplicación con permisos
   solo de CRUD.
2. Configurar las variables del servicio API en Render.
3. Desplegar la API con `npm ci && npx prisma generate`, iniciar con `npm start`
   y comprobar `/health`.
4. Configurar `VITE_API_URL` con la raíz de la API, sin barra final.
5. Compilar y publicar el frontend con base `/GestionDeIncidentes/`.
6. Actualizar `CLIENT_ORIGIN` con el origen del frontend publicado y comprobar
   autenticación y CRUD.

La configuración de Render usa región Virginia, plan gratuito, `BackEnd` como
raíz, `/health` como health check, `NODE_ENV=production` y `APP_VERSION=1.0.0`.
No ejecuta migraciones automáticamente porque el usuario de aplicación no debe
tener permisos DDL. La aplicación debe recibir un esquema ya preparado.

## Variables de producción

| Variable | Dónde se configura | Forma esperada | Secreto |
|---|---|---|---|
| `DATABASE_URL` | Render, servicio API | URL interna PostgreSQL con usuario solo CRUD | Sí |
| `JWT_SECRET` | Render, servicio API | Clave nueva, larga y distinta de desarrollo | Sí |
| `CLIENT_ORIGIN` | Render, servicio API | Esquema y dominio del frontend, sin ruta ni barra final | No |
| `NODE_ENV` | `render.yaml` | `production` | No |
| `APP_VERSION` | `render.yaml` | `1.0.0` | No |
| `JWT_EXPIRES_IN` | Render si se sobrescribe | Duración aceptada por `jsonwebtoken`, por defecto `30m` | No |
| `PORT` | Render | Puerto proporcionado por la plataforma | No |
| `VITE_API_URL` | entorno de compilación del frontend | URL raíz de la API, sin barra final | No |

Los valores reales deben configurarse manualmente; no se guardan en el
repositorio.

## Comprobación

- `GET /health` debe responder `status: "ok"` y `version: "1.0.0"`.
- `GET /api/version` debe responder `version: "1.0.0"`.
- Las pruebas manuales de autenticación, CRUD, autorización por rol y
  disponibilidad de los endpoints operativos están registradas en
  [docs/PRUEBAS.md](docs/PRUEBAS.md). `APP_VERSION` está configurada en Render
  con el valor `1.0.0`.

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md)
- [API](docs/API.md)
- [Pruebas](docs/PRUEBAS.md)
- [Manual de usuario](docs/MANUAL_USUARIO.md)
- [Lecciones aprendidas](docs/LECCIONES_APRENDIDAS.md)
- [Frontend](FrontEnd/README.md)
