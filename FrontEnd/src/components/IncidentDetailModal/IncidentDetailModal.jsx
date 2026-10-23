import { useEffect, useRef, useState } from "react";
import {
  formatDate,
  priorityLabels,
  statusLabels,
} from "../../utils/incidentUtils";
import "./IncidentDetailModal.css";
import StatusMessage from "../StatusMessage/StatusMessage";
import { useFeedback } from "../../hooks/statusMessage";

export default function IncidentDetailModal({
  incident,
  onClose,
  onUpdate,
  busy,
}) {
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const [status, setStatus] = useState(incident?.estado || "ABIERTO");
  const { feedback, showSuccess, showError, clear } = useFeedback(10000);

  useEffect(() => {
    if (incident) {
      setStatus(incident.estado);
    }
  }, [incident]);

  // Limpia el mensaje solo al cambiar de incidente (o al cerrar).
  // Se usa el id y no el objeto, porque tras actualizar el objeto cambia
  // y borraría el mensaje de éxito justo después de mostrarlo.
  useEffect(() => {
    clear();
  }, [incident?.id, clear]);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (!dialog) return;
    if (incident && !dialog.open) dialog.showModal();
    if (!incident && dialog.open) dialog.close();
    if (incident) closeRef.current?.focus();
  }, [incident]);

  if (!incident) return <dialog ref={dialogRef} className="detailModal" />;

  async function saveStatus(event) {
    event.preventDefault();
    try {
      await onUpdate({ ...incident, estado: status });
      showSuccess("Estado actualizado correctamente.");
    } catch (error) {
      showError(error.message);
    }
  }

  const priorityKey = `${incident.prioridad[0]}${incident.prioridad.slice(1).toLowerCase()}`;

  return (
    <dialog
      ref={dialogRef}
      key={incident.id}
      className="detailModal"
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="incident-detail-title"
    >
      <div className="detailHeader">
        <div>
          <p className="eyebrow">Ficha del incidente</p>
          <h2 id="incident-detail-title">{incident.titulo}</h2>
        </div>
        <button
          ref={closeRef}
          className="detailClose"
          type="button"
          aria-label="Cerrar detalle"
          onClick={onClose}
        >
          <span aria-hidden="true">&#10005;</span>
        </button>
      </div>
      <div className="detailContent">
        <div className="detailRow">
          <span className={`detailChip detailP${priorityKey}`}>
            Prioridad - #{priorityLabels[incident.prioridad]}
          </span>
          <span className="detailId"># INC-{incident.id}</span>
        </div>
        <p className="detailDescription">{incident.descripcion}</p>
        <dl className="detailList">
          <div>
            <dt>Responsable</dt>
            <dd>{incident.responsable}</dd>
          </div>
          <div>
            <dt>Creado</dt>
            <dd>{formatDate(incident.createdAt)}</dd>
          </div>
          <div>
            <dt>Actualizado</dt>
            <dd>{formatDate(incident.updatedAt)}</dd>
          </div>
        </dl>
        <span className="detailStatus">{statusLabels[incident.estado]}</span>
        <StatusMessage message={feedback.message} error={feedback.error} />
        <form onSubmit={saveStatus} className="detailForm">
          <label htmlFor="incident-status">Cambiar estado</label>
          <select
            id="incident-status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="ABIERTO">Abierto</option>
            <option value="EN_PROCESO">En proceso</option>
            <option value="CERRADO">Cerrado</option>
          </select>
          <button
            className="detailBtn detailPrimary"
            type="submit"
            disabled={busy}
          >
            {busy ? "Actualizando..." : "Guardar estado"}
          </button>
        </form>
      </div>
    </dialog>
  );
}
