"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("institutes_course_summaries", {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
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
      discount_amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      last_date_to_apply: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fees_min: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      fees_max: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      fees_avg: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      total_seats: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
      },
      average_package: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
      },
      highest_package: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: true,
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
    await queryInterface.dropTable("institutes_course_summaries");
  },
};
