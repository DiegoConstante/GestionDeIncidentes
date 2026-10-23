import { z } from "zod";

const loginSchema = z.object({
  correo: z.string().trim().email(),
  password: z.string().min(10).max(100),
});

export default loginSchema;
