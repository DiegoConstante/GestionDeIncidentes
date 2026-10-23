const priorities = [
  { value: "", label: "Todas las prioridades" },
  { value: "CRITICA", label: "Crítica" },
  { value: "ALTA", label: "Alta" },
  { value: "MEDIA", label: "Media" },
  { value: "BAJA", label: "Baja" },
];

import "./ActionBar.css";

export default function ActionBar({ filter, onFilterChange, onOpenSearch }) {
  return (
    <div className="actionBar">
      <div>
        <p className="eyebrow">Bandeja de entrada</p>
        <h2 id="incidentes-heading">Incidentes recientes</h2>
      </div>
      <div className="actionControls">
        <button className="searchButton" type="button" onClick={onOpenSearch}>
          Buscar incidente por ID
        </button>
        <label htmlFor="priority-filter">Filtrar por prioridad</label>
        <select
          className="priorityFilter"
          id="priority-filter"
          value={filter}
          onChange={(event) => onFilterChange(event.target.value)}
        >
          {priorities.map((priority) => (
            <option key={priority.value} value={priority.value}>
              {priority.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
