'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the table already has a primary key
    const tableDescription = await queryInterface.describeTable('sequelize_migrations');
    const primaryKeyColumns = Object.keys(tableDescription).filter(column => tableDescription[column].primaryKey);

    // Remove existing primary key if it exists
    if (primaryKeyColumns.length > 0) {
      // In MySQL, we can drop the primary key directly
      await queryInterface.sequelize.query('ALTER TABLE `sequelize_migrations` DROP PRIMARY KEY');

      // Update columns to be nullable
      for (const column of primaryKeyColumns) {
        await queryInterface.changeColumn('sequelize_migrations', column, {
          type: tableDescription[column].type,
          allowNull: true,
        });
      }
    }

    // Add new primary key column as the first column
    await queryInterface.sequelize.query(`
      ALTER TABLE \`sequelize_migrations\` 
      ADD COLUMN \`id\` INTEGER AUTO_INCREMENT PRIMARY KEY FIRST
    `);

    // Add created_at column
    await queryInterface.addColumn('sequelize_migrations', 'created_at', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('sequelize_migrations', 'id');
    await queryInterface.removeColumn('sequelize_migrations', 'created_at');
  },
};