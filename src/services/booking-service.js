const axios = require("axios");
const {
  USER_SERVICE_PATH,
  PARK_SERVICE_PATH,
  CONFIRMATION_BINDING_KEY,
  REMINDER_BINDING_KEY,
} = require("../config/serverConfig");
const {
  TicketPassengerRepository,
  BookingRepository,
  TicketPriceRepository,
  TicketRepository,
} = require("../repository/index");
const { createChannel, publishMessage } = require("../utils/messageQueue");

class BookingService {
  static CHILD_AGE_LIMIT = 12;
  static FAMILY_DISCOUNT_THRESHOLD = 2;
  static FAMILY_DISCOUNT_RATE = 0.1; // 10% discount
  constructor() {
    this.ticketPriceRepository = new TicketPriceRepository();
    this.ticketRepository = new TicketRepository();
    this.bookingRepository = new BookingRepository();
    this.ticketPassengerRepository = new TicketPassengerRepository();
    this.channel = null;
  }

  async initializeChannel() {
    if (!this.channel) {
      this.channel = await createChannel();
    }
    return this.channel;
  }

  async createBooking({ user_id, park_id, visit_date, passengers }) {
    try {
      if (!passengers || passengers.length === 0)
        throw new Error("Passengers list is required");

      const no_of_adults = passengers.filter(
        (p) => p.age > this.constructor.CHILD_AGE_LIMIT
      ).length;

      const no_of_children = passengers.filter(
        (p) => p.age <= this.constructor.CHILD_AGE_LIMIT
      ).length;

      if (
        no_of_adults + no_of_children !== passengers.length ||
        passengers.length === 0
      ) {
        throw new Error("Invalid passenger data");
      }

      // this is to check whether user exist or not
      const userRequestURL = `${USER_SERVICE_PATH}/api/v1/users/${user_id}`;
      const userResponse = await axios.get(userRequestURL);

      console.log("RECEPIENT EMAIL : ", userResponse.data.data.email);

      if (!userResponse.data) {
        throw new Error("User not found");
      }

      // this is to check whether park exist or not
      const parkRequestURL = `${PARK_SERVICE_PATH}/api/v1/parks/${park_id}`;

      const parkResponse = await axios.get(parkRequestURL);

      const park = parkResponse.data;
      if (!park) {
        throw new Error("Park not found");
      }

      // capacity checkup here
      const bookingsForDate = await this.bookingRepository.getBookingsForDate(
        park_id,
        visit_date
      );

      const totalTickets =
        bookingsForDate.reduce(
          (sum, b) => sum + b.no_of_adults + b.no_of_children,
          0
        ) + passengers.length;

      if (totalTickets > park.capacity) {
        throw new Error("Capacity of the park exceeded");
      }

      // fetching ticket prices

      const prices = await this.ticketPriceRepository.getPricesByParkId(
        park_id
      );
      if (!prices) {
        throw new Error("Ticket price not available for this park");
      }

      let { adult_price, child_price } = prices;

      // applying family descound if the number of children is greater than family discound threshold

      if (no_of_children >= this.constructor.FAMILY_DISCOUNT_THRESHOLD) {
        child_price = child_price * (1 - this.constructor.FAMILY_DISCOUNT_RATE);
      }

      // creating ticket here

      const ticketPayload = {
        user_id,
        park_id,
        booking_date: new Date(),
        visit_date,
      };

      const ticket = await this.ticketRepository.createTicket(ticketPayload);

      // calculating total price and creating booking
      const total_price =
        no_of_adults * adult_price + no_of_children * child_price;

      const bookingPayload = {
        ticket_id: ticket.id,
        number_of_adults: no_of_adults,
        number_of_children: no_of_children,
        total_price,
      };

      const booking = await this.bookingRepository.createBooking(
        bookingPayload
      );

      // here saving the passenger details
      const passengerPromises = passengers.map((p) =>
        this.ticketPassengerRepository.createPassenger({
          booking_id: booking.id,
          name: p.name,
          age: p.age,
        })
      );
      await Promise.all(passengerPromises);

      // publishig to RabbitMQ
      const channel = await this.initializeChannel();

      // for confirmation notification
      const confirmationPayload = {
        service: "CREATE_NOTIFICATION",
        data: {
          subject: "Booking Confirmation",
          content: `Your booking for the park - ${park_id} on ${visit_date} is confirmed!`,
          recipientEmail: userResponse.data.data.email,
          status: "pending",
          type: "confirmation",
          notificationTime: new Date(),
          booking_id: booking.id,
          visit_date,
        },
      };

      await publishMessage(
        channel,
        CONFIRMATION_BINDING_KEY,
        JSON.stringify(confirmationPayload)
      );

      // for reminder notification
      const reminderTime = new Date(visit_date);
      reminderTime.setHours(6, 0, 0, 0);
      const reminderPayload = {
        service: "CREATE_NOTIFICATION",
        data: {
          subject: "Reminder for your trip to the theme park",
          content: `Reminder: Your trip to park ${park_id} is today, ${visit_date}!. Best of luck. Enjoy to your fullest.`,
          recipientEmail: userResponse.data.data.email,
          status: "pending",
          type: "reminder",
          notificationTime: reminderTime,
          booking_id: booking.id,
          visit_date,
        },
      };
      await publishMessage(
        channel,
        REMINDER_BINDING_KEY,
        JSON.stringify(reminderPayload)
      );

      return {
        booking,
        price_details: {
          adult_price,
          child_price: no_of_children >= 2 ? child_price : prices.child_price,
        },
      };
    } catch (error) {
      console.log("Something went wrong in the service layer", error);
      throw error;
    }
  }
}

module.exports = BookingService;
