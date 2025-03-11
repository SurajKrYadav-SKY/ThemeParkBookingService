const { countPassengers } = require("../utils/passengers-utils");
const UserService = require("./user-service");
const ParkService = require("./park-service");
const PricingService = require("./pricing-service");
const NotificationService = require("./notification-service");
const {
  TicketRepository,
  BookingRepository,
  TicketPassengerRepository,
} = require("../repository");

class BookingService {
  constructor() {
    this.userService = new UserService();
    this.parkService = new ParkService();
    this.pricingService = new PricingService();
    this.ticketRepository = new TicketRepository();
    this.bookingRepository = new BookingRepository();
    this.ticketPassengerRepository = new TicketPassengerRepository();
    this.notificationService = new NotificationService();
  }
  async createBooking({ user_id, park_id, visit_date, passengers }) {
    try {
      // validate and count passengers
      const { no_of_adults, no_of_children } = countPassengers(passengers);

      // checking whether the user and park exist or not
      const user = await this.userService.getUser(user_id);
      await this.parkService.getPark(park_id);

      // checking the capacity of the park
      await this.parkService.checkCapacity(
        park_id,
        visit_date,
        passengers.length
      );

      //calculating the pricing
      const { total_price, adult_price, child_price, original_child_price } =
        await this.pricingService.calculatePrice(
          park_id,
          no_of_adults,
          no_of_children
        );

      // creating the ticket
      const ticketPayload = {
        user_id,
        park_id,
        booking_date: new Date(),
        visit_date,
      };

      const ticket = await this.ticketRepository.createTicket(ticketPayload);

      // booking creation

      const bookingPayload = {
        ticket_id: ticket.id,
        number_of_adults: no_of_adults,
        number_of_children: no_of_children,
        total_price,
      };

      const booking = await this.bookingRepository.createBooking(
        bookingPayload
      );

      // save passengers
      const passengerPromises = passengers.map((p) =>
        this.ticketPassengerRepository.createPassenger({
          booking_id: booking.id,
          name: p.name,
          age: p.age,
        })
      );

      await Promise.all(passengerPromises);

      // sending the notifications
      await this.notificationService.sendConfirmationNotification(
        booking,
        park_id,
        visit_date,
        user.email
      );

      return {
        booking,
        price_details: { adult_price, child_price },
      };
    } catch (error) {
      console.log("Something went wrong in the service layer", error);
      throw error;
    }
  }
}

module.exports = BookingService;
