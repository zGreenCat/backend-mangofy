const jwt = require("jsonwebtoken");
const {v4:uuid} = require("uuid");
const { env } = require("../env");
const { storeRefresh } = require("../db");

function signAccessToken(paylod){
    return jwt.sign(payload, env.JWT_ACCESS_SECRET, {expiresIn: env.ACCESS_TTL})
}

async function signRefreshToken(payload){
    const jti = uuid();
    const token = jwt.sign({...payload, jti},env.JWT_REFRESH_SECRET, { expiresIn: env.REFRESH_TTL });
    await storeRefresh(payload.sub, jti);
    return token;
}

function verifyAccess(token){
    return jwt.verify(token, env.JWT_ACCESS_SECRET);
}

function verifyRefresh(token){
    return jwt.verify(token, env.JWT_REFRESH_SECRET);
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccess,
    verifyRefresh
};