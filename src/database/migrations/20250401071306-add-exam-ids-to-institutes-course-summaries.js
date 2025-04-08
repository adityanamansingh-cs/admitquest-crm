"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("institutes_course_summaries", "exam_ids", {
      type: Sequelize.STRING,
      allowNull: true,
      after: "highest_package",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("institutes_course_summaries", "exam_ids");
  },
}; 