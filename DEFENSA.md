# Guion de defensa — 10 minutos

La demostración se realizará sobre los servicios desplegados. No se incluyen
capturas ni referencias a un informe de evidencias.

| Momento | Tiempo | Contenido | Evidencia |
|---|---:|---|---|
| Problema y alcance | 1 min | Gestión autenticada de incidentes para ADMIN y ANALISTA | Aplicación y modelo `Incidente` |
| Arquitectura | 1 min | Frontend estático, API Express y PostgreSQL | `docs/ARQUITECTURA.md` |
| Demostración | 4 min | Login, listado, filtro, búsqueda, creación, edición y eliminación por rol | Aplicación desplegada |
| Calidad y operación | 2 min | Jest, verificador, smoke, JWT, CORS, rate limit y endpoints operativos | `docs/PRUEBAS.md` |
| Límites y cierre | 2 min | Plan gratuito, `localStorage`, migraciones separadas y mejoras | Lecciones aprendidas |

## Guion

### Problema y alcance — 1 minuto

La aplicación centraliza el registro y seguimiento de incidentes. ADMIN y
ANALISTA se autentican; ambos consultan, crean y actualizan, mientras solo
ADMIN elimina.

### Arquitectura — 1 minuto

El frontend React/Vite se publica como estático bajo
`/GestionDeIncidentes/`. La API Express ejecuta autenticación JWT, validación
Zod, middlewares de seguridad y controladores; Prisma persiste en PostgreSQL.

### Demostración — 4 minutos

1. Mostrar login correcto y el rol visible.
2. Mostrar listado, filtro por prioridad y búsqueda por ID.
3. Crear un incidente con título, descripción, responsable y prioridad.
4. Abrir el detalle y cambiar el estado.
5. Repetir la vista con ANALISTA y mostrar que no puede eliminar.
6. Mostrar eliminación exitosa con ADMIN.
7. Mostrar una credencial incorrecta y un dato inválido.

### Calidad y operación — 2 minutos

Las pruebas Jest verifican schemas, middleware y servicio. El script de entrega
prueba login incorrecto, ausencia de token, datos inválidos, CRUD y rol
insuficiente. El smoke test consulta `/health` y `/api/version`. En producción
la API usa HTTPS del proveedor, CORS limitado al frontend, `Authorization`
permitido, rate limit y logs que redactan el token.

### Límites y cierre — 2 minutos

El plan gratuito puede suspender el servicio; el primer request puede tardar.
La base de datos puede tener vencimiento del proveedor a los 30 días según el
plan contratado: **POR CONFIRMAR**. El JWT está en `localStorage` y no hay
pruebas automatizadas de componentes. Las mejoras quedan registradas en el
documento de lecciones.

## Respuestas preparadas

### ¿Cómo se protegen las rutas?

Las rutas de incidentes pasan por `autenticar`, que exige Bearer JWT y verifica
la firma y expiración. `permitir("ADMIN")` protege DELETE. Los cuerpos pasan por
Zod; Helmet, CORS, rate limit, sanitización y el límite JSON reducen superficie
de ataque. La autorización real está en el backend, no solo en la interfaz.

### ¿Qué ocurre si falla la base?

La operación entra al middleware de errores, se registra con `requestId` y se
devuelve el formato de error correspondiente. En producción los errores
internos no exponen detalles. El health check no ejecuta una consulta Prisma,
por lo que puede responder correctamente aunque la base falle: esto es una
limitación observable y **POR CONFIRMAR** si se requiere un health check de
dependencia.

### ¿Cómo se revierte un despliegue?

Se debe volver manualmente a la versión estable anterior del servicio y del
frontend en la plataforma elegida, verificando `/health`, `/api/version` y el
login. El procedimiento exacto de rollback del proveedor no está configurado
en el repositorio: **POR CONFIRMAR**.

### ¿Qué prueba ofrece mayor confianza?

El verificador de entrega ofrece la mayor confianza funcional porque combina
autenticación, casos negativos, CRUD y autorización por rol contra una API real,
y elimina el registro temporal. Se complementa con el smoke test y la prueba
manual del navegador documentados en `docs/PRUEBAS.md`.

## Plan de contingencia

- **Servicio dormido en plan gratuito:** esperar la activación y reintentar; no
  interpretar el primer timeout como fallo funcional sin una segunda prueba.
- **Base con vencimiento a los 30 días:** **POR CONFIRMAR** según el proveedor;
  revisar el estado y respaldo antes de la fecha límite.
- **Falla durante la demostración en vivo:** explicar el último resultado
  verificable y mostrar los contratos/documentos sin inventar una respuesta del
  servicio.
