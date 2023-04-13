"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("otps", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      otp: {
        type: Sequelize.INTEGER,
      },
      email: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE(6),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE(6),
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("otps");
  },
};
