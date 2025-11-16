const app = require("./app");
const { initModels } = require("./models");
const { env } = require("./config/env");
const PORT = env.PORT || 3001;

(async () => {
  try {
    // Inicializa modelos y asociaciones antes de levantar el server
    await initModels({ sync: true }); // <- en prod: usa migraciones y deja sync: false
    console.log("DB ready. Starting server…");
    app.listen(PORT, () => console.log(`API en http://localhost:${PORT}`));
  } catch (err) {
    console.error("Fatal DB init error:", err);
    process.exit(1);
  }
})();
