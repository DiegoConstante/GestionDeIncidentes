# Gestión de incidentes

Aplicación local para autenticar usuarios y administrar incidentes mediante una API
Express/Prisma y una interfaz React/Vite.

## Alcance de ramas

- `development`: trabajo local de los desarrolladores.
- `main`: versión lista para desplegar.
- El flujo va únicamente de `development` hacia `main`.

Este README describe el trabajo local de `development`; no contiene URLs ni
instrucciones de producción.

## Requisitos e instalación

- Node.js 22.x.
- PostgreSQL accesible localmente.
- Dependencias instaladas en `BackEnd/` y `FrontEnd/`.
- Variables de `BackEnd/.env` configuradas a partir de `BackEnd/.env.example`.

```powershell
cd BackEnd
npm install
cd ..\FrontEnd
npm install
```

El backend requiere `DATABASE_URL`, `JWT_SECRET` y `CLIENT_ORIGIN`. También
admite `PORT`, `NODE_ENV`, `APP_VERSION` y `JWT_EXPIRES_IN`. No se guardan
secretos en el repositorio ni se ejecuta el seeder como parte de este flujo.

## Comandos

Desde `BackEnd/`: `npm run dev`, `npm start`, `npm test`,
`npm run test:coverage`, `npm run lint`, `npm run smoke` y
`npm run verificar-entrega`.

El smoke test requiere `API_URL` y comprueba `/health` y `/api/version`. El
verificador requiere `API_URL`, `DEMO_EMAIL`, `DEMO_PASSWORD` y, para el caso
de rol insuficiente, `DEMO_ANALISTA_EMAIL` y `DEMO_ANALISTA_PASSWORD`. Las
credenciales solo se pasan al ejecutar.

Desde `FrontEnd/`: `npm run dev`, `npm run build`, `npm run lint` y
`npm run preview`. El cliente usa `VITE_API_URL`; `CLIENT_ORIGIN` define el
origen permitido por CORS.

## Estructura

```text
BackEnd/src/       aplicación, rutas, controladores, servicios y middlewares
BackEnd/prisma/    schema y migraciones PostgreSQL
BackEnd/tests/     pruebas Jest unitarias
BackEnd/scripts/   smoke y verificación CRUD/autenticación
FrontEnd/src/      interfaz React y servicios HTTP
docs/              documentación técnica y de pruebas
```

## Documentación

- [Arquitectura](docs/ARQUITECTURA.md)
- [API](docs/API.md)
- [Pruebas](docs/PRUEBAS.md)