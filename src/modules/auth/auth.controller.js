const svc = require("./auth.service");

async function login(req, res, next) {
  try {
    const out = await svc.login(req.body.email, req.body.password);
    res.json(out);
  } catch (e) { next(e); }
}

async function register(req, res, next) {
  try {
    const out = await svc.register(req.body);
    res.status(201).json(out);
  } catch (e) { next(e); }
}

async function me(_req, res, next) {
  try {
    // ejemplo simple
    res.json({ ok: true });
  } catch (e) { next(e); }
}

module.exports = { login, register, me };
