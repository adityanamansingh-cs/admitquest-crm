"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    // Remove the existing 'program_id' column
    await queryInterface.removeColumn("applications", "program_id");

    // Add the new 'institute_program_id' column after 'course_id'
    await queryInterface.sequelize.query(`
      ALTER TABLE applications 
      ADD COLUMN institute_program_id BIGINT UNSIGNED NULL 
      AFTER course_id
    `);
    await queryInterface.addConstraint("applications", {
      fields: ["institute_program_id"],
      type: "foreign key",
      name: "fk_applications_institute_program_id",
      references: {
        table: "institute_programs",
        field: "id",
      },
      onDelete: "SET NULL",
    });
    
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'institute_program_id' column
    await queryInterface.removeColumn("applications", "institute_program_id");

    // Re-add the 'program_id' column
    await queryInterface.addColumn("applications", "program_id", {
      type: Sequelize.BIGINT.UNSIGNED,
      allowNull: false,
      references: {
        model: "programs",
        key: "id",
      },
      onDelete: "CASCADE",
    }, {
      after: "course_id", // Optional: re-add in the same position
    });
  },
};
