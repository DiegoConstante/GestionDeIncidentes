# Frontend de gestión de incidentes

Frontend React/Vite que consume la API Express mediante login JWT y operaciones
de incidentes. En producción se publica como sitio estático bajo
`/GestionDeIncidentes/`.

## Configuración y ejecución

Desde `FrontEnd/`:

```bash
npm ci
npm run dev
npm run build
npm run lint
npm run preview
```

`VITE_API_URL` llega únicamente por el entorno de compilación y debe contener la
URL raíz de la API, sin barra final. El nombre está documentado en
`.env.example`; no se guarda el valor real. El código no mantiene un respaldo
local: si falta esta variable, la configuración de compilación queda
**POR CONFIRMAR**.

La configuración de Vite usa:

```text
/GestionDeIncidentes/
```

No existe `BrowserRouter` ni rutas internas de React. Los enlaces son anclas
(`#incidentes` y `#nuevo-incidente`), por lo que la base de Vite es suficiente
para los recursos estáticos y no requiere `HashRouter` ni `basename`.

## Stack y estructura

- React y React DOM: componentes y renderizado.
- Vite: desarrollo y compilación.
- Fetch API: comunicación HTTP.
- ESLint: análisis estático.
- `localStorage`: sesión y JWT.
- `dialog` nativo: formularios, detalle y búsqueda.

```text
src/
  App.jsx                 Estado de sesión, incidentes y operaciones.
  main.jsx                Montaje de React en #root.
  components/             Login, cabecera, lista, tarjetas y modales.
  services/authService.js Login, JWT, localStorage y respuesta 401.
  services/incidentService.js CRUD de incidentes y errores HTTP.
  hooks/statusMessage.js  Mensajes de éxito y error.
  utils/incidentUtils.js  Etiquetas de enums y fechas.
  *.css                   Estilos globales y por componente.
```

## Seguridad y límites

El token se guarda en `localStorage` bajo `incidentAppAuth`; un 401 elimina la
sesión y vuelve al login. El botón de eliminar solo se muestra para ADMIN, pero
la autorización real se aplica en la API. Un 403 conserva la sesión y muestra el
error de permisos.

El almacenamiento en `localStorage` puede exponer el token ante XSS y no se usan
cookies HttpOnly. No existen pruebas automatizadas de frontend en `package.json`;
la validación actual del frontend es manual sobre el sitio publicado.
