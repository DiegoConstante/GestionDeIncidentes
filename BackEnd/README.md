# Backend: pruebas, optimización y refactorización

## Introducción

Este laboratorio fortalece la calidad de la plataforma de incidentes mediante
pruebas automatizadas, análisis estático, medición de cobertura, corrección de
defectos y refactorización del módulo de incidentes bajo el patrón MVC.

Las pruebas y el análisis estático no modifican el código existente: solo lo
verifican. Las correcciones y la refactorización sí lo modifican, y las pruebas
comprueban que el comportamiento funcional se mantiene (sin regresiones).

## Requisitos

- Node.js versión: v24.21.0 o superior.
- Dependencias instaladas con `npm install` en la carpeta `BackEnd`.
- Las pruebas unitarias no requieren MariaDB, porque Prisma se simula con mocks.

## Defectos corregidos con DevTools

| Defecto                                                               | Causa                                  | Corrección                                                                                                                                     |
| --------------------------------------------------------------------- | -------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| Credenciales de demostración visibles en `Login.jsx`                  | Texto estático en el componente        | Se eliminó el bloque con las credenciales                                                                                                      |
| Mensajes de estado duplicados y modales que se cerraban ante un error | Feedback centralizado en `App.jsx`     | Hook reutilizable `statusMessage` en `src/hooks/`; cada modal gestiona su propio mensaje, permanece abierto ante un fallo y conserva los datos |
| Sesión abierta tras vencer el JWT (30 min)                            | El cliente no gestionaba la expiración | Temporizador en el cliente basado en la propiedad `exp` del JWT que cierra la sesión y redirige al login                                       |

## Seeder de usuarios

El script `prisma/seed.js` crea usuarios con la contraseña cifrada con bcrypt.
Para usarlo:

1. Editar en el archivo el correo, la contraseña y el rol (`ADMIN` o `ANALISTA`).
2. Ejecutar:

```bash
   npx prisma db seed
```

## Refactorización MVC: paginación por cursor

El listado de incidentes devolvía todos los registros en una sola consulta. Se
refactorizó el módulo separando responsabilidades:

- **Controller:** valida y convierte los parámetros `limite` y `cursor`.
- **Service (`listar`):** aplica el límite (10 por defecto, máximo 50) y devuelve
  `{ items, nextCursor }`. Solicita un registro adicional para saber si existen
  más resultados.
- **Vista (frontend):** `listIncidents` envía el cursor y `App.jsx` muestra 10
  incidentes con el botón "Cargar 10 más", que agrega los siguientes y se oculta
  cuando no quedan más.

### Mediciones antes y después

Se midió `GET /incidentes` con 1.008 incidentes sintéticos:

| Métrica                | Antes (sin paginación) | Después (10 registros) |
| ---------------------- | ---------------------- | ---------------------- |
| Registros devueltos    | 1.008                  | 10                     |
| Tamaño de respuesta    | 488,88 KB              | 4,85 KB                |
| Tiempo de la solicitud | 325 – 455 ms           | 15 – 28 ms             |
| Tiempo de la consulta  | 88 – 125 ms            | 1 – 3 ms               |

La plataforma no utiliza imágenes, por lo que esa medición no aplica.

## Pruebas unitarias

### Comandos

Se añadieron tres scripts en `package.json`:

| Comando                 | Qué hace                                               |
| ----------------------- | ------------------------------------------------------ |
| `npm test`              | Ejecuta las pruebas unitarias con Jest                 |
| `npm run test:coverage` | Ejecuta las pruebas y genera el reporte en `coverage/` |
| `npm run lint`          | Análisis estático con ESLint                           |

Jest se ejecuta con `--experimental-vm-modules` (el backend usa
`"type": "module"`) y con `--runInBand` para obtener un resultado estable.

### Qué se prueba

Las pruebas están en `BackEnd/tests/`:

- `schemas.test.js`: esquemas de autenticación e incidentes (Zod). Verifica que
  los datos correctos sean aceptados y que se rechacen contraseñas demasiado
  cortas o prioridades fuera del dominio permitido.
- `validate.middleware.test.js`: el middleware de validación. Verifica que los
  datos transformados reemplacen a `req.body` y que, ante un error, se genere
  una respuesta con mensaje, estado HTTP y detalle del campo afectado.
