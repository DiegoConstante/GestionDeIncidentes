# Manual de usuario

Manual orientado a tareas para el frontend de gestión de incidentes.

## Iniciar sesión

**Objetivo:** entrar al panel de incidentes.

**Precondición:** contar con una cuenta válida ADMIN o ANALISTA y tener
disponible el frontend.

**Pasos:**

1. Abrir la aplicación.
2. Escribir el correo.
3. Escribir la contraseña.
4. Seleccionar «Iniciar sesión».

**Resultado:** se muestra el panel con el rol de la cuenta.

**Solución de problemas:** revisar correo y contraseña; si el servicio tarda en
responder, esperar y reintentar porque el plan gratuito de Render puede
despertar el servicio después de un periodo inactivo. Si continúa el error,
confirmar que la API esté disponible.

## Consultar y filtrar incidentes

**Objetivo:** revisar incidentes recientes o localizar uno por ID.

**Precondición:** sesión iniciada.

**Pasos:**

1. Revisar la lista de incidentes.
2. Elegir una prioridad en «Filtrar por prioridad», o dejar «Todas».
3. Para una consulta exacta, seleccionar «Buscar incidente por ID».
4. Escribir el ID numérico y seleccionar «Buscar».
5. Seleccionar una tarjeta para abrir el detalle.

**Resultado:** se muestran las tarjetas filtradas o el detalle del incidente.

**Solución de problemas:** un ID inexistente genera un mensaje de error; una
lista sin coincidencias muestra «No hay incidentes para este filtro». Si tarda,
esperar la respuesta y volver a intentar.

## Crear un incidente

**Objetivo:** registrar un nuevo incidente.

**Precondición:** sesión iniciada como ADMIN o ANALISTA.

**Pasos:**

1. Seleccionar «Nuevo incidente».
2. Completar título, prioridad, responsable y descripción.
3. Seleccionar «Registrar incidente».

**Resultado:** el incidente se crea y aparece en la lista.

**Solución de problemas:** título mínimo 5 caracteres, responsable mínimo 4 y
descripción mínima 10; revisar el mensaje de validación. Si el servicio tarda,
esperar y reintentar sin cerrar el formulario.

## Actualizar el estado

**Objetivo:** cambiar el estado de un incidente.

**Precondición:** sesión iniciada y un incidente visible.

**Pasos:**

1. Abrir el incidente.
2. Elegir `ABIERTO`, `EN_PROCESO` o `CERRADO`.
3. Seleccionar «Guardar estado».

**Resultado:** el estado actualizado se muestra en el detalle y en la tarjeta.

**Solución de problemas:** revisar el mensaje mostrado; un error 401 requiere
iniciar sesión de nuevo y un 403 indica permiso insuficiente.

## Eliminar un incidente

**Objetivo:** eliminar un registro.

**Precondición:** sesión iniciada como ADMIN.

**Pasos:**

1. Ubicar la tarjeta del incidente.
2. Seleccionar «Eliminar incidente».
3. Confirmar el diálogo del navegador.

**Resultado:** el incidente se elimina y la lista se actualiza.

**Solución de problemas:** ANALISTA no ve el botón y la API rechaza la operación
con 403. Si el servicio tarda, esperar; si recibe 401, volver a iniciar sesión.

## Cerrar sesión

**Objetivo:** terminar la sesión manualmente.

**Precondición:** sesión iniciada.

**Pasos:** seleccionar «Cerrar sesión».

**Resultado:** se limpian los datos visibles y vuelve el formulario de login.
El mismo resultado ocurre automáticamente cuando vence el JWT.

**Solución de problemas:** si la sesión desaparece durante una operación, volver
a iniciar sesión y repetirla.
