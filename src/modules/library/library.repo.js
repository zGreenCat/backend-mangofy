const { Op } = require("sequelize");
const {UserLibrary, Audio} = require("../../models");

async function list(userId, { limit, offset }) {
  const rows = await UserLibrary.findAll({
    where: { userId },
    include: [{ model: Audio, as: "audio" }],
    limit, offset, order: [["createdAt", "DESC"]],
  });
  return rows.map(r => {
    const plain = r.get({ plain: true });
    return { audioId: plain.audioId, addedAt: plain.createdAt, audio: plain.audio };
  });
}

async function add(userId, audioId) {
  const [row] = await UserLibrary.findOrCreate({ where: { userId, audioId }, defaults: { userId, audioId } });
  return row.get({ plain: true });
}

async function remove(userId, audioId) {
  await UserLibrary.destroy({ where: { userId, audioId } });
}

module.exports = { list, add, remove };
