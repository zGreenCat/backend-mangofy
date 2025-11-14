const { v4: uuid } = require("uuid");
const User = require("./models/user.model");
const RefreshToken = require("./models/refreshToken.model");

async function createUser({ email, password, name }) {
  const id = uuid();
  const u = await User.create({ id, email, password, name: name || null });
  return u.get({ plain: true });
}
async function findUserByEmail(email, withPassword=false) {
  const scope = withPassword ? "withPassword" : null;
  const u = await User.scope(scope).findOne({ where: { email } });
  return u && u.get({ plain: true });
}
async function createRefreshToken({ id, userId }) {
  await RefreshToken.create({ id, userId, revoked: false, createdAt: Date.now() });
}
module.exports = { createUser, findUserByEmail, createRefreshToken };
