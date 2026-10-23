import IncidentCard from "../IncidentCard/IncidentCard";
import "./IncidentList.css";

export default function IncidentList({
  incidents,
  loading,
  onSelect,
  onDelete,
  userRole,
}) {
  if (loading) return <p className="incidentEmpty">Cargando incidentes...</p>;
  if (!incidents.length)
    return <p className="incidentEmpty">No hay incidentes para este filtro.</p>;

  const sortedIncidents = [...incidents];

  return (
    <div
      className="incidentGrid"
      role="region"
      aria-live="polite"
      aria-label="Lista de incidentes"
    >
      {sortedIncidents.map((incident) => (
        <IncidentCard
          key={incident.id}
          incident={incident}
          onSelect={onSelect}
          onDelete={onDelete}
          userRole={userRole}
        />
      ))}
    </div>
  );
}
