import { Router } from "express";
import {
  listarIncidentes,
  buscarIncidente,
  crearIncidente,
  actualizarIncidente,
  eliminarIncidente,
} from "../controllers/incidentes.controller.js";
import { autenticar, permitir } from "../middlewares/auth.middleware.js";
import { validar } from "../middlewares/validate.middleware.js";
import incidenteSchema from "../schemas/incidentes.schema.js";

const routes = Router();

// Proteger todas las rutas del CRUD con JWT
routes.use(autenticar);

// Todos los usuarios autenticados (ADMIN y ANALISTA) pueden consultar y registrar
routes.get("/", listarIncidentes);
routes.get("/:id", buscarIncidente);
routes.post("/", validar(incidenteSchema), crearIncidente);
routes.put("/:id", validar(incidenteSchema), actualizarIncidente);

// Solo usuarios con rol ADMIN pueden eliminar registros
routes.delete("/:id", permitir("ADMIN"), eliminarIncidente);

export default routes;
