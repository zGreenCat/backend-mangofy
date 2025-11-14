const { Sequelize } = require("sequelize");
const path = require("path");

const storage = path.resolve(__dirname, "..", "..", "data.sqlite");
const sequelize = new Sequelize({ dialect: "sqlite", storage, logging: false });

async function initDb() {
  await sequelize.authenticate();
  await sequelize.query("PRAGMA journal_mode = WAL;");
  await sequelize.sync(); // si usas migraciones, puedes quitar sync()
}
module.exports = { sequelize, initDb };
