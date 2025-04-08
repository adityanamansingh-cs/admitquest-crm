"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("institutes_course_summaries", "total_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      after: "discount_amount",
    });

    await queryInterface.addColumn("institutes_course_summaries", "final_amount", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: true,
      after: "total_amount",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("institutes_course_summaries", "total_amount");
    await queryInterface.removeColumn("institutes_course_summaries", "final_amount");
  },
};
