const svc = require("./auth.service");

async function login(req, res, next) {
  try {
    const out = await svc.login(req.body.email, req.body.password);
    res.json(out);
  } catch (e) { next(e); }
}

async function register(req, res, next) {
  try {
    const out = await svc.register(req.body);
    res.status(201).json(out);
  } catch (e) { next(e); }
}

async function me(_req, res, next) {
  try {
    // ejemplo simple
    res.json({ ok: true });
  } catch (e) { next(e); }
}

async function sendCode(req, res, next) {
  try {
    const { email } = req.body;
    const out = await svc.sendVerificationCode(email);
    res.json(out);
  } catch (e) { next(e); }
}

async function verifyCode(req, res, next) {
  try {
    const { email, code } = req.body;
    const out = await svc.verifyCode(email, code);
    res.json(out);
  } catch (e) { next(e); }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw new HttpError(400, "NO_REFRESH_TOKEN");

    const payload = tokens.verifyRefresh(refreshToken); // { sub, jti, iat, exp }
    const valid = await repo.isRefreshValid(payload.jti, payload.sub);
    if (!valid) throw new HttpError(401, "INVALID_REFRESH");

    const accessToken = tokens.signAccess(payload.sub);
    res.json({ accessToken });
  } catch (e) { next(e); }
}

async function logout(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(204).end();

    const { jti } = tokens.verifyRefresh(refreshToken);
    await repo.revokeRefreshToken(jti);
    res.status(204).end();
  } catch (e) { next(e); }
}

module.exports = { login, register, me, refresh, logout, sendCode, verifyCode };
