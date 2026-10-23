// Función para validar el esquema de los datos enviados por el cliente.
function validar(schema) {
  return (req, res, next) => {
    const resultado = schema.safeParse(req.body);
    if (!resultado.success) {
      const error = new Error("Datos no válidos");
      error.status = 400;
      error.detalles = resultado.error.issues.map((item) => ({
        campo: item.path.join("."),
        mensaje: item.message,
      }));
      return next(error);
    }
    req.body = resultado.data;
    next();
  };
}

export { validar };
