import { beforeEach, describe, expect, jest, test } from "@jest/globals";

const prismaMock = {
  incidente: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

jest.unstable_mockModule("../src/config/prisma.js", () => ({
  default: prismaMock,
}));

const { crear, listar, buscarPorId, actualizar, eliminar } =
  await import("../src/services/incidentes.service.js");

describe("incidentes.service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("limita la consulta a un máximo de 50 registros por seguridad y pagina correctamente en bloques de 10", async () => {
    // Simulamos 11 elementos para probar la paginación de 10 en 10 (+1 para el cursor)
    const items = Array.from({ length: 11 }, (_, index) => ({ id: index + 1 }));
    prismaMock.incidente.findMany.mockResolvedValue(items);

    // Si pasamos un límite mayor (ej. 100), el servicio debe aplicar el tope máximo de seguridad (50)
    // O si pasamos 10, consultará de 10 en 10. Aquí probamos con limite: 10
    const result = await listar({ limite: 10, estado: "ABIERTO" });

    expect(prismaMock.incidente.findMany).toHaveBeenCalledWith({
      where: { estado: "ABIERTO", prioridad: undefined },
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 11, // 10 solicitados + 1 extra para determinar si hay siguiente página
    });
    expect(result).toEqual({
      items: items.slice(0, 10), // Devuelve solo los 10 elementos del bloque
      nextCursor: 11, // O el identificador del cursor correspondiente
    });
  });

  test("devuelve null como cursor cuando no hay más registros", async () => {
    const items = [{ id: 1 }];
    prismaMock.incidente.findMany.mockResolvedValue(items);

    await expect(listar({ limite: 10 })).resolves.toEqual({
      items,
      nextCursor: null,
    });
  });

  test.each([
    ["crear", "create", [{ titulo: "Falla" }], { id: 1 }],
    ["buscarPorId", "findUnique", [1], { id: 1 }],
    ["actualizar", "update", [1, { estado: "CERRADO" }], { id: 1 }],
    ["eliminar", "delete", [1], { id: 1 }],
  ])("%s delega en Prisma", async (name, method, args, expected) => {
    prismaMock.incidente[method].mockResolvedValue(expected);

    await expect(
      { crear, buscarPorId, actualizar, eliminar }[name](...args),
    ).resolves.toBe(expected);
    expect(prismaMock.incidente[method]).toHaveBeenCalled();
  });
});
