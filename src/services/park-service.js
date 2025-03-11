const axios = require("axios");
const { PARK_SERVICE_PATH } = require("../config/serverConfig");
const { BookingRepository } = require("../repository/index");

class ParkService {
  // constructor(bookingRepository) {
  //   this.bookingRepository = bookingRepository;
  // }
  constructor() {
    this.bookingRepository = new BookingRepository();
  }

  async getPark(parkId) {
    const parkRequestURL = `${PARK_SERVICE_PATH}/api/v1/parks/${parkId}`;
    const response = await axios.get(parkRequestURL);
    if (!response.data) {
      throw new Error("Park not found");
    }
    return response.data;
  }

  async checkCapacity(parkId, visitDate, totalPassengers) {
    const bookingsForDate = await this.bookingRepository.getBookingsForDate(
      parkId,
      visitDate
    );
    const totalTickets =
      bookingsForDate.reduce(
        (sum, b) => sum + b.no_of_adults + b.no_of_children,
        0
      ) + totalPassengers;

    const park = await this.getPark(parkId);
    if (totalTickets > park.capacity) {
      throw new Error("Capacity of the park exceeded");
    }
    return true;
  }
}

module.exports = ParkService;
