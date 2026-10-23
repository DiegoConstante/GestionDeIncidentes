# Lecciones aprendidas — BORRADOR

Documento pendiente de revisión del autor. Se basa únicamente en hechos
observables del código, pruebas y auditorías del proyecto.

## ¿Qué funcionó?

La separación entre frontend React, API Express y servicios Prisma permitió
probar la autenticación, el CRUD y los permisos por rol de forma independiente.
El verificador confirmó login, casos negativos, creación, consulta,
actualización, eliminación y rechazo de eliminación por ANALISTA.

**Acción futura:** conservar el verificador como comprobación previa a cada
despliegue y añadir su ejecución contra la URL pública cuando exista.

## ¿Qué dificultó el trabajo?

La documentación inicial no describía el proyecto real y existían diferencias
entre configuración y runtime: el Compose declara MySQL mientras Prisma usa
PostgreSQL, y los respaldos de `VITE_API_URL` no tienen la misma base en los dos
servicios del frontend. Además, el lint del frontend reporta cinco errores
existentes.

**Acción futura:** mantener una única fuente documentada para la configuración
de API y ejecutar lint/build del frontend como criterio de aceptación.

## ¿Qué haríamos diferente?

Preparar desde el inicio contratos de entorno separados para local y producción,
pruebas HTTP públicas y pruebas automatizadas del frontend. El código actual
guarda el JWT en `localStorage` y no tiene pruebas de componentes.

**Acción futura:** evaluar cookies HttpOnly y añadir pruebas de interfaz sin
alterar la autorización del backend.

## Matriz de retroalimentación

| Observación | Fuente | Tipo | Impacto | Esfuerzo | Decisión y razón | Acción |
|---|---|---|---|---|---|---|
| El frontend tenía README de plantilla | Auditoría documental | Defecto | Medio | Bajo | Aplicar ahora: no describía el sistema real | Mantener README específico del frontend |
| `VITE_API_URL` tiene respaldos distintos en los servicios | Auditoría de código | Defecto | Alto | Medio | Investigar: corregirlo requiere decidir el contrato de URL | Unificar la base de API y probar login/CRUD |
| Compose declara MySQL y Prisma usa PostgreSQL | Auditoría de configuración | Inconsistencia | Alto | Medio | Investigar: no cambiar infraestructura sin decisión | Definir el recurso local compatible |
| El token se guarda en `localStorage` | Auditoría de seguridad | Riesgo | Alto | Medio | Planificar: cambiar sesión afecta frontend y API | Evaluar cookie HttpOnly y mitigación XSS |
| ANALISTA puede modificar pero no eliminar | Auditoría funcional | Decisión de negocio | Alto | Bajo | Mantener: coincide con rutas y pruebas | Conservar autorización backend y ocultamiento visual |
| El lint del frontend tiene cinco errores | Validación técnica | Defecto | Medio | Medio | Planificar: son correcciones de código fuera de documentación | Corregir y volver a ejecutar lint |
| El plan gratuito puede dormir el servicio | Recurso Tema 16 / configuración Render | Riesgo operativo | Medio | Bajo | Aceptar con contingencia: corresponde al plan elegido | Informar al usuario y reintentar la primera solicitud |
