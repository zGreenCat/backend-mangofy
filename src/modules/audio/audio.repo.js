const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const Audio = require("./models/audio.model");

async function createAudio(data, t) {
  const id = uuid();
  const row = await Audio.create({ id, ...data }, { transaction: t });
  return row.get({ plain: true });
}
async function listAudios({ q, limit=20, offset=0 }) {
  const where = q ? { title: { [Op.like]: `%${q}%` } } : undefined;
  const { count, rows } = await Audio.findAndCountAll({ where, limit, offset, order: [["createdAt","DESC"]] });
  return { count, items: rows.map(r => r.get({ plain: true })) };
}
module.exports = { createAudio, listAudios };
