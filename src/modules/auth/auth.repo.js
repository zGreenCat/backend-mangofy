
const { v4: uuid } = require("uuid");
const { User, RefreshToken } = require("../../models"); // 👈 del hub

async function createUser({ email, password, name }) {
  const id = uuid();
  const u = await User.create({ id, email, password, name: name || null });
  return u.get({ plain: true });
}

async function findUserByEmail(email, withPassword = false) {
  const scope = withPassword ? "withPassword" : null;
  const u = await User.scope(scope).findOne({ where: { email } });
  return u ? u.get({ plain: true }) : null;
}

async function findUserById(id, withPassword = false) {
  const scope = withPassword ? "withPassword" : null;
  const u = await User.scope(scope).findByPk(id);
  return u ? u.get({ plain: true }) : null;
}

async function createRefreshToken({ id, userId }) {
  await RefreshToken.create({
    id,               // JTI (uuid) que firmaste dentro del refresh JWT
    userId,
    revoked: false,
    createdAt: Date.now(),
  });
}

async function revokeRefreshToken(id) {
  await RefreshToken.update({ revoked: true }, { where: { id } });
}

async function isRefreshValid(id, userId) {
  const row = await RefreshToken.findByPk(id);
  return !!row && !row.revoked && row.userId === userId;
}

module.exports = { createUser, findUserByEmail, findUserById, createRefreshToken, revokeRefreshToken, isRefreshValid };