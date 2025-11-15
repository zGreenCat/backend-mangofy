const svc = require("./library.service");

async function listMine(req, res, next) {
  try {
    const data = await svc.listUserLibrary(req.user.id, req.query);
    res.json(data);
  } catch (e) { next(e); }
}
async function add(req, res, next) {
  try {
    const { audioId } = req.body || {};
    if (!audioId) return res.status(400).json({ error: "audioId required" });
    const row = await svc.addToLibrary(req.user.id, audioId);
    res.status(201).json(row);
  } catch (e) { next(e); }
}
async function remove(req, res, next) {
  try {
    await svc.removeFromLibrary(req.user.id, req.params.audioId);
    res.status(204).end();
  } catch (e) { next(e); }
}
module.exports = { listMine, add, remove };
