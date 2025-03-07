"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Ticket extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Booking, {
        foreignKey: "ticket_id",
      });
    }
  }
  Ticket.init(
    {
      user_id: { type: DataTypes.STRING, allowNull: false },
      park_id: { type: DataTypes.INTEGER, allowNull: false },
      booking_date: { type: DataTypes.DATE, allowNull: false },
      visit_date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Ticket",
    }
  );
  return Ticket;
};
