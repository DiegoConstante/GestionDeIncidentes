import { describe, expect, jest, test } from "@jest/globals";
import { validar } from "../src/middlewares/validate.middleware.js";

describe("validar", () => {
  const schema = {
    safeParse: (body) =>
      body.nombre
        ? { success: true, data: { nombre: body.nombre.trim() } }
        : {
            success: false,
            error: { issues: [{ path: ["nombre"], message: "Requerido" }] },
          },
  };

  test("reemplaza el cuerpo por los datos validados", () => {
    const req = { body: { nombre: " Ana " } };
    const next = jest.fn();

    validar(schema)(req, {}, next);

    expect(req.body).toEqual({ nombre: "Ana" });
    expect(next).toHaveBeenCalledWith();
  });

  test("propaga un error con detalles cuando la validación falla", () => {
    const next = jest.fn();

    validar(schema)({ body: {} }, {}, next);

    const error = next.mock.calls[0][0];
    expect(error).toMatchObject({
      message: "Datos no válidos",
      status: 400,
      detalles: [{ campo: "nombre", mensaje: "Requerido" }],
    });
  });
});
