const { DataTypes } = require("sequelize");
const { sequelize } = require("../../../config/db");
const Audio = require("./audio.model");

const AudioVariant = sequelize.define("AudioVariant", {
  id: { type: DataTypes.STRING, primaryKey: true },
  audio_id: { type: DataTypes.STRING, allowNull: false },
  kind: { type: DataTypes.STRING, allowNull: false }, // 'original' | '128k' | '320k' | 'preview'
  public_id: { type: DataTypes.STRING, allowNull: false },
  format: { type: DataTypes.STRING, allowNull: false },
  duration_sec: { type: DataTypes.FLOAT },
  bytes: { type: DataTypes.BIGINT },
  bitrate_kbps: { type: DataTypes.INTEGER }
}, {
  tableName: "audio_variant",
  timestamps: false
});

Audio.hasMany(AudioVariant, { foreignKey: "audio_id", as: "variants" });
AudioVariant.belongsTo(Audio, { foreignKey: "audio_id" });

module.exports = AudioVariant;
