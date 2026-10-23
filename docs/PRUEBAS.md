# Pruebas

Casos de `development`, sin «Evidencia» ni capturas.

## Ejecución automatizada

Comando desde `BackEnd/`: `npm test`.

**Real:** aprobado: 3 suites, 12 pruebas, 0 snapshots; tiempo observado:
7.902 s. Node mostró la advertencia experimental de VM Modules.

## Casos Jest

### PF-01 Login válido
- **Precondición:** Jest y dependencias instalados.
- **Datos:** correo `" usuario@ejemplo.com "`, password `"contraseña-segura"`.
- **Pasos:** ejecutar el caso de `authSchema` que acepta credenciales.
- **Esperado:** éxito y correo recortado.
- **Real:** aprobado; el caso pasó dentro de las 12 pruebas.

### PF-02 Password corto
- **Precondición:** Jest instalado.
- **Datos:** `usuario@ejemplo.com`, password `corta`.
- **Pasos:** ejecutar el caso correspondiente de `schemas.test.js`.
- **Esperado:** `success: false`.
- **Real:** aprobado; el caso pasó dentro de las 12 pruebas.

### PF-03 Incidente válido
- **Precondición:** Jest instalado.
- **Datos:** título `Falla en el sistema`, descripción `El sistema presenta una falla intermitente.`, responsable `Ana Pérez`, prioridad `ALTA`.
- **Pasos:** ejecutar el caso de `incidenteSchema`.
- **Esperado:** `safeParse` exitoso.
- **Real:** aprobado; el caso pasó dentro de las 12 pruebas.

### PF-04 Prioridad inválida
- **Precondición:** Jest instalado.
- **Datos:** prioridad `URGENTE`.
- **Pasos:** ejecutar el caso de prioridad inexistente.
- **Esperado:** `success: false`.
- **Real:** aprobado; el caso pasó dentro de las 12 pruebas.

### PF-05 Detalles de validación
- **Precondición:** Jest instalado.
- **Datos:** cuerpo `{}` y esquema que requiere `nombre`.
- **Pasos:** ejecutar `validate.middleware.test.js`.
- **Esperado:** error 400, `Datos no válidos` y detalle `nombre`.
- **Real:** aprobado; el caso pasó dentro de las 12 pruebas.

### PF-06 Paginación
- **Precondición:** Jest instalado y mock de Prisma.
- **Datos:** 11 elementos simulados, límite 10, estado `ABIERTO`.
- **Pasos:** ejecutar el caso de paginación del servicio.
- **Esperado:** `take: 11`, 10 elementos y `nextCursor: 11`.
- **Real:** aprobado; el caso pasó dentro de las 12 pruebas.

### PF-07 Delegación a Prisma
- **Precondición:** Jest instalado y mock de Prisma.
- **Datos:** operaciones crear, buscar, actualizar y eliminar con ID 1.
- **Pasos:** ejecutar el `test.each` del servicio.
- **Esperado:** cada método Prisma es llamado y devuelve el valor simulado.
- **Real:** aprobado; el caso pasó dentro de las 12 pruebas.

## Casos HTTP del verificador

### PF-08 CRUD autenticado
- **Precondición:** API local, base disponible y cuenta ADMIN en variables de entorno.
- **Datos:** título `Incidente creado por verificación local`, descripción `Registro temporal para comprobar el CRUD local.`, responsable `Verificador local`, prioridad `MEDIA`, luego `ALTA`.
- **Pasos:** login, crear, consultar, actualizar y eliminar.
- **Esperado:** 200, 201, 200, 200 y 200; el registro se elimina en `finally`.
- **Real:** aprobado; `npm run verificar-entrega` finalizó con `CRUD, autenticación y casos negativos verificados.` Se comprobaron login 200, creación 201, consulta 200, actualización 200 y eliminación 200.

### PF-09 Login incorrecto
- **Precondición:** API local iniciada.
- **Datos:** correo de `DEMO_EMAIL` y password incorrecto generado por el script.
- **Pasos:** ejecutar `npm run verificar-entrega`.
- **Esperado:** 401 y `mensaje: "Credenciales inválidas"`.
- **Real:** aprobado; el verificador recibió 401 para el login con contraseña incorrecta y continuó correctamente.

### PF-10 Sin token
- **Precondición:** API local iniciada.
- **Datos:** GET `/api/incidentes` sin Authorization.
- **Pasos:** ejecutar el verificador.
- **Esperado:** 401 y `Token requerido`.
- **Real:** aprobado; el verificador recibió 401 para `GET /api/incidentes` sin token y continuó correctamente.

### PF-11 Datos inválidos
- **Precondición:** API local y cuenta autenticable.
- **Datos:** título `x`, descripción `corta`, responsable `x`, prioridad `URGENTE`.
- **Pasos:** ejecutar el verificador.
- **Esperado:** 400 con `Datos no válidos` y `detalles`.
- **Real:** aprobado; el verificador recibió 400 para el cuerpo inválido y continuó correctamente.

### PF-12 Rol insuficiente
- **Precondición:** cuenta ADMIN principal y cuenta ANALISTA en `DEMO_ANALISTA_EMAIL` y `DEMO_ANALISTA_PASSWORD`.
- **Datos:** ID temporal del CRUD y token ANALISTA.
- **Pasos:** intentar DELETE como ANALISTA; limpiar como ADMIN.
- **Esperado:** 403 y luego 200.
- **Real:** aprobado; el verificador recibió 403 al intentar eliminar con el token ANALISTA y luego eliminó el registro con ADMIN.

## Casos desde el navegador

### PF-13 Login y CRUD por rol
- **Precondición:** frontend y API locales iniciados; cuentas válidas con roles `ADMIN` y `ANALISTA`.
- **Datos:** credenciales correctas de ADMIN y ANALISTA; una credencial incorrecta; datos válidos de un incidente.
- **Pasos:** iniciar sesión con ADMIN; comprobar creación, consulta, actualización y eliminación. Cerrar sesión; repetir login y CRUD con ANALISTA. Intentar iniciar sesión con una credencial incorrecta.
- **Esperado:** ADMIN y ANALISTA pueden iniciar sesión y completar el CRUD; solo ADMIN puede eliminar; una credencial incorrecta no permite iniciar sesión.
- **Real:** aprobado; el login funcionó con las credenciales correctas de ADMIN y ANALISTA. Ambos roles completaron creación, consulta y actualización; únicamente ADMIN pudo eliminar. Al ingresar una credencial incorrecta no se realizó el login.