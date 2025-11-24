const repo = require("./auth.repo");
const { HttpError } = require("../../core/httpError");
const bcrypt = require("bcryptjs");   
const tokens = require("./tokens");
const { v4: uuid } = require("uuid");
const { sendMail } = require("../../config/mailer");


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
  const user = await repo.createUser({ email, password: hash, name });

  // generar código de verificación y enviarlo por correo
  try {
    const id = uuid();
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
    await repo.createEmailVerification({ id, userId: user.id, code, expiresAt });
    await sendMail({ to: email, subject: "Código de verificación", text: `Tu código es ${code}` });
  } catch (e) {
    // no impedir el registro si falla el envío de correo
    console.error("Error sending verification email:", e);
  }

  return user;
}

async function sendVerificationCode(email) {
  const user = await repo.findUserByEmail(email);
  if (!user) throw new HttpError(404, "USER_NOT_FOUND");
  const id = uuid();
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  await repo.createEmailVerification({ id, userId: user.id, code, expiresAt });
  await sendMail({ to: email, subject: "Código de verificación", text: `Tu código es ${code}` });
  return { ok: true };
}

async function verifyCode(email, code) {
  const user = await repo.findUserByEmail(email);
  if (!user) throw new HttpError(404, "USER_NOT_FOUND");
  const row = await repo.findEmailVerificationByCode(user.id, code);
  if (!row) throw new HttpError(400, "INVALID_CODE");
  if (new Date(row.expiresAt) < new Date()) throw new HttpError(400, "CODE_EXPIRED");
  await repo.markEmailVerificationUsed(row.id);
  return { ok: true };
}

async function validateUser(email, password) {
  const user = await repo.findUserByEmail(email, true); // withPassword
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return null;
  // devuelve sin password
  return { id: user.id, email: user.email, name: user.name };
}
  

module.exports = { login, register, validateUser, sendVerificationCode, verifyCode };