"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");
    await queryInterface.dropTable("carts");
    await queryInterface.dropTable("applications");
    await queryInterface.dropTable("orders");
    await queryInterface.dropTable("payment_logs");
    await queryInterface.sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
  }

};