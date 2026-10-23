import bcrypt from "bcryptjs";
import prisma from "../config/prisma.js";
import { crearToken } from "../utils/incidentes.token.js";

export async function login(req, res, next) {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res
        .status(400)
        .json({ mensaje: "El correo y la contraseña son requeridos" });
    }

    // 1. Buscar el usuario en la base de datos usando la instancia compartida de Prisma
    const usuario = await prisma.usuario.findUnique({
      where: { correo },
    });

    // 2. Validar credenciales
    const coincide =
      usuario && (await bcrypt.compare(password, usuario.passwordHash));

    if (!coincide) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // 3. Generar token de autenticación
    const token = crearToken({
      id: usuario.id,
      correo: usuario.correo,
      rol: usuario.rol,
    });

    // 4. Responder con la información pública del usuario
    return res.json({
      token,
      usuario: {
        id: usuario.id,
        correo: usuario.correo,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    next(error);
  }
}
