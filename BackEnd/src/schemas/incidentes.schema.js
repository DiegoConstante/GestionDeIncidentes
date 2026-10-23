import { z } from "zod";

const incidenteSchema = z.object({
  titulo: z.string().trim().min(5).max(120),
  descripcion: z.string().trim().min(10).max(2000),
  responsable: z.string().trim().min(4).max(100),
  prioridad: z.enum(["BAJA", "MEDIA", "ALTA", "CRITICA"]).optional(),
  estado: z.enum(["ABIERTO", "EN_PROCESO", "CERRADO"]).optional(),
});

export default incidenteSchema;
