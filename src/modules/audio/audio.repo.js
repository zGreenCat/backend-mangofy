const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const Audio = require("./models/audio.model");
const AudioVariant = require("./models/audioVariant.model")
async function createAudio(data) {
  const id = uuid();
  const row = await Audio.create({ id, ...data });
  return row.get({ plain: true });
}
async function listAudios({ q, limit=20, offset=0 }) {
  const where = q ? { title: { [Op.like]: `%${q}%` } } : undefined;
  const { count, rows } = await Audio.findAndCountAll({
    where, limit, offset, order: [["createdAt","DESC"]]
  });
  return { count, items: rows.map(r => r.get({ plain: true })) };
}
async function findAudioByIdWithVariants(id) {
  const include = AudioVariant ? [{ model: AudioVariant, as: "variants" }] : [];
  const row = await Audio.findByPk(id, { include });
  return row ? row.get({ plain: true }) : null;
}

module.exports = { createAudio, listAudios, findAudioByIdWithVariants };
