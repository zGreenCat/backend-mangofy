const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");


const RefreshToken = sequelize.define("RefreshToken", {
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
  createdAt: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: "refreshTokens",
  timestamps: false
});

RefreshToken.associate = (models) => {
  RefreshToken.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
};

module.exports = RefreshToken;
