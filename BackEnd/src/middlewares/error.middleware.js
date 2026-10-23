function noEncontrado(req, res, next) {
  const error = new Error("Ruta no encontrada");
  error.status = 404;
  next(error);
}

function manejarError(error, req, res, next) {
  const requestId = req.id;
  req.log.error({ err: error, requestId }, "request_failed");

  if (error.code === "P2025") {
    return res
      .status(404)
      .json({ error: "Incidente no encontrado", requestId });
  }

  if (error.status === 400) {
    return res.status(400).json({
      error: error.message,
      detalles: error.detalles || [],
      requestId,
    });
  }

  const statusCode = error.status || 500;
  const esProduccion = process.env.NODE_ENV === "production";
  const mensaje =
    error.status && (error.status >= 400 && error.status < 500)
      ? error.message
      : esProduccion
        ? "Error interno del servidor"
        : error.message || "No fue posible completar la operación";

  res.status(statusCode).json({ error: mensaje, requestId });
}

export { noEncontrado, manejarError };
