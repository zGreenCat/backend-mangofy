const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");


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

Audio.associate = (models) => {
  Audio.belongsTo(models.User,         { foreignKey: "ownerId", as: "owner",       onDelete: "SET NULL" });
  Audio.hasMany(models.AudioVariant,   { foreignKey: "audioId", as: "variants",    onDelete: "CASCADE" });
  Audio.hasMany(models.UserLibrary,    { foreignKey: "audioId", as: "libraryRefs", onDelete: "CASCADE" });
};

module.exports = Audio;
