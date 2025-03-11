const axios = require("axios");
const { USER_SERVICE_PATH } = require("../config/serverConfig");

class UserService {
  async getUser(userId) {
    const userRequestURL = `${USER_SERVICE_PATH}/api/v1/users/${userId}`;
    const response = await axios.get(userRequestURL);
    if (!response.data) {
      throw new Error("User not found");
    }
    return response.data.data;
  }
}

module.exports = UserService;
