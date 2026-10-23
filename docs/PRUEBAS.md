# Pruebas de producción

No se incluyen capturas ni el campo «Evidencia». Las URLs públicas se completan
después del despliegue:

- API: **[POR COMPLETAR TRAS EL DESPLIEGUE: URL de la API]**
- Frontend: **[POR COMPLETAR TRAS EL DESPLIEGUE: URL del frontend]**

## Preparación

Configurar manualmente en Render `DATABASE_URL`, `JWT_SECRET` y
`CLIENT_ORIGIN`; configurar `VITE_API_URL` en el entorno de compilación del
frontend. No escribir credenciales, tokens ni secretos en este documento.

## Casos públicos pendientes

### PP-01 Health check
- **Precondición:** API desplegada y URL pública disponible.
- **Datos:** URL de la API.
- **Pasos:** ejecutar `GET /health`.
- **Esperado:** HTTPS, código 200, `status: "ok"` y `version: "1.0.0"`.
- **Real:** NO EJECUTADO.

### PP-02 Versión
- **Precondición:** API desplegada.
- **Datos:** URL de la API.
- **Pasos:** ejecutar `GET /api/version`.
- **Esperado:** HTTPS, código 200 y `version: "1.0.0"`.
- **Real:** NO EJECUTADO.

### PP-03 Login
- **Precondición:** API y usuario de demostración disponibles.
- **Datos:** credenciales proporcionadas al ejecutar, no almacenadas.
- **Pasos:** enviar `POST /api/auth/login` por HTTPS.
- **Esperado:** código 200, JWT y perfil con rol.
- **Real:** NO EJECUTADO.

### PP-04 CRUD autenticado
- **Precondición:** PP-03 aprobado y usuario ADMIN.
- **Datos:** incidente temporal válido con título, descripción, responsable y prioridad.
- **Pasos:** crear, consultar, actualizar y eliminar por HTTPS.
- **Esperado:** 201, 200, 200 y 200; eliminar el registro temporal.
- **Real:** NO EJECUTADO.

### PP-05 Rol insuficiente
- **Precondición:** usuario ANALISTA autenticado y un incidente temporal.
- **Datos:** token ANALISTA.
- **Pasos:** intentar eliminar el incidente por HTTPS.
- **Esperado:** 403 `Permiso insuficiente`; la limpieza debe hacerla ADMIN.
- **Real:** NO EJECUTADO.

### PP-06 Frontend publicado
- **Precondición:** frontend compilado con `VITE_API_URL` y publicado bajo
  `/GestionDeIncidentes/`.
- **Datos:** URL pública del frontend.
- **Pasos:** abrir la URL, iniciar sesión con ADMIN y ANALISTA y realizar los
  recorridos de creación, consulta, actualización y eliminación por rol.
- **Esperado:** recursos cargados bajo la ruta base; solo ADMIN elimina.
- **Real:** NO EJECUTADO.

## Pruebas ya ejecutadas en desarrollo

Las pruebas Jest, el verificador CRUD, el smoke test local y la comprobación
manual del frontend están documentadas como aprobadas en el informe T1S8.

**La evidencia de ejecución está en el informe T1S8.**
