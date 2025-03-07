const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  PORT: process.env.PORT,
  USER_SERVICE_PATH: process.env.USER_SERVICE_PATH,
  PARK_SERVICE_PATH: process.env.PARK_SERVICE_PATH,
};
