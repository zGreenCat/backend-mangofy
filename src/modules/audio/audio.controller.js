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

async function create(req, res, next) {
  try {
    // body esperado: { title, artist?, public_id, format, duration_sec?, bytes?, visibility? }
    const dto = req.body || {};
    if (!dto.title || !dto.public_id || !dto.format) {
      return res.status(400).json({ error: "INVALID_BODY" });
    }
    const out = await svc.createFromUpload(dto, req.user?.id); // si usas authMiddleware
    res.status(201).json(out);
  } catch (e) { next(e); }
}

module.exports = { list, signature, play, create};
