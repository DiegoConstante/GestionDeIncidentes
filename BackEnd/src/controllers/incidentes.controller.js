import {
  crear,
  listar,
  buscarPorId,
  actualizar,
  eliminar,
} from "../services/incidentes.service.js";

async function listarIncidentes(req, res, next) {
  const { estado, prioridad } = req.query;

  const limite = req.query.limite === undefined ? 6 : Number(req.query.limite);
  const cursor =
    req.query.cursor === undefined ? undefined : Number(req.query.cursor);

  if (!Number.isInteger(limite) || limite < 1) {
    return res
      .status(400)
      .json({ error: "El límite proporcionado no es válido" });
  }
  if (cursor !== undefined && !Number.isInteger(cursor)) {
    return res
      .status(400)
      .json({ error: "El cursor proporcionado no es válido" });
  }

  try {
    const resultado = await listar({ estado, prioridad, limite, cursor });
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

async function buscarIncidente(req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID proporcionado no es válido" });
  }

  try {
    const incidente = await buscarPorId(id);
    if (!incidente) {
      return res.status(404).json({ error: "Incidente no encontrado" });
    }
    res.json(incidente);
  } catch (error) {
    next(error);
  }
}

async function crearIncidente(req, res, next) {
  try {
    const incidente = await crear(req.body);
    res.status(201).json(incidente);
  } catch (error) {
    next(error);
  }
}

async function actualizarIncidente(req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID proporcionado no es válido" });
  }

  try {
    const incidente = await actualizar(id, req.body);
    res.json(incidente);
  } catch (error) {
    next(error);
  }
}

async function eliminarIncidente(req, res, next) {
  const id = Number(req.params.id);
  if (isNaN(id)) {
    return res.status(400).json({ error: "El ID proporcionado no es válido" });
  }

  try {
    await eliminar(id);
    res.json({ id });
  } catch (error) {
    next(error);
  }
}

export {
  listarIncidentes,
  buscarIncidente,
  crearIncidente,
  actualizarIncidente,
  eliminarIncidente,
};
