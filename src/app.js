const express = require("express");
const { errorMiddleware } = require("./core/errorMiddleware");
const { initDb } = require("./config/db");

const authRoutes = require("./modules/auth");
const audioRoutes = require("./modules/audio");
const { authMiddleware } = require("./core/authMiddleware"); 

const app = express();
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/audios", authMiddleware, audioRoutes);
// Errores
app.use(errorMiddleware);

// Init DB al levantar (si no usas migraciones CLI)
initDb().catch(console.error);

module.exports = app;
