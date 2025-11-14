// src/modules/auth/middleware.js
const jwt = require("jsonwebtoken");
const env = require("../../config/env");

function authMiddleware(req, res, next) {
  const h = req.headers.authorization || "";
  const token = h.startsWith("Bearer ") ? h.slice(7) : null;
  if (!token) return res.status(401).json({ error: "NO_TOKEN" });

  try {
    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    req.user = { id: payload.sub };
    next();
  } catch {
    return res.status(401).json({ error: "INVALID_TOKEN" });
  }
}
module.exports = { authMiddleware };
