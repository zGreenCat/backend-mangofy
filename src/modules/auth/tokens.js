const jwt = require("jsonwebtoken");
const { env } = require("./../../config/env");
const ACCESS_SECRET  = env.JWT_ACCESS_SECRET  || "dev_access";
const REFRESH_SECRET = env.JWT_REFRESH_SECRET || "dev_refresh";
const ACCESS_TTL     = env.ACCESS_TTL  || "15m";
const REFRESH_TTL    = env.REFRESH_TTL || "30d";
function signAccess(userId) {
  return jwt.sign({ sub: userId }, ACCESS_SECRET, { expiresIn: ACCESS_TTL });
}
function signRefresh(userId, jti) {
  return jwt.sign({ sub: userId, jti }, REFRESH_SECRET, { expiresIn: REFRESH_TTL });
}

function verifyAccess(token)  { return jwt.verify(token, ACCESS_SECRET); }
function verifyRefresh(token) { return jwt.verify(token, REFRESH_SECRET); }



module.exports = { signAccess, signRefresh, verifyAccess, verifyRefresh };