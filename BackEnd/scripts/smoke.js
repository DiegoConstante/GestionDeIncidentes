const base = process.env.API_URL?.replace(/\/$/, "");

if (!base) {
  console.error("Defina API_URL con la URL base de la API.");
  process.exit(1);
}

async function comprobar(ruta) {
  const response = await fetch(`${base}${ruta}`);
  const body = await response.text();
  console.log(`${ruta}: ${response.status} ${body.slice(0, 100)}`);
  return response.status === 200;
}

async function ejecutar() {
  const healthOk = await comprobar("/health");
  const versionOk = await comprobar("/api/version");

  if (!healthOk || !versionOk) {
    process.exitCode = 1;
  }
}

ejecutar().catch((error) => {
  console.error("La prueba de humo no pudo completarse:", error.message);
  process.exit(1);
});
