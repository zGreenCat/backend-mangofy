const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.STRING, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING }
}, {
  tableName: "users",
  timestamps: false,
  defaultScope: { attributes: { exclude: ["password"] } },
  scopes: {
    withPassword: { attributes: { include: ["password"] } }
  }
});

module.exports = User;
