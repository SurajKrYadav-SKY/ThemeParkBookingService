const TicketPrice = require("../models/index");

class TicketPriceRepository {
  async getPricesByParkId(park_id) {
    try {
      const pricesByPark = await TicketPrice.findOne({
        where: { park_id },
      });
      return pricesByPark;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }
}

module.exports = TicketPriceRepository;
