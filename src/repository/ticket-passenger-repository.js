const TicketPassenger = require("../models/index");

class TicketPassengerRepository {
  async createPassenger(data) {
    try {
      const passenger = await TicketPassenger.create(data);
      return passenger;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }
}

module.exports = TicketPassengerRepository;
