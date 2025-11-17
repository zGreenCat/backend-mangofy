module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query("PRAGMA foreign_keys = OFF;");
    
    // Borrar tabla anterior
    await queryInterface.dropTable("user_library");
    
    // Recrear con schema correcto (sin UNIQUE individual en userId/audioId)
    await queryInterface.createTable("user_library", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "users",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      audioId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: "audio",
          key: "id"
        },
        onDelete: "CASCADE"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
      }
    });

    // Crear índice único compuesto (userId, audioId)
    await queryInterface.addIndex("user_library", ["userId", "audioId"], {
      unique: true,
      name: "ux_user_library_user_audio"
    });

    await queryInterface.sequelize.query("PRAGMA foreign_keys = ON;");
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.query("PRAGMA foreign_keys = OFF;");
    await queryInterface.dropTable("user_library");
    await queryInterface.sequelize.query("PRAGMA foreign_keys = ON;");
  }
};
