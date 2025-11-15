const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");

const UserLibrary = sequelize.define("UserLibrary", {
  userId: { type: DataTypes.STRING, allowNull: false },
  audioId: { type: DataTypes.STRING, allowNull: false },
}, {
  tableName: "user_library",
  timestamps: true,
  indexes: [{ unique: true, fields: ["userId", "audioId"] }],
});

UserLibrary.associate = (models) => {
  UserLibrary.belongsTo(models.User,  { foreignKey: "userId",  as: "user",  onDelete: "CASCADE" });
  UserLibrary.belongsTo(models.Audio, { foreignKey: "audioId", as: "audio", onDelete: "CASCADE" });
};

module.exports = UserLibrary;
