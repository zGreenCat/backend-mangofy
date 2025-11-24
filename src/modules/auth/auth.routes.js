const { Router } = require("express");
const c = require("./auth.controller");

const r = Router();

r.post("/login", c.login);
r.post("/register", c.register);
r.get("/me", c.me);
r.post("/send-code", c.sendCode);
r.post("/verify-code", c.verifyCode);

module.exports = r;
