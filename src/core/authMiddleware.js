const { verifyAccess } = require("../modules/auth/tokens");

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "NO_TOKEN" });

  try {
    const payload = verifyAccess(token);
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}

module.exports = { authMiddleware };