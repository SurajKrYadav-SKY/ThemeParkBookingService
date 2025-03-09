const express = require("express");
const router = express.Router();

const BookingController = require("../../controllers/booking-controller");
const bookingController = new BookingController();

router.post("/bookings", bookingController.createBooking);
router.post("/publish", bookingController.sendMessageToQueue);

module.exports = router;
