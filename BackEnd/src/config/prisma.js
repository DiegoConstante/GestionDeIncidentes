import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL no está definida");
}

const url = new URL(databaseUrl);

// La URL externa de Render (host *.render.com) exige SSL; la interna no.
const usaSsl = url.hostname.endsWith(".render.com");

// Quitamos sslmode de la URL para que no choque con la opción ssl de abajo.
url.searchParams.delete("sslmode");

const adapter = new PrismaPg({
  connectionString: url.toString(),
  ssl: usaSsl ? { rejectUnauthorized: false } : false,
});

const prisma = new PrismaClient({ adapter });

export default prisma;
