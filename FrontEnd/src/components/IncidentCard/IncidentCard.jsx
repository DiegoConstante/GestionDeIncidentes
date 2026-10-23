import {
  formatDate,
  priorityLabels,
  statusLabels,
} from "../../utils/incidentUtils";
import "./IncidentCard.css";

export default function IncidentCard({ incident, onSelect, onDelete, userRole }) {
  // Mostrar el botón de eliminar solo para usuarios con rol ADMIN
  // Manejar casos donde userRole podría ser null, undefined, o tener espacios/case diferente
  const showDeleteButton = userRole?.trim().toUpperCase() === "ADMIN";

  return (
    <article
      className={`incidentCard p${incident.prioridad[0]}${incident.prioridad.slice(1).toLowerCase()}`}
      tabIndex="0"
      aria-label={`Ver detalle del incidente ${incident.titulo}`}
      onClick={() => onSelect(incident)}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect(incident);
        }
      }}
    >
      <div className="cardMain">
        <div className="cardHead">
          <span className="cardDot" aria-hidden="true" />
          <span
            className={`cardPriority cardText${incident.prioridad[0]}${incident.prioridad.slice(1).toLowerCase()}`}
          >
            {priorityLabels[incident.prioridad] || incident.prioridad}
          </span>
          <span className="cardId"># INC-{incident.id}</span>
        </div>
        <p className="cardTitle">{incident.titulo}</p>
        <span className="cardMeta">
          {incident.responsable} · {formatDate(incident.createdAt)}
        </span>
        <span className="cardStatus cardState">
          {statusLabels[incident.estado] || incident.estado}
        </span>
      </div>
      {showDeleteButton && (
        <button
          className="cardRemove"
          type="button"
          aria-label={`Eliminar ${incident.titulo}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(incident);
          }}
        >
          Eliminar incidente
        </button>
      )}
    </article>
  );
}
