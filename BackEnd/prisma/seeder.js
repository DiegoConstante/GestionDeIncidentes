import bcrypt from "bcryptjs";
import prisma from "../src/config/prisma.js";

async function creacionDeUsuarios() {
  console.log("Iniciando seeder de usuarios...");

  // Configura aquí el usuario que deseas inicializar en la base de datos
  const NUEVO_USUARIO = {
    correo: "@demo.local", // Ingresa el correo a crear
    passwordPlana: "", // Ingresa la contraseña para el usuario
    rol: " ", // Ingresa el rol del usuario (puede ser "ADMIN" o "ANALISTA")
  };

  // Cifrar la contraseña con bcrypt
  const passwordHash = await bcrypt.hash(NUEVO_USUARIO.passwordPlana, 12);

  // Crear o actualizar en la base de datos
  const usuarioCreado = await prisma.usuario.upsert({
    where: { correo: NUEVO_USUARIO.correo },
    update: {
      passwordHash: passwordHash,
      rol: NUEVO_USUARIO.rol,
    },
    create: {
      correo: NUEVO_USUARIO.correo,
      passwordHash: passwordHash,
      rol: NUEVO_USUARIO.rol,
    },
  });

  console.log("Usuario sembrado con éxito:");
  console.log({
    correo: usuarioCreado.correo,
    rol: usuarioCreado.rol,
  });
}

creacionDeUsuarios()
  .catch((e) => {
    console.error("Error en el seeder:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
