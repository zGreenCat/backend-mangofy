// src/modules/auth/tokens.js
const jwt = require("jsonwebtoken");
const env = require("../../config/env"); // o process.env directamente

function signAccess(payload) {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: env.ACCESS_TTL });
}
function signRefresh(payload) {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TTL });
}
module.exports = { signAccess, signRefresh };
