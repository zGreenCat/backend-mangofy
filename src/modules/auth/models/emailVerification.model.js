const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");

const EmailVerification = sequelize.define("EmailVerification", {
  id: { type: DataTypes.STRING, primaryKey: true },
  userId: { type: DataTypes.STRING, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false },
  expiresAt: { type: DataTypes.DATE, allowNull: false },
  used: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
}, {
  tableName: "email_verifications",
  timestamps: true,
});

EmailVerification.associate = (models) => {
  EmailVerification.belongsTo(models.User, { foreignKey: "userId", as: "user", onDelete: "CASCADE" });
};

module.exports = EmailVerification;
