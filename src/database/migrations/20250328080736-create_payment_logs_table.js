"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("payment_logs", {
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
      cart_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "carts",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      application_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "applications",
          key: "id",
        },
        onDelete: "CASCADE",
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
      transaction_no: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      response: {
        type: Sequelize.TEXT,  // Fixed: Using Sequelize.TEXT instead of DataTypes.TEXT
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM("0", "1", "2", "3"), // 0: Initiated, 1: Pending, 2: Success, 3: Failed
        allowNull: false,
        defaultValue: "0",
        comment: "0: Initiated, 1: Pending, 2: Success, 3: Failed",
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
    await queryInterface.dropTable("payment_logs");
  },
};
