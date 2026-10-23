import { useCallback, useEffect, useState } from "react";
import Header from "./components/Header/Header";
import ActionBar from "./components/ActionBar/ActionBar";
import IncidentList from "./components/IncidentList/IncidentList";
import IncidentFormModal from "./components/IncidentFormModal/IncidentFormModal";
import IncidentDetailModal from "./components/IncidentDetailModal/IncidentDetailModal";
import IncidentSearchModal from "./components/IncidentSearchModal/IncidentSearchModal";
import Footer from "./components/Footer/Footer";
import StatusMessage from "./components/StatusMessage/StatusMessage";
import Login from "./components/Login/Login";
import {
  createIncident,
  deleteIncident,
  getIncident,
  listIncidents,
  updateIncident,
} from "./services/incidentService";
import {
  getTokenExpiration,
  logout,
  initialAuthState,
} from "./services/authService";
import { useFeedback } from "./hooks/statusMessage";
import "./App.css";

function App() {
  const [auth, setAuth] = useState(initialAuthState);
  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [filter, setFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [nextCursor, setNextCursor] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  // Mensajes de la vista principal (los modales tienen los suyos)
  const { feedback, showSuccess, showError, clear } = useFeedback(10000);

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    try {
      const { items, nextCursor } = await listIncidents({ prioridad: filter });
      setIncidents(items);
      setNextCursor(nextCursor);
      clear();
    } catch (error) {
      showError(error.message);
    } finally {
      setLoading(false);
    }
  }, [filter, clear, showError]);

  async function loadMore() {
    setLoadingMore(true);
    try {
      const { items, nextCursor: next } = await listIncidents({
        prioridad: filter,
        cursor: nextCursor,
      });
      setIncidents((current) => [...current, ...items]);
      setNextCursor(next);
    } catch (error) {
      showError(error.message);
    } finally {
      setLoadingMore(false);
    }
  }

  useEffect(() => {
    if (!auth.isAuthenticated) return;

    const timer = setTimeout(() => {
      loadIncidents();
    }, 0);
    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, loadIncidents]);

  // Si el usuario no está autenticado, mostrar la pantalla de login
  useEffect(() => {
    if (!auth.isAuthenticated) return undefined;
    //
    const expiration = getTokenExpiration();
    if (expiration === null) {
      return undefined;
    }

    const remainingTime = Math.max(0, expiration - Date.now());
    const timer = setTimeout(handleLogout, remainingTime);

    return () => clearTimeout(timer);
  }, [auth.isAuthenticated]);

  function handleLogin(user) {
    setAuth({ user, isAuthenticated: true });
  }

  function handleLogout() {
    logout().finally(() => {
      setAuth({ user: null, isAuthenticated: false });
      setIncidents([]);
      setSelectedIncident(null);
    });
  }

  // Los handlers de modales NO capturan errores: los lanzan
  // y cada modal decide cómo mostrarlos.

  async function handleCreate(incident) {
    setBusy(true);
    try {
      await createIncident(incident);
      await loadIncidents();
      showSuccess("Incidente registrado correctamente."); // vista principal
    } finally {
      setBusy(false);
    }
  }

  async function handleSearch(id) {
    const normalizedId = String(id).trim();
    if (!normalizedId) throw new Error("Ingresa un ID para buscar.");

    setBusy(true);
    try {
      setSelectedIncident(await getIncident(normalizedId));
    } finally {
      setBusy(false);
    }
  }

  async function handleUpdate(incident) {
    setBusy(true);
    try {
      const updated = await updateIncident(incident.id, incident);
      setSelectedIncident(updated);
      setIncidents((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } finally {
      setBusy(false);
    }
  }

  // La eliminación se dispara desde la lista (vista principal),
  // por eso su mensaje sí se muestra en la vista principal.
  async function handleDelete(incident) {
    if (!window.confirm(`¿Eliminar el incidente "${incident.titulo}"?`)) return;
    try {
      await deleteIncident(incident.id);
      setSelectedIncident(null);
      await loadIncidents();
      showSuccess("Incidente eliminado.");
    } catch (error) {
      showError(error.message);
    }
  }

  // Si el usuario no está autenticado, mostrar la pantalla de login
  if (!auth.isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="app">
      <Header
        user={auth.user}
        onLogout={handleLogout}
        onCreate={() => setFormOpen(true)}
      />
      <main className="appMain">
        <StatusMessage message={feedback.message} error={feedback.error} />
        <div className="appActions">
          <button
            className="appBtn appPrimary appNewBtn"
            id="nuevo-incidente"
            type="button"
            onClick={() => setFormOpen(true)}
          >
            Nuevo incidente
          </button>
        </div>
        <section id="incidentes" aria-labelledby="incidentes-heading">
          <ActionBar
            filter={filter}
            onFilterChange={setFilter}
            onOpenSearch={() => setSearchOpen(true)}
          />
          <IncidentList
            incidents={incidents}
            loading={loading}
            onSelect={setSelectedIncident}
            onDelete={handleDelete}
            userRole={auth.user?.rol}
          />
          {nextCursor && (
            <div className="loadMoreContainer">
              <button
                className="LoadMoreBtn"
                type="button"
                onClick={loadMore}
                disabled={loadingMore}
              >
                {loadingMore ? "Cargando..." : "Cargar 10 más"}
              </button>
            </div>
          )}
        </section>
      </main>
      <Footer />
      <IncidentFormModal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleCreate}
        busy={busy}
      />
      <IncidentDetailModal
        incident={selectedIncident}
        onClose={() => setSelectedIncident(null)}
        onUpdate={handleUpdate}
        busy={busy}
      />
      <IncidentSearchModal
        open={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSearch={handleSearch}
        busy={busy}
      />
    </div>
  );
}

export default App;
