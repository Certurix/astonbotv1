const axios = require("axios");
const logger = require("./logger.js")
const env = require("dotenv").config();


const headers = {
  Authorization: `Bearer ${process.env.ROVER_API_KEY}`,
};

/**
 * Check if the user is verified.
 *
 * @param {object} user - the user object
 * @return {Promise} returns a promise with the roverData if user exist, else returns false
 */
exports.isVerified = async function (user) {
  const roverData = await axios.get(`https://registry.rover.link/api/guilds/${process.env.GUILD_ID}/discord-to-roblox/${user.id}`, { headers })
    .catch(async error => {
      logger.Error("Error in first API request:", error);
      // Handle the error here
      if (error.roverData.data.message === "User not found") {
        logger.Error("User not found");
        // API returns "User not found", so the user is not verified. We handle that error here by trying to fetch the user by its username
        return false
      };
    });
  return roverData
}


/**
 * Resolve the Roblox user for a given user ID.
 *
 * @param {number} userId - The user ID of the Roblox user
 * @return {Promise} The resolved Rover data
 */
exports.resolveRobloxUser = async function (userId) {

  const roverData = await axios.get(`https://registry.rover.link/api/guilds/${process.env.GUILD_ID}/discord-to-roblox/${userId}`, { headers })
    .catch(async error => {
      console.log("Error in first API request:", error);
    });

  return roverData
}


/**
 * Resolves a Discord user by their ID.
 *
 * @param {string} userId - The ID of the Discord user
 * @return {Promise} A Promise that resolves to the data of the Discord user
 */
exports.resolveDiscordUser = async function (userId) {

  const roverData = await axios.get(`https://registry.rover.link/api/guilds/${process.env.GUILD_ID}/roblox-to-discord/${userId}`, { headers })
    .catch(async error => {
      console.log("Error in first API request:", error);
    });

  return roverData
}

/**
 * Handles the message service API request.
 *
 * @param {Object} Data - The data to be sent in the request
 * @param {string} Topic - The topic for the message
 * @param {number} UniverseID - The ID of the universe
 * @return {Promise} The response from the API request
 */
exports.handleMessageServiceAPI = async (Data, Topic, UniverseID) => {
  const jsonData = JSON.stringify(Data)

  const headers = {
    'x-api-key': process.env.GAME_API_KEY,
    'Content-Type': 'application/json'
  };
  const url = `https://apis.roblox.com/messaging-service/v1/universes/${UniverseID}/topics/${Topic}`;

  const response = await axios.post(url, jsonData, { headers: headers })
    .catch(error => {
      logger.Error('Error publishing message:', error);
    });
  return response
}

exports.currentPlayers = async () => {
    const response = await axios.get(
        `https://games.roproxy.com/v1/games?universeIds=${process.env.ROBLOX_UNIVERSE_ID}`
      );
      const playersPlaying = response.data.data[0].playing || 0;
    
      return playersPlaying
}

exports.formatPlaytimeLong = (playtime) => {
  const hours = Math.floor(playtime / 60)
  const minutes = playtime % 60

  return `${hours}h ${minutes}m`
}