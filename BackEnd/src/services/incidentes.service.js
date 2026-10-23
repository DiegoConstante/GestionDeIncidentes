import prisma from "../config/prisma.js";

function crear(datos) {
  return prisma.incidente.create({ data: datos });
}

async function listar({ estado, prioridad, limite = 10, cursor }) {
  const take = Math.min(limite, 50); // tope de seguridad

  const items = await prisma.incidente.findMany({
    where: {
      // undefined hace que Prisma ignore el filtro.
      estado: estado || undefined,
      prioridad: prioridad || undefined,
    },
    // El id desempata incidentes creados en el mismo instante
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    take: take + 1, // uno extra para saber si hay más
    ...(cursor && { cursor: { id: cursor } }), // el cursor es inclusivo
  });

  const hasMore = items.length > take;
  const nextCursor = hasMore ? items[take].id : null;
  if (hasMore) items.pop(); // quita el registro extra

  return { items, nextCursor };
}

function buscarPorId(id) {
  return prisma.incidente.findUnique({ where: { id } });
}

function actualizar(id, datos) {
  return prisma.incidente.update({ where: { id }, data: datos });
}

function eliminar(id) {
  return prisma.incidente.delete({ where: { id } });
}

export { crear, listar, buscarPorId, actualizar, eliminar };
