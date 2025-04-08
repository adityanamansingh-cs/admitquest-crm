"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("coupons", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      code: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      discount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      capping: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      type_discount: {
        type: Sequelize.ENUM("percentage", "flat"),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM("student", "institute", "course", "program"),
        allowNull: false,
      },
      type_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
      },
      expiry: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("coupons");
  },
};
