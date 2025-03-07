const { TicketPassenger } = require("../models/index");

class TicketPassengerRepository {
  async createPassenger(data) {
    try {
      const passenger = await TicketPassenger.create(data);
      return passenger;
    } catch (error) {
      console.log(
        "Something went wrong in the ticket passenger repository layer"
      );
      throw { error };
    }
  }
}

module.exports = TicketPassengerRepository;
