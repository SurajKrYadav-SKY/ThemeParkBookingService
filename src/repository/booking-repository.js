const Booking = require("../models/booking");

class BookingRepository {
  async createBooking(data) {
    try {
      const booking = await Booking.create(data);
      return booking;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }

  async findBookingById(id) {
    try {
      const booking = await Booking.findByPk(id);
      return booking;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }

  async getBookingsForDate(pard_id, visit_date) {
    try {
      const bookingForDate = await Booking.findAll({
        include: [
          {
            model: Ticket,
            where: { pard_id, visit_date },
          },
        ],
      });
      return bookingForDate;
    } catch (error) {
      console.log("Something went wrong in the repository layer");
      throw { error };
    }
  }
}

module.exports = BookingRepository;
