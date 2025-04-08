'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // First, create a temporary column
    await queryInterface.addColumn('institute_features', 'certified_by_temp', {
      type: Sequelize.ENUM('admitquest', 'college', 'portals'),
      allowNull: false,
      defaultValue: 'admitquest'
    });

    // Update the temporary column based on the old values
    await queryInterface.sequelize.query(`
      UPDATE institute_features 
      SET certified_by_temp = CASE 
        WHEN certified_by = 'admitquest' THEN 'admitquest'
        WHEN certified_by = 'students' THEN 'college'
        WHEN certified_by = 'others' THEN 'portals'
        ELSE 'admitquest'
      END
    `);

    // Remove the old column
    await queryInterface.removeColumn('institute_features', 'certified_by');

    // Rename the temporary column to the original name
    await queryInterface.renameColumn('institute_features', 'certified_by_temp', 'certified_by');
  },

  async down (queryInterface, Sequelize) {
    // First, create a temporary column
    await queryInterface.addColumn('institute_features', 'certified_by_temp', {
      type: Sequelize.ENUM('admitquest', 'students', 'others'),
      allowNull: false,
      defaultValue: 'admitquest'
    });

    // Update the temporary column based on the new values
    await queryInterface.sequelize.query(`
      UPDATE institute_features 
      SET certified_by_temp = CASE 
        WHEN certified_by = 'admitquest' THEN 'admitquest'
        WHEN certified_by = 'college' THEN 'students'
        WHEN certified_by = 'portals' THEN 'others'
        ELSE 'admitquest'
      END
    `);

    // Remove the new column
    await queryInterface.removeColumn('institute_features', 'certified_by');

    // Rename the temporary column to the original name
    await queryInterface.renameColumn('institute_features', 'certified_by_temp', 'certified_by');
  }
};
