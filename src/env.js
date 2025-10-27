require("dotenv").config();
const env = {
    PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || "your_jwt_access_secret",
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your_jwt_refresh_secret",
    ACCESS_TTL: process.env.ACCESS_TTL || "15m",
    REFRESH_TTL: process.env.REFRESH_TTL || "30d",
    CORS_ORIGIN: process.env.CORS_ORIGIN || "*"
};
module.exports = { env };