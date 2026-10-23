import "dotenv/config";

const requeridas = ["DATABASE_URL", "JWT_SECRET", "CLIENT_ORIGIN"];
const faltantes = requeridas.filter((nombre) => !process.env[nombre]);

if (faltantes.length > 0) {
  throw new Error(
    `Faltan variables de entorno requeridas: ${faltantes.join(", ")}`,
  );
}

const config = {
  port: process.env.PORT || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  appVersion: process.env.APP_VERSION || "local",
  databaseUrl: process.env.DATABASE_URL,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "30m",
  clientOrigin: process.env.CLIENT_ORIGIN,
};

export default config;
