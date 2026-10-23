// Servicio de autenticación que comunica con el backend API
// Usa JWT para autenticación y maneja tokens en localStorage

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export function authenticate(email, password) {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      const data = await response.json();

      // Guardar el token en localStorage
      localStorage.setItem(
        "incidentAppAuth",
        JSON.stringify({
          user: data.usuario,
          token: data.token,
          isAuthenticated: true,
        }),
      );

      resolve(data.usuario);
    } catch (error) {
      reject(error);
    }
  });
}

export function logout() {
  // Eliminar el token del localStorage
  localStorage.removeItem("incidentAppAuth");
  return Promise.resolve();
}

export function getToken() {
  const auth = localStorage.getItem("incidentAppAuth");
  if (!auth) return null;
  try {
    return JSON.parse(auth).token;
  } catch {
    return null;
  }
}

export function getTokenExpiration(token = getToken()) {
  if (!token) return null;

  try {
    const payload = token.split(".")[1];
    if (!payload) return null;

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decodedPayload = JSON.parse(atob(normalizedPayload));
    return typeof decodedPayload.exp === "number"
      ? decodedPayload.exp * 1000
      : null;
  } catch {
    return null;
  }
}

export function getCurrentUser() {
  const auth = localStorage.getItem("incidentAppAuth");
  if (!auth) return null;
  try {
    const parsed = JSON.parse(auth);
    return parsed.user;
  } catch {
    return null;
  }
}

export function isAuthenticated() {
  const auth = localStorage.getItem("incidentAppAuth");
  if (!auth) return false;
  try {
    const parsed = JSON.parse(auth);
    return parsed.isAuthenticated === true && !!parsed.token;
  } catch {
    return false;
  }
}

const originalFetch = window.fetch;

window.fetch = async function (...args) {
  const [resource, config = {}] = args;

  // Si la petición va dirigida a nuestra API, inyectamos el token automáticamente
  if (typeof resource === "string" && resource.includes("/api/")) {
    const token = getToken();
    config.headers = {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(config.headers || {}),
    };
  }

  // Ejecutamos la petición HTTP normal
  const response = await originalFetch(resource, config);

  // LA CLAVE: Si el backend responde con 401 (Token expirado / No autorizado)
  if (response.status === 401) {
    logout(); // 1. Borra los datos de la sesión del localStorage
    window.location.href = "/"; // 2. Redirige inmediatamente a la vista de login
    throw new Error(
      "Su sesión ha expirado. Por favor, inicie sesión nuevamente.",
    );
  }

  return response;
};

// Inicializar desde localStorage al cargar
let initialAuthState = { user: null, isAuthenticated: false, token: null };
try {
  const stored = localStorage.getItem("incidentAppAuth");
  if (stored) {
    const parsed = JSON.parse(stored);
    initialAuthState = {
      user: parsed.user,
      isAuthenticated: parsed.isAuthenticated,
      token: parsed.token,
    };
  }
} catch {}

export { initialAuthState };
