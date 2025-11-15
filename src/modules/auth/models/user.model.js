
const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");

const User = sequelize.define("User", {
  id: { type: DataTypes.STRING, primaryKey: true },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
}, {
  tableName: "users",
  timestamps: false,
  defaultScope: { attributes: { exclude: ["password"] } },
  scopes: { withPassword: { attributes: { include: ["password"] } } },
});

User.associate = (models) => {
  User.hasMany(models.RefreshToken, { foreignKey: "userId", as: "refreshTokens", onDelete: "CASCADE" });
  User.hasMany(models.Audio,        { foreignKey: "ownerId", as: "audios",         onDelete: "SET NULL" });
  User.hasMany(models.UserLibrary,  { foreignKey: "userId",  as: "library",        onDelete: "CASCADE" });
};

module.exports = User;
