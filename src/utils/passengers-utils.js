const { CHILD_AGE_LIMIT } = require("../constants/booking-constants");

const countPassengers = (passengers) => {
  if (!passengers || passengers.length === 0) {
    throw new Error("Passengers list is required");
  }

  const no_of_adults = passengers.filter((p) => p.age > CHILD_AGE_LIMIT).length;
  const no_of_children = passengers.filter(
    (p) => p.age <= CHILD_AGE_LIMIT
  ).length;

  if (no_of_adults + no_of_children !== passengers.length) {
    throw new Error("Invalid passenger data");
  }

  return { no_of_adults, no_of_children };
};

module.exports = { countPassengers };
