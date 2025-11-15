const { Router } = require("express");
const c = require("./library.controller");
const r = Router();

r.get("/", c.listMine);               // mis audios (paginado)
r.post("/", c.add);                   // body: { audioId }
r.delete("/:audioId", c.remove);      // quitar de la biblioteca

module.exports = r;
