const axios = require("axios");

/**
 * Retrieves user data based on the user ID.
 *
 * @param {string} userId - The ID of the user to retrieve
 * @return {Promise} The response object containing the user data
 */
exports.handleGetUserFromUserId = async (userId) => {
    const headers = {
        "Content-Type": "application/json",
        "api-key": process.env.ASTON_API_KEY
    };
    let response;
    try {
        response = await axios.get(`https://api.aston-rp.fr/api/player/${userId}`, { headers });
    } catch (error) {
        if (error.response && error.response.status === 404) return;
        console.error("[API ERROR]", error);
    }
    return response;
}