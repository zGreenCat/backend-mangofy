const repo = require("./auth.repo");
const { HttpError } = require("../../core/httpError");

async function login(email, password) {
  const user = await repo.findByEmail(email);
  if (!user || user.password !== password) throw new HttpError(401, "Credenciales inválidas");
  // TODO: generar JWT
  return { token: "fake.jwt.token", user: { id: user.id, email: user.email } };
}

async function register(data) {
  // TODO: validación
  const user = await repo.create(data);
  return { id: user.id, email: user.email };
}

module.exports = { login, register };
