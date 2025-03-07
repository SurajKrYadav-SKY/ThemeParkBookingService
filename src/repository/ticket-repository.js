const { Ticket } = require("../models/index");

class TicketRepository {
  async createTicket(data) {
    try {
      const ticket = await Ticket.create(data);
      return ticket;
    } catch (error) {
      console.log("Something went wrong in the ticket repository layer");
      throw { error };
    }
  }

  async findTicketById(id) {
    try {
      const ticket = await Ticket.findByPk(id);
      return ticket;
    } catch (error) {
      console.log("Something went wrong in the ticket repository layer");
      throw { error };
    }
  }
}

module.exports = TicketRepository;
