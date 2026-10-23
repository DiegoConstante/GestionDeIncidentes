import { useEffect, useRef, useState } from "react";
import "./IncidentSearchModal.css";
import StatusMessage from "../StatusMessage/StatusMessage";
import { useFeedback } from "../../hooks/statusMessage";

export default function IncidentSearchModal({ open, onClose, onSearch, busy }) {
  const dialogRef = useRef(null);
  const inputRef = useRef(null);
  const [searchId, setSearchId] = useState("");
  const { feedback, showError, clear } = useFeedback();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) inputRef.current?.focus();
  }, [open]);

  function handleClose() {
    setSearchId("");
    clear();
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await onSearch(searchId);
      handleClose(); // solo se cierra si encontró el incidente
    } catch (error) {
      showError(error.message); // si no existe, se queda abierto con el error
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="searchModal"
      onCancel={handleClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
      aria-labelledby="search-incident-title"
    >
      <div className="searchHeader">
        <div>
          <p className="eyebrow">Consulta operativa</p>
          <h2 id="search-incident-title">Buscar incidente por ID</h2>
        </div>
        <button
          className="searchClose"
          type="button"
          aria-label="Cerrar búsqueda"
          onClick={handleClose}
        >
          <span aria-hidden="true">&#10005;</span>
        </button>
      </div>
      <form className="searchForm" onSubmit={handleSubmit}>
        <div className="searchField">
          <label htmlFor="search-incident-id">ID del incidente</label>
          <input
            ref={inputRef}
            id="search-incident-id"
            type="text"
            inputMode="numeric"
            value={searchId}
            onChange={(event) =>
              setSearchId(event.target.value.replace(/\D/g, ""))
            }
            placeholder="ID 1"
            required
            aria-required="true"
            aria-describedby="search-incident-help"
          />
          <small id="search-incident-help">
            Ingresa el ID numérico del incidente que deseas consultar.
          </small>
        </div>
        <StatusMessage message={feedback.message} error={feedback.error} />
        <div className="searchActions">
          <button
            className="searchBtn searchSecondary"
            type="button"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button
            className="searchBtn searchPrimary"
            type="submit"
            disabled={busy}
          >
            {busy ? "Buscando..." : "Buscar"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
