"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TicketPassenger extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TicketPassenger.init(
    {
      booking_id: { type: DataTypes.INTEGER, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      age: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "TicketPassenger",
    }
  );
  return TicketPassenger;
};
