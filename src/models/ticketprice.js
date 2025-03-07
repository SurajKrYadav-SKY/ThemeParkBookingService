"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class TicketPrice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TicketPrice.init(
    {
      park_id: { type: DataTypes.INTEGER, allowNull: false, unique: true },
      adult_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
      child_price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    },
    {
      sequelize,
      modelName: "TicketPrice",
    }
  );
  return TicketPrice;
};
