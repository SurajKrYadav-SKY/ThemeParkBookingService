const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  USER_SERVICE_PATH: process.env.USER_SERVICE_PATH,
  PARK_SERVICE_PATH: process.env.PARK_SERVICE_PATH,
  MESSAGE_BORKER_URL: process.env.MESSAGE_BORKER_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  REMINDER_BINDING_KEY: process.env.REMINDER_BINDING_KEY,
  CONFIRMATION_BINDING_KEY: process.env.CONFIRMATION_BINDING_KEY,
};
