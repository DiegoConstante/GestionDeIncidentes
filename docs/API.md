# API

En producción la base será **[POR COMPLETAR TRAS EL DESPLIEGUE: URL de la API]**.
En local el puerto depende de `PORT`.

## Respuestas y acceso

Los errores generales usan `{ "error": "..." }`. Los errores 400 de Zod agregan
`detalles: [{ campo, mensaje }]` y los errores manejados pueden agregar
`requestId`. El login usa `mensaje` para credenciales inválidas.

Todas las rutas de incidentes requieren `Authorization: Bearer <JWT>`.
`ADMIN` y `ANALISTA` pueden consultar, crear y actualizar; solo `ADMIN` elimina.

## Rutas públicas

| Método | Ruta | Respuesta |
|---|---|---|
| GET | `/health` | 200: `{ status: "ok", version, timestamp }` |
| GET | `/api/version` | 200: `{ version }` |
| POST | `/api/auth/login` | 200: `{ token, usuario: { id, correo, rol } }` |

Login recibe `correo` email y `password` de 10 a 100 caracteres. Datos inválidos
responden 400. Credenciales incorrectas responden 401 con
`{ "mensaje": "Credenciales inválidas" }`.

## Incidentes

### `GET /api/incidentes`

Acepta `estado`, `prioridad`, `limite` y `cursor`. `limite` es entero positivo,
por defecto 6 y con máximo efectivo 50. Responde:

```json
{ "items": [], "nextCursor": null }
```

### `GET /api/incidentes/:id`

Responde 200 con el incidente; ID no numérico 400 e inexistente 404.

### `POST /api/incidentes`

Body:

```json
{
  "titulo": "Falla en el sistema",
  "descripcion": "El sistema presenta una falla intermitente.",
  "responsable": "Ana Pérez",
  "prioridad": "ALTA",
  "estado": "ABIERTO"
}
```

`titulo` (5-120), `descripcion` (10-2000) y `responsable` (4-100) son
obligatorios. `prioridad` y `estado` son opcionales. Responde 201.

### `PUT /api/incidentes/:id`

Usa el mismo esquema que POST, por lo que los tres campos obligatorios deben
enviarse también al actualizar. Responde 200; ID inválido 400; inexistente 404.

### `DELETE /api/incidentes/:id`

Solo ADMIN. Responde 200 con `{ "id": <número> }`; ID inválido 400 e inexistente
404. Sin token o token inválido: 401. Rol insuficiente: 403.

## Errores de autenticación

- Sin Bearer: 401, `Token requerido`.
- JWT inválido o vencido: 401, `Token inválido o vencido`.
- Rol no permitido: 403, `Permiso insuficiente`.
- Ruta inexistente: 404, `Ruta no encontrada`.

## Frontend

`VITE_API_URL` debe contener únicamente la raíz de la API, sin barra final.
`authService.js` agrega `/api/auth/login` y `incidentService.js` agrega
`/api/incidentes`.