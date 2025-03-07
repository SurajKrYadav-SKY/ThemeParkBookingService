const BookingService = require("../services/booking-service");

const bookingService = new BookingService();

const createBooking = async (req, res) => {
  try {
    const { user_id, park_id, visit_date, passengers } = req.body;
    const response = await bookingService.createBooking({
      user_id,
      park_id,
      visit_date,
      passengers,
    });
    res.status(201).json({
      data: response,
      success: true,
      message: "Successfully created the booking",
    });
  } catch (error) {
    console.log("Something went wrong in the controller layer");
    res.status(500).json({
      success: false,
      message: "Failed to create the booking",
      error: error,
    });
  }
};

module.exports = createBooking;
