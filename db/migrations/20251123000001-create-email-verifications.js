"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("email_verifications", {
      id: { type: Sequelize.STRING, primaryKey: true },
      userId: { type: Sequelize.STRING, allowNull: false, references: { model: "users", key: "id" }, onDelete: "CASCADE" },
      code: { type: Sequelize.STRING, allowNull: false },
      expiresAt: { type: Sequelize.DATE, allowNull: false },
      used: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: false },
      createdAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
      updatedAt: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("email_verifications");
  }
};
