import { useState } from "react";
import { authenticate } from "../../services/authService";
import "./Login.css";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Por favor, complete todos los campos");
      return;
    }

    setIsLoading(true);

    try {
      const user = await authenticate(email, password);
      onLogin(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="loginContainer">
      <div className="loginBox">
        <div className="loginHeader">
          <h1>Gestión de Incidentes</h1>
          <p>Inicie sesión para acceder al sistema</p>
        </div>

        <form className="loginForm" onSubmit={handleSubmit} noValidate>
          {error && <div className="errorMessage">{error}</div>}

          <div className="formGroup">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              disabled={isLoading}
              autoComplete="email"
              required
            />
          </div>

          <div className="formGroup">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              disabled={isLoading}
              autoComplete="current-password"
              required
            />
          </div>

          <button type="submit" className="loginButton" disabled={isLoading}>
            {isLoading ? "Iniciando sesión..." : "Iniciar sesión"}
          </button>
        </form>
      </div>
    </div>
  );
}
