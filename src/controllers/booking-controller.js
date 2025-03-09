const {
  REMINDER_BINDING_KEY,
  CONFIRMATION_BINDING_KEY,
} = require("../config/serverConfig");
const BookingService = require("../services/booking-service");
const { publishMessage, createChannel } = require("../utils/messageQueue");

class BookingController {
  constructor() {
    this.bookingService = new BookingService();
  }

  // this is for demo
  sendMessageToQueue = async (req, res) => {
    const channel = await createChannel();
    const { type } = req.body;

    const binding_key =
      type === "reminder" ? REMINDER_BINDING_KEY : CONFIRMATION_BINDING_KEY;
    const payload = {
      data: {
        subject: req.body.subject || "",
        content: req.body.content || "",
        recipientEmail: req.body.recipientEmail || "",
        type: type || "",
        notificationTime: req.body.notificationTime || new Date(),
        booking_id: req.body.booking_id || "",
        visit_date: req.body.visit_date || "",
      },
      service: "CREATE_NOTIFICATION",
    };
    try {
      await publishMessage(channel, binding_key, JSON.stringify(payload));
      return res
        .status(200)
        .json({ message: "Message sent to the queue successfully." });
    } catch (error) {
      console.error("Error sending message to the queue:", error);
      return res
        .status(500)
        .json({ message: "Failed to send message to the queue." });
    }
  };

  createBooking = async (req, res) => {
    try {
      const { user_id, park_id, visit_date, passengers } = req.body;
      const response = await this.bookingService.createBooking({
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
}

module.exports = BookingController;
