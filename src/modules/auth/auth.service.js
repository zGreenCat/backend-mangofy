const repo = require("./auth.repo");
const { HttpError } = require("../../core/httpError");

async function login(email, password) {
  const user = await repo.findByEmail(email);
  if (!user || user.password !== password) throw new HttpError(401, "Credenciales inválidas");
  // TODO: generar JWT
  return { token: "fake.jwt.token", user: { id: user.id, email: user.email } };
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