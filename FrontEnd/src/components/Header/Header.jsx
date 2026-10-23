import { useState } from "react";
import "./Header.css";

export default function Header({ user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`header ${menuOpen ? "headerOpen" : ""}`}>
      {/* <div className="brand-mark" aria-hidden="true">
        IR
      </div> */}
      <div>
        <p className="eyebrow">Centro de operaciones</p>
        <h1>Gestión de incidentes</h1>
        <span className="userRole">{user.rol || "SIN ROL"}</span>
      </div>
      <button
        className="headerToggle"
        type="button"
        aria-expanded={menuOpen}
        aria-controls="main-navigation"
        aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
        onClick={() => setMenuOpen((current) => !current)}
      >
        <span />
        <span />
        <span />
      </button>
      <nav
        id="main-navigation"
        className="headerNav"
        aria-label="Navegación principal"
      >
        <a href="#incidentes" onClick={closeMenu}>
          Incidentes
        </a>
        <a href="#nuevo-incidente" onClick={closeMenu}>
          Nuevo incidente
        </a>
        <div className="userInfo">
          <button
            className="logoutBtn"
            type="button"
            onClick={onLogout}
            onClickCapture={closeMenu}
          >
            Cerrar sesión
          </button>
        </div>
      </nav>
    </header>
  );
}
