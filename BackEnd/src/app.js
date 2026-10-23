import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import pinoHttp from "pino-http";
import sanitizeHtml from "sanitize-html";

import env from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import incidentesRoutes from "./routes/incidentes.routes.js";
import { noEncontrado, manejarError } from "./middlewares/error.middleware.js";

const app = express();

app.set("trust proxy", 1);

app.use(
  pinoHttp({
    redact: ["req.headers.authorization"],
  }),
);

app.use(helmet());

app.use(
  cors({
    origin: env.clientOrigin,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(
  rateLimit({
    windowMs: 60_000, // 1 minuto
    limit: 100, // Máximo 100 peticiones por minuto
  }),
);

app.use(express.json({ limit: "20kb" }));

app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === "string") {
        req.body[key] = sanitizeHtml(req.body[key], {
          allowedTags: [],
          allowedAttributes: {},
        }).trim();
      }
    }
  }
  next();
});

app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    version: env.appVersion,
    timestamp: new Date().toISOString(),
  });
});

app.get("/api/version", (req, res) => {
  res.json({ version: env.appVersion });
});

app.use("/api/auth", authRoutes);
app.use("/api/incidentes", incidentesRoutes);

app.use(noEncontrado);

app.use(manejarError);

export default app;
