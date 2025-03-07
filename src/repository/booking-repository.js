const { Booking, Ticket } = require("../models/index");

class BookingRepository {
  async createBooking(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      console.log("Something went wrong in the booking repository layer");
      throw { error };
    }
  }

  async findBookingById(id) {
    try {
      const booking = await Booking.findByPk(id);
      return booking;
    } catch (error) {
      console.log("Something went wrong in the booking repository layer");
      throw { error };
    }
  }

  async getBookingsForDate(park_id, visit_date) {
    try {
      const bookingForDate = await Booking.findAll({
        include: [
          {
            model: Ticket,
            where: { park_id, visit_date },
          },
        ],
      });
      return bookingForDate;
    } catch (error) {
      console.log("Something went wrong in the booking repository layer");
      throw { error };
    }
  }
}

module.exports = BookingRepository;
