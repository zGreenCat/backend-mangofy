const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");
const User = require("../../auth/models/user.model"); // si quieres owner

const Audio = sequelize.define("Audio", {
  id: { type: DataTypes.STRING, primaryKey: true },
  title: { type: DataTypes.STRING, allowNull: false },
  artist: { type: DataTypes.STRING },
  public_id: { type: DataTypes.STRING, allowNull: false }, // Cloudinary public_id
  format: { type: DataTypes.STRING, allowNull: false },
  duration_sec: { type: DataTypes.FLOAT },
  bytes: { type: DataTypes.BIGINT },
  visibility: { type: DataTypes.ENUM("public","private"), defaultValue: "public" },
  ownerId: { type: DataTypes.STRING } // opcional
}, {
  tableName: "audio",
  timestamps: true
});

if (User) {
  User.hasMany(Audio, { foreignKey: "ownerId" });
  Audio.belongsTo(User, { foreignKey: "ownerId" });
}

module.exports = Audio;
