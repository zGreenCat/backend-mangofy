const { Router } = require("express");
const c = require("./audio.controller");

const r = Router();

r.get("/", c.list);
r.get("/upload/signature", c.signature);  
r.post("/", c.create);   // para subidas desde app móvil
r.get("/:id/play", c.play);                // devuelve URL (pública o firmada)

module.exports = r;
