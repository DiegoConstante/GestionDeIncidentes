import { describe, expect, test } from "@jest/globals";
import authSchema from "../src/schemas/auth.schema.js";
import incidenteSchema from "../src/schemas/incidentes.schema.js";

describe("authSchema", () => {
  test("acepta un correo y una contraseña válidos", () => {
    const result = authSchema.safeParse({
      correo: " usuario@ejemplo.com ",
      password: "contraseña-segura",
    });

    expect(result.success).toBe(true);
    expect(result.data.correo).toBe("usuario@ejemplo.com");
  });

  test("rechaza contraseñas demasiado cortas", () => {
    const result = authSchema.safeParse({
      correo: "usuario@ejemplo.com",
      password: "corta",
    });

    expect(result.success).toBe(false);
  });
});

describe("incidenteSchema", () => {
  test("acepta un incidente con sus campos requeridos", () => {
    const result = incidenteSchema.safeParse({
      titulo: "Falla en el sistema",
      descripcion: "El sistema presenta una falla intermitente.",
      responsable: "Ana Pérez",
      prioridad: "ALTA",
    });

    expect(result.success).toBe(true);
  });

  test("rechaza una prioridad que no existe", () => {
    const result = incidenteSchema.safeParse({
      titulo: "Falla en el sistema",
      descripcion: "El sistema presenta una falla intermitente.",
      responsable: "Ana Pérez",
      prioridad: "URGENTE",
    });

    expect(result.success).toBe(false);
  });
});
