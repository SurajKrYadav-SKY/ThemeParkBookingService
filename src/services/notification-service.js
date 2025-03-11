const { createChannel, publishMessage } = require("../utils/messageQueue");
const {
  CONFIRMATION_BINDING_KEY,
  REMINDER_BINDING_KEY,
} = require("../config/serverConfig");

class NotificationService {
  constructor() {
    this.channel = null;
  }

  async initializeChannel() {
    if (!this.channel) {
      this.channel = await createChannel();
    }
    return this.channel;
  }

  async sendConfirmationNotification(
    booking,
    parkId,
    visitDate,
    recipientEmail
  ) {
    const channel = await this.initializeChannel();
    const payload = {
      service: "CREATE_NOTIFICATION",
      data: {
        subject: "Booking Confirmation",
        content: `Your booking for the park - ${parkId} on ${visitDate} is confirmed!`,
        recipientEmail,
        status: "pending",
        type: "confirmation",
        notificationTime: new Date(),
        booking_id: booking.id,
        visit_date: visitDate,
      },
    };
    await publishMessage(
      channel,
      CONFIRMATION_BINDING_KEY,
      JSON.stringify(payload)
    );
  }

  async sendReminderNotification(booking, parkId, visitDate, recipientEmail) {
    const channel = await this.initializeChannel();
    const reminderTime = new Date(visitDate);
    reminderTime.setHours(6, 0, 0, 0);
    const payload = {
      service: "CREATE_NOTIFICATION",
      data: {
        subject: "Reminder for your trip to the theme park",
        content: `Reminder: Your trip to park ${parkId} is today, ${visitDate}!. Best of luck.`,
        recipientEmail,
        status: "pending",
        type: "reminder",
        notificationTime: reminderTime,
        booking_id: booking.id,
        visit_date: visitDate,
      },
    };
    await publishMessage(
      channel,
      REMINDER_BINDING_KEY,
      JSON.stringify(payload)
    );
  }
}

module.exports = NotificationService;
