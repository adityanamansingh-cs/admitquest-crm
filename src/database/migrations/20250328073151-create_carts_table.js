"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("carts", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      student_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      order_id: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      coupon_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: "coupons",
          key: "id",
        },
        onDelete: "SET NULL",
      },
      total_amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      discount_amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      final_amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: 0,
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
    await queryInterface.dropTable("carts");
  },
};
