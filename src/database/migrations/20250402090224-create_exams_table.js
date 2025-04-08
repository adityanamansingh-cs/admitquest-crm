'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('exams', {
      id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      course_id: {
        type: Sequelize.BIGINT.UNSIGNED,
        allowNull: true,
        references: {
          model: 'courses',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      level: {
        type: Sequelize.ENUM('ai', 'state'),
        allowNull: true,
        defaultValue: 'ai',
      },
      display_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: true,
        unique: true,
      },
      full_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      exam_state: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      conducted_by: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      logo: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      mode: {
        type: Sequelize.ENUM('offline', 'online', 'hybrid'),
        allowNull: true,
        defaultValue: 'offline',
      },
      status: {
        type: Sequelize.ENUM('active', 'inactive'),
        allowNull: true,
        defaultValue: 'inactive',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('exams');
  },
};
