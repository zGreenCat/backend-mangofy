const repo = require("./auth.repo");
const { HttpError } = require("../../core/httpError");
const bcrypt = require("bcryptjs");   
const tokens = require("./tokens");
const { v4: uuid } = require("uuid");


async function login(email, password) {
  const user = await repo.findUserByEmail(email, true);
  if (!user) throw new HttpError(401, "INVALID_CREDENTIALS");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new HttpError(401, "INVALID_CREDENTIALS");

  const accessToken = tokens.signAccess(user.id);

  // generar JTI y firmar refresh con ese JTI
  const jti = uuid();
  const refreshToken = tokens.signRefresh(user.id, jti);

  // guardar el JTI en la tabla refreshTokens
  await repo.createRefreshToken({ id: jti, userId: user.id });

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, name: user.name },
  };
}

async function register({ email, password, name }) {
  const exists = await repo.findUserByEmail(email);
  if (exists) throw new HttpError(409, "EMAIL_IN_USE");
  const hash = await bcrypt.hash(password, 10);
  return repo.createUser({ email, password: hash, name });
}

async function validateUser(email, password) {
  const user = await repo.findUserByEmail(email, true); // withPassword
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  // devuelve sin password
  return { id: user.id, email: user.email, name: user.name };
}
  

module.exports = { login, register, validateUser };