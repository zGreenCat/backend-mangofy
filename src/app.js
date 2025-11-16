const express = require("express");
const { errorMiddleware } = require("./core/errorMiddleware");
const authRoutes = require("./modules/auth");
const audioRoutes = require("./modules/audio");
const libraryRoutes = require("./modules/library/library.routes");
const { authMiddleware } = require("./core/authMiddleware");

const app = express();
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
// Si quieres play pública, agrega aquí: app.get("/api/audios/:id/play", require("./modules/audio/audio.controller").play);
app.use("/api/audios", authMiddleware, audioRoutes);
app.use("/api/library", authMiddleware, libraryRoutes);

// Errores
app.use(errorMiddleware);

module.exports = app;
