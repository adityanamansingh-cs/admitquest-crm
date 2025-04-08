"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("applications", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      student_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "students",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      institute_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "institutes",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      course_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "courses",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      program_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        references: {
          model: "programs",
          key: "id",
        },
        onDelete: "CASCADE",
      },
      final_amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      payable_amount: {
        type: Sequelize.DECIMAL(10,2),
        allowNull: false,
        defaultValue: 0.00,
      },
      added_by: {
        type: Sequelize.ENUM("admin", "student"), // Enum for user roles
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM("0", "1", "2"), // 0: Deleted, 1: Running, 2: Expired
        allowNull: false,
        defaultValue: "0",
        comment: "0: Deleted, 1: Running, 2: Expired", // Adding comment in DB
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
    await queryInterface.dropTable("applications");
  },
};
