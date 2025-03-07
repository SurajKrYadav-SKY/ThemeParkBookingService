"use strict";

const ticket = require("../models/ticket");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Bookings", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      ticket_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Tickets",
          key: "id",
          as: "ticket_id",
        },
      },
      number_of_adults: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      number_of_children: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_price: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Bookings");
  },
};
