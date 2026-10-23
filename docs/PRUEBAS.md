# Pruebas de producción

No se incluyen capturas, grabaciones ni el campo «Evidencia». Las pruebas
manuales descritas a continuación se realizaron contra los servicios
desplegados:

- API: `https://gestiondeincidentes-49oe.onrender.com`
- Frontend: `https://diegoconstante.github.io/GestionDeIncidentes/`

## Preparación

Configurar manualmente en Render `DATABASE_URL`, `JWT_SECRET` y
`CLIENT_ORIGIN`; configurar `VITE_API_URL` en el entorno de compilación del
frontend. No escribir credenciales, tokens ni secretos en este documento.

## Casos públicos ejecutados

### PP-01 Health check

- **Precondición:** API desplegada y URL pública disponible.
- **Datos:** URL de la API.
- **Pasos:** ejecutar `GET /health`.
- **Esperado:** HTTPS, código 200, `status: "ok"` y `version: "1.0.0"`.
- **Real:** APROBADO. Respondió por HTTPS con código 200, `status: "ok"`,
  `version: "1.0.0"` y un `timestamp` válido.

### PP-02 Versión

- **Precondición:** API desplegada.
- **Datos:** URL de la API.
- **Pasos:** ejecutar `GET /api/version`.
- **Esperado:** HTTPS, código 200 y `version: "1.0.0"`.
- **Real:** APROBADO. Respondió por HTTPS con código 200 y
  `version: "1.0.0"`.

### PP-03 Login

- **Precondición:** API y usuario de demostración disponibles.
- **Datos:** credenciales proporcionadas al ejecutar, no almacenadas.
- **Pasos:** enviar `POST /api/auth/login` por HTTPS.
- **Esperado:** código 200, JWT y perfil con rol.
- **Real:** APROBADO. Se probó autenticación con credenciales correctas y
  rechazo de credenciales incorrectas.

### PP-04 CRUD autenticado

- **Precondición:** PP-03 aprobado y usuario ADMIN.
- **Datos:** incidente temporal válido con título, descripción, responsable y prioridad.
- **Pasos:** crear, consultar, actualizar y eliminar por HTTPS.
- **Esperado:** 201, 200, 200 y 200; eliminar el registro temporal.
- **Real:** APROBADO. Se realizaron creación, consulta, actualización y
  eliminación de incidentes autenticado como ADMIN.

### PP-05 Rol insuficiente

- **Precondición:** usuario ANALISTA autenticado y un incidente temporal.
- **Datos:** token ANALISTA.
- **Pasos:** intentar eliminar el incidente por HTTPS.
- **Esperado:** 403 `Permiso insuficiente`; la limpieza debe hacerla ADMIN.
- **Real:** APROBADO. Se verificó que un ANALISTA no puede eliminar y que la
  eliminación corresponde únicamente a ADMIN.

### PP-06 Frontend publicado

- **Precondición:** frontend compilado con `VITE_API_URL` y publicado bajo
  `/GestionDeIncidentes/`.
- **Datos:** URL pública del frontend.
- **Pasos:** abrir la URL, iniciar sesión con ADMIN y ANALISTA y realizar los
  recorridos de creación, consulta, actualización y eliminación por rol.
- **Esperado:** recursos cargados bajo la ruta base; solo ADMIN elimina.
- **Real:** APROBADO. Se verificaron los recorridos de autenticación y CRUD en
  el frontend publicado, incluyendo la restricción de eliminación por rol.

## Observaciones

La variable `APP_VERSION` está configurada en Render con el valor `1.0.0`.
Tampoco se incluyen pruebas automatizadas de componentes del frontend porque
el proyecto no las define.

Las pruebas automatizadas del backend y los comandos locales siguen siendo
validaciones complementarias; no sustituyen las comprobaciones manuales
realizadas contra producción.
