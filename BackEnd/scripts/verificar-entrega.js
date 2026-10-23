const base = process.env.API_URL?.replace(/\/$/, "");
const correo = process.env.DEMO_EMAIL;
const password = process.env.DEMO_PASSWORD;
const analistaCorreo = process.env.DEMO_ANALISTA_EMAIL;
const analistaPassword = process.env.DEMO_ANALISTA_PASSWORD;

if (!base || !correo || !password) {
  console.error(
    "Defina API_URL, DEMO_EMAIL y DEMO_PASSWORD al ejecutar el verificador.",
  );
  process.exit(1);
}

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, options);
  const text = await response.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }
  }
  return { response, data };
}

async function expectStatus(path, options, expectedStatus) {
  const result = await request(path, options);
  if (result.response.status !== expectedStatus) {
    throw new Error(
      `${path}: se esperaba ${expectedStatus}, se obtuvo ${result.response.status} ${JSON.stringify(result.data)}`,
    );
  }
  return result;
}

async function login(email, secret) {
  return (
    await expectStatus(
      "/api/auth/login",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo: email, password: secret }),
      },
      200,
    )
  ).data;
}

async function run() {
  await expectStatus(
    "/api/auth/login",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ correo, password: `${password}-incorrecta` }),
    },
    401,
  );
  await expectStatus("/api/incidentes", {}, 401);

  const authenticated = await login(correo, password);
  if (authenticated.usuario?.rol !== "ADMIN") {
    throw new Error(
      "DEMO_EMAIL debe tener rol ADMIN para crear y limpiar el registro.",
    );
  }

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${authenticated.token}`,
  };

  await expectStatus(
    "/api/incidentes",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        titulo: "x",
        descripcion: "corta",
        responsable: "x",
        prioridad: "URGENTE",
      }),
    },
    400,
  );

  const created = await expectStatus(
    "/api/incidentes",
    {
      method: "POST",
      headers,
      body: JSON.stringify({
        titulo: "Incidente creado por verificación local",
        descripcion: "Registro temporal para comprobar el CRUD local.",
        responsable: "Verificador local",
        prioridad: "MEDIA",
      }),
    },
    201,
  );
  const id = created.data?.id;
  if (!Number.isInteger(id)) {
    throw new Error("La creación no devolvió un ID válido.");
  }

  try {
    await expectStatus(`/api/incidentes/${id}`, { headers }, 200);
    await expectStatus(
      `/api/incidentes/${id}`,
      {
        method: "PUT",
        headers,
        body: JSON.stringify({
          titulo: "Incidente actualizado por verificación local",
          descripcion: "Actualización temporal comprobada correctamente.",
          responsable: "Verificador local",
          prioridad: "ALTA",
        }),
      },
      200,
    );

    if (!analistaCorreo || !analistaPassword) {
      throw new Error(
        "NO EJECUTADO: defina DEMO_ANALISTA_EMAIL y DEMO_ANALISTA_PASSWORD para comprobar rol insuficiente.",
      );
    }
    const analista = await login(analistaCorreo, analistaPassword);
    if (analista.usuario?.rol !== "ANALISTA") {
      throw new Error("La cuenta DEMO_ANALISTA debe tener rol ANALISTA.");
    }
    await expectStatus(
      `/api/incidentes/${id}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${analista.token}`,
        },
      },
      403,
    );
  } finally {
    await expectStatus(
      `/api/incidentes/${id}`,
      { method: "DELETE", headers },
      200,
    );
  }

  console.log("CRUD, autenticación y casos negativos verificados.");
}

run().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
