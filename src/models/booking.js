"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Ticket, {
        foreignKey: "ticket_id",
        onDelete: "CASCADE",
      });

      this.hasMany(models.TicketPassenger, {
        foreignKey: "booking_id",
      });
    }
  }
  Booking.init(
    {
      ticket_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      number_of_adults: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      number_of_children: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      total_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: "Booking",
    }
  );
  return Booking;
};
