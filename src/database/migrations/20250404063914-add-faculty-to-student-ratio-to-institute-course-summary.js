'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('institutes_course_summaries', 'faculty_to_student_ratio', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'exam_ids'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('institutes_course_summaries', 'faculty_to_student_ratio');
  }
};
