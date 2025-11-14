const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");
const User = require("./user.model");

const RefreshToken = sequelize.define("RefreshToken", {
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  createdAt: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: "refreshTokens",
  timestamps: false
});

User.hasMany(RefreshToken, { foreignKey: "userId" });
RefreshToken.belongsTo(User, { foreignKey: "userId" });

module.exports = RefreshToken;
