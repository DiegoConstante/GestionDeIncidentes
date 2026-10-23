import app from "./app.js";
import prisma from "./config/prisma.js";
import env from "./config/env.js";

const puerto = Number(env.port);
const servidor = app.listen(puerto, "0.0.0.0", () => {
  console.log(`Servidor disponible en el puerto ${puerto}`);
});

async function cerrarServidor() {
  servidor.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", cerrarServidor);
process.on("SIGTERM", cerrarServidor);
