import jwt from "jsonwebtoken";
import env from "../config/env.js";

// Crea un token JWT para un usuario
export function crearToken(usuario) {
  return jwt.sign({ sub: usuario.id, rol: usuario.rol }, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
}

// Verifica el token JWT para el usuario que inició la sesión
export function verificarToken(token) {
  return jwt.verify(token, env.jwtSecret);
}
