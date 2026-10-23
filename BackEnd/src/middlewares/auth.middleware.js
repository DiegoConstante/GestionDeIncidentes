import { verificarToken } from "../utils/incidentes.token.js";

// Autenticar y verificar el token de la solicitud
function autenticar(req, res, next) {
  const valor = req.headers.authorization || "";
  const [tipo, token] = valor.split(" ");
  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({ error: "Token requerido" });
  }
  try {
    req.usuario = verificarToken(token);
    next();
  } catch {
    res.status(401).json({ error: "Token inválido o vencido" });
  }
}

// Permitir solo usuarios con rols especificados
function permitir(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.usuario.rol)) {
      return res.status(403).json({ error: "Permiso insuficiente" });
    }
    next();
  };
}

export { autenticar, permitir };
