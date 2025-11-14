const svc = require("./audio.service");

async function list(_req, res, next) {
  try {
    const data = await svc.list();
    res.json(data);
  } catch (e) { next(e); }
}

async function signature(_req, res, next) {
  try {
    const data = await svc.signature();
    res.json(data);
  } catch (e) { next(e); }
}

async function play(req, res, next) {
  try {
    const url = await svc.getPlayUrl(req.params.id);
    res.json({ url });
  } catch (e) { next(e); }
}

module.exports = { list, signature, play };
