# Arquitectura

La documentación corresponde a `development` y al uso local. El proyecto separa
un frontend React/Vite de un backend Node.js/Express. El backend persiste en
PostgreSQL mediante Prisma 7 y `@prisma/adapter-pg`.

## Flujo

1. El frontend obtiene un JWT en `POST /api/auth/login` y lo guarda en
   `localStorage` como `incidentAppAuth`.
2. Envía `Authorization: Bearer <token>` a las rutas de incidentes.
3. Express aplica pino-http (redacta autorización), Helmet, CORS, rate limit,
   JSON de 20 KB y sanitización HTML sin etiquetas.
4. El router autentica; Zod valida; el controlador convierte IDs y delega al
   servicio; Prisma persiste.
5. El middleware de errores construye la respuesta HTTP.

## Capas

- `src/server.js`: arranque y cierre ordenado.
- `src/app.js`: middlewares, health check y routers.
- `src/routes/`: métodos HTTP, validación y permisos.
- `src/controllers/`: parámetros y respuestas.
- `src/services/`: operaciones Prisma y paginación.
- `src/middlewares/`: JWT, roles, validación y errores.
- `src/schemas/`: contratos Zod.
- `src/config/`: entorno y cliente Prisma.
- `src/utils/`: JWT.

## Datos

`Usuario` tiene correo único, hash, rol y fechas. `Incidente` tiene título,
descripción, responsable, prioridad, estado y fechas. Los enums son `ADMIN` y
`ANALISTA`; `BAJA`, `MEDIA`, `ALTA`, `CRITICA`; y `ABIERTO`, `EN_PROCESO`,
`CERRADO`. Hay índices para estado y prioridad.

## Decisiones y límites

- JWT con expiración configurable; el token contiene `sub` y `rol`.
- Listados con máximo 50 elementos y cursor.
- CORS restringido a `CLIENT_ORIGIN` y rate limit de 100 solicitudes por minuto.
- El frontend vuelve al login al recibir 401.
- No se confirmaron pruebas de componentes React ni HTTP end-to-end: **POR CONFIRMAR**.
- `BackEnd/docker-compose.yml` declara MySQL, pero código, `.env.example` y
  Prisma usan PostgreSQL: **POR CONFIRMAR** como flujo válido.