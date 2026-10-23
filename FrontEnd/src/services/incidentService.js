import { getToken } from "./authService";

const API_URL = `${import.meta.env.VITE_API_URL}/api/incidentes`;

// Obtención del token
function getTokenFromStorage() {
  return getToken();
}

async function request(path = "", options = {}) {
  try {
    const token = getTokenFromStorage();

    const headers = { "Content-Type": "application/json", ...options.headers };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const details = data.detalles?.map((item) => item.mensaje).join(", ");
      const message =
        details ||
        data.error ||
        data.mensaje ||
        "No se pudo completar la solicitud.";
      throw new Error(`Error ${response.status}: ${message}`);
    }
    return data;
  } catch (error) {
    if (!error.message.startsWith("Error ")) {
      console.error("Error de red o servidor no disponible:", error);
      throw new Error(
        "El servidor no se encuentra disponible o hubo un problema de red.",
        { cause: error },
      );
    }
    throw error;
  }
}

export function listIncidents(filters = {}) {
  const params = new URLSearchParams();
  if (filters.prioridad) params.set("prioridad", filters.prioridad);
  if (filters.estado) params.set("estado", filters.estado);
  if (filters.cursor != null) params.set("cursor", filters.cursor);
  const query = params.toString();
  return request(query ? `?${query}` : "");
}

export function getIncident(id) {
  return request(`/${id}`);
}

export function createIncident(incident) {
  return request("", { method: "POST", body: JSON.stringify(incident) });
}

export function updateIncident(id, incident) {
  return request(`/${id}`, { method: "PUT", body: JSON.stringify(incident) });
}

export function deleteIncident(id) {
  return request(`/${id}`, { method: "DELETE" });
}
