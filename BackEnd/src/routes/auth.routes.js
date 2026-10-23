import { Router } from "express";
import { login } from "../controllers/auth.controllers.js";
import { validar } from "../middlewares/validate.middleware.js";
import loginSchema from "../schemas/auth.schema.js";

const routes = Router();

routes.post("/login", validar(loginSchema), login);

export default routes;
