module.exports = {
  up: async (queryInterface, Sequelize) => {
    // asegurar FK en sqlite
    await queryInterface.sequelize.query("PRAGMA foreign_keys = ON;");

    await queryInterface.createTable("audio", {
      id: { type: Sequelize.TEXT, primaryKey: true, allowNull: false },
      title: { type: Sequelize.TEXT, allowNull: false },
      artist: { type: Sequelize.TEXT },
      provider: { type: Sequelize.TEXT, allowNull: false, defaultValue: "cloudinary" },
      public_id: { type: Sequelize.TEXT, allowNull: false },
      format: { type: Sequelize.TEXT, allowNull: false },
      duration_sec: { type: Sequelize.REAL },
      bytes: { type: Sequelize.BIGINT },
      bitrate_kbps: { type: Sequelize.INTEGER },
      cover_public_id: { type: Sequelize.TEXT },
      visibility: { type: Sequelize.TEXT, allowNull: false, defaultValue: "public" },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") }
    });

    await queryInterface.createTable("audio_variant", {
      id: { type: Sequelize.TEXT, primaryKey: true, allowNull: false },
      audio_id: { type: Sequelize.TEXT, allowNull: false },
      kind: { type: Sequelize.TEXT, allowNull: false }, // '128k','320k','preview'
      public_id: { type: Sequelize.TEXT, allowNull: false },
      format: { type: Sequelize.TEXT, allowNull: false },
      duration_sec: { type: Sequelize.REAL },
      bytes: { type: Sequelize.BIGINT },
      bitrate_kbps: { type: Sequelize.INTEGER }
    });

    await queryInterface.addConstraint("audio_variant", {
      fields: ["audio_id"],
      type: "foreign key",
      name: "fk_audio_variant_audio",
      references: { table: "audio", field: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    });

    await queryInterface.addIndex("audio_variant", ["audio_id"], { name: "idx_audio_variant_audio" });
    await queryInterface.addIndex("audio_variant", ["audio_id", "kind"], { unique: true, name: "ux_audio_variant_audio_kind" });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query("PRAGMA foreign_keys = OFF;");
    await queryInterface.removeIndex("audio_variant", "ux_audio_variant_audio_kind");
    await queryInterface.removeIndex("audio_variant", "idx_audio_variant_audio");
    await queryInterface.dropTable("audio_variant");
    await queryInterface.dropTable("audio");
  }
};