"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn("carts", "order_id");
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("carts", "order_id", {
      type: Sequelize.STRING(255),
      allowNull: true,
    });
  },
};