- `incidentes.service.test.js`: el servicio de incidentes con Prisma simulado
  mediante un mock de Jest. Verifica crear, consultar, actualizar y eliminar,
  además de la paginación: límite, registro adicional y cálculo del cursor.

## Análisis estático con ESLint

ESLint usa el formato plano en `eslint.config.js`, con las reglas recomendadas y
el entorno de Node.js y módulos ES. Se excluyen `node_modules` y `coverage`. Desde
la primera ejecución no reportó incidencias. Complementa a Jest: Jest valida el
comportamiento y ESLint revisa la calidad del código (variables sin usar,
errores de sintaxis, incumplimiento de reglas).

## Reporte de cobertura

`npm run test:coverage` genera el reporte en `coverage/` (carpeta incluida en
`.gitignore`). Resultados de la ejecución:

- Sentencias: 100 %
- Líneas: 100 %
- Funciones: 100 %
- Ramas: 84,61 %

La cobertura de ramas es menor porque algunos caminos alternativos de decisión
no se recorren en todos los escenarios unitarios.

## Guía de ejecución

1. Ubicarse en la carpeta del backend:

```bash
   cd BackEnd
```

2. Instalar las dependencias (antes de la primera ejecución o tras cambiar
   `package.json`):

```bash
   npm install
```

3. Ejecutar las pruebas. Resultado esperado: 3 suites y 12 pruebas aprobadas.

```bash
   npm test
```

4. Ejecutar el análisis estático. Si no hay problemas, termina sin errores.

```bash
   npm run lint
```

5. Generar el reporte de cobertura:

```bash
   npm run test:coverage
```

## Resultados de la validación

`npm test` aprobó las 12 pruebas a la primera, `npm run lint` finalizó sin
errores y `npm run test:coverage` generó el reporte sin errores. Estas
verificaciones sirven de base para futuras optimizaciones: cualquier cambio puede
compararse con el comportamiento ya validado.

## Despliegue y monitoreo

El backend valida al iniciar que existan `DATABASE_URL`, `JWT_SECRET` y
`CLIENT_ORIGIN`. Si falta alguna, el proceso termina indicando todas las
variables ausentes. `DATABASE_URL` debe ser la URL interna de PostgreSQL en
Render; para desarrollo local se puede usar la URL externa con
`?sslmode=require`. El adaptador PostgreSQL conserva la configuración SSL
necesaria para ambos casos.

Endpoints operativos:

- `GET /health`: devuelve `status`, `version` y `timestamp`.
- `GET /api/version`: devuelve la versión desplegada.

Los logs HTTP usan Pino y asignan un ID a cada solicitud. El header
`Authorization` se redacta antes de escribirlo. Los errores centralizados
incluyen `requestId`; en producción los errores 500 devuelven un mensaje
genérico, aunque el detalle completo queda en los logs del servidor.

### Prueba de humo

Desde `BackEnd`, con el backend accesible: API_URL = "http://localhost:3000"

```powershell
npm run smoke
```

Para Render, sustituye la URL por la URL pública del servicio. El comando
termina con código `1` si `/health` o `/api/version` no responden 200.

### Variables de Render

El Blueprint `render.yaml` configura `NODE_ENV=production` y `APP_VERSION`.
Completa manualmente en el panel:

- `DATABASE_URL`: Internal Database URL de PostgreSQL.
- `JWT_SECRET`: secreto JWT seguro.
- `CLIENT_ORIGIN`: origen exacto del frontend, incluyendo protocolo y puerto
  cuando corresponda.

No se declara una base de datos en el Blueprint porque la instancia ya existe.

### Comprobación controlada de un error 500

Para probarlo localmente, añade temporalmente antes del middleware
`noEncontrado` en `src/app.js`:

```js
app.get("/debug/error-500", () => {
  throw new Error("Fallo controlado de prueba");
});
```

Ejecuta el backend con `NODE_ENV=production` y solicita
`GET /debug/error-500`. La respuesta debe ser 500 con `error: "Error interno
del servidor"` y `requestId`, sin incluir el texto del error. En los logs
aparecerán `requestId`, la traza y el mensaje para localizar la solicitud.
Elimina esa ruta temporal después de la comprobación y reinicia el servicio.
