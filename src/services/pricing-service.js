const {
  FAMILY_DISCOUNT_THRESHOLD,
  FAMILY_DISCOUNT_RATE,
} = require("../constants/booking-constants");
const { TicketPriceRepository } = require("../repository/index");

class PricingService {
  // constructor(ticketPriceRepository) {
  //   this.ticketPriceRepository = ticketPriceRepository;
  // }
  constructor() {
    this.ticketPriceRepository = new TicketPriceRepository();
  }

  async calculatePrice(parkId, no_of_adults, no_of_children) {
    const prices = await this.ticketPriceRepository.getPricesByParkId(parkId);
    if (!prices) {
      throw new Error("Ticket price not available for this park");
    }

    let { adult_price, child_price } = prices;
    const original_child_price = child_price;

    if (no_of_children >= FAMILY_DISCOUNT_THRESHOLD) {
      child_price *= 1 - FAMILY_DISCOUNT_RATE;
    }

    const total_price =
      no_of_adults * adult_price + no_of_children * child_price;
    return { total_price, adult_price, child_price, original_child_price };
  }
}

module.exports = PricingService;
