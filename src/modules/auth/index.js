// Asegura cargar modelos y asociaciones de este módulo
require("./models/user.model");
require("./models/refreshToken.model");

module.exports = require("./auth.routes"); // exporta las rutas
