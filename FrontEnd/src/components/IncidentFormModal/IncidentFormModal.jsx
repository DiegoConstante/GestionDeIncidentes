import { useEffect, useRef, useState } from "react";
import "./IncidentFormModal.css";
import StatusMessage from "../StatusMessage/StatusMessage";
import { useFeedback } from "../../hooks/statusMessage";

const initialForm = {
  titulo: "",
  descripcion: "",
  responsable: "",
  prioridad: "",
};

export default function IncidentFormModal({ open, onClose, onSubmit, busy }) {
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const [form, setForm] = useState(initialForm);
  const { feedback, showError, clear } = useFeedback();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
    if (open) firstFieldRef.current?.focus();
  }, [open]);

  // Cierra, limpia el formulario y borra cualquier mensaje
  function handleClose() {
    setForm(initialForm);
    clear();
    onClose();
  }

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await onSubmit(form);
      handleClose();
    } catch (error) {
      showError(error.message); // el modal sigue abierto y conserva los datos
    }
  }

  return (
    <dialog
      ref={dialogRef}
      className="formModal"
      onCancel={handleClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) handleClose();
      }}
      aria-labelledby="new-incident-title"
    >
      <div className="formHeader">
        <div>
          <p className="eyebrow">Registro operativo</p>
          <h2 id="new-incident-title">Nuevo incidente</h2>
        </div>
        <button
          className="formClose"
          type="button"
          aria-label="Cerrar formulario"
          onClick={handleClose}
        >
          <span aria-hidden="true">&#10005;</span>
        </button>
      </div>
      <form className="formBody" onSubmit={handleSubmit}>
        <div className="formGrid">
          <div className="formField formWide">
            <label htmlFor="incident-title">
              Título <span aria-hidden="true">*</span>
            </label>
            <input
              ref={firstFieldRef}
              id="incident-title"
              name="titulo"
              value={form.titulo}
              onChange={updateField}
              required
              minLength={5}
              maxLength={120}
              aria-required="true"
              aria-describedby="title-help"
            />
            <small id="title-help">Describe el evento en una frase.</small>
          </div>
          <div className="formField">
            <label htmlFor="incident-priority">
              Prioridad <span aria-hidden="true">*</span>
            </label>
            <select
              id="incident-priority"
              name="prioridad"
              value={form.prioridad}
              onChange={updateField}
              required
              aria-required="true"
              aria-describedby="priority-help"
            >
              <option value="" disabled>
                Seleccione una prioridad
              </option>
              <option value="CRITICA">Crítica</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>
            <small id="priority-help">Nivel de atención requerido.</small>
          </div>
          <div className="formField">
            <label htmlFor="incident-owner">
              Responsable <span aria-hidden="true">*</span>
            </label>
            <input
              id="incident-owner"
              name="responsable"
              value={form.responsable}
              onChange={updateField}
              required
              minLength={4}
              maxLength={100}
              aria-required="true"
              aria-describedby="owner-help"
            />
            <small id="owner-help">Mínimo 4 caracteres.</small>
          </div>
          <div className="formField formWide">
            <label htmlFor="incident-description">
              Descripción <span aria-hidden="true">*</span>
            </label>
            <textarea
              id="incident-description"
              name="descripcion"
              value={form.descripcion}
              onChange={updateField}
              required
              minLength={10}
              maxLength={2000}
              rows="5"
              aria-required="true"
              aria-describedby="description-help"
            />
            <small id="description-help">
              Incluye contexto y alcance del incidente.
            </small>
          </div>
          <StatusMessage message={feedback.message} error={feedback.error} />
        </div>
        <div className="formActions">
          <button
            className="formBtn formSecondary"
            type="button"
            onClick={handleClose}
          >
            Cancelar
          </button>
          <button className="formBtn formPrimary" type="submit" disabled={busy}>
            {busy ? "Guardando..." : "Registrar incidente"}
          </button>
        </div>
      </form>
    </dialog>
  );
}
