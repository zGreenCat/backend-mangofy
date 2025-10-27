const { Router } = require("express");
const { z } = require("zod");
const { register, validateUser } = require("../users");
const { signAccessToken, signRefreshToken, verifyRefresh } = require("./tokens");
const { isRefreshValid, revokeRefresh, findUserById } = require("../db");

const authRouter = Router();

authRouter.post("/register", async (req, res) => {
  const schema = z.object({
    email: z.string().email(),
    password: z.string().min(8),
    name: z.string().optional()
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const user = await register(parsed.data.email, parsed.data.password, parsed.data.name);
    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const refreshToken = await signRefreshToken({ sub: user.id });
    return res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
  } catch (e) {
    if (e && e.message === "EMAIL_IN_USE") return res.status(409).json({ error: "EMAIL_IN_USE" });
    return res.status(500).json({ error: "UNKNOWN" });
  }
});

authRouter.post("/login", async (req, res) => {
  const schema = z.object({ email: z.string().email(), password: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  const user = await validateUser(parsed.data.email, parsed.data.password);
  if (!user) return res.status(401).json({ error: "INVALID_CREDENTIALS" });

  const accessToken = signAccessToken({ sub: user.id, email: user.email });
  const refreshToken = await signRefreshToken({ sub: user.id });
  return res.json({ user: { id: user.id, email: user.email, name: user.name }, accessToken, refreshToken });
});

authRouter.post("/refresh", async (req, res) => {
  const schema = z.object({ refreshToken: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });

  try {
    const payload = verifyRefresh(parsed.data.refreshToken);
    const ok = await isRefreshValid(payload.jti, payload.sub);
    if (!ok) return res.status(401).json({ error: "INVALID_REFRESH" });

    await revokeRefresh(payload.jti); // rotación
    const user = await findUserById(payload.sub);
    if (!user) return res.status(401).json({ error: "USER_NOT_FOUND" });

    const accessToken = signAccessToken({ sub: user.id, email: user.email });
    const newRefresh = await signRefreshToken({ sub: user.id });
    return res.json({ accessToken, refreshToken: newRefresh });
  } catch {
    return res.status(401).json({ error: "INVALID_REFRESH" });
  }
});

authRouter.post("/logout", async (req, res) => {
  const schema = z.object({ refreshToken: z.string().min(1) });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: "INVALID_INPUT" });
  try {
    const payload = verifyRefresh(parsed.data.refreshToken);
    await revokeRefresh(payload.jti);
  } catch {}
  return res.json({ ok: true });
});

module.exports = { authRouter };
