const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

/**
 * Sends logs to the specified channel.
 *
 * @param {Object} data - the data to be logged
 * @param {string} type - the type of log
 * @param {Channel} channel - the channel to send the logs to
 * @return {Promise} a Promise that resolves when the logs are sent
 */
exports.sendLogs = async function (data, type, channel) {
  // Build the embed
  let rank = "";
  if (type == "➕ AJOUT WHITELIST") {
    rank = "Accepté";
  } else if (type == "➖ RETRAIT WHITELIST") {
    rank = "Expulsé";
  } else {
    rank = "Inchangé";
  }
  const embed = new EmbedBuilder()
    .setTitle(type)
    .addFields(
      {
        name: "👥 Utilisateur",
        value: data.username,
        inline: true,
      },
      {
        name: "🆔 ID",
        value: String(data.userId),
        inline: true,
      },
      {
        name: "👥 Modérateur",
        value: "<@" + data.member + ">",
        inline: false,
      },
      {
        name: "STATUT",
        value: rank,
        inline: false,
      }
    )
    .setColor("#7d4efd")
    .setFooter({
      text: "© Aston - Tous droits réservés | 2019 - 2024",
      iconURL:
        "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
    });
  // Send the embed to the logs channel
  channel.send({ embeds: [embed] });
};

/**
 * Check if the member is whitelisted.
 *
 * @param {Object} member - The member to check for whitelisting
 * @return {Boolean} Whether the member is whitelisted
 */
exports.isWhitelisted = async function (member) {
  // Resolve discord user from their ID
  try {
    // Check if the user is whitelisted by checking if he has the whitelisted role
    return member.roles.cache.has(process.env.WHITELISTED_ROLE_ID);
  } catch (error) {
    console.error("Error fetching user:", error);
    // Handle the error here
    // if its an error, return a error code
    return false;
  }
};

/**
 * Save the user ID to the whitelist file.
 *
 * @param {string} userId - The user ID to be saved to the whitelist file.
 * @return {Promise} A promise that resolves when the user ID is successfully saved, or rejects with an error.
 */
exports.saveWhitelist = async function (userId) {
  try {
    fs.writeFileSync('./src/data/whitelists.json', JSON.stringify(userId));
} catch (err) {
    console.error('Error saving reported messages:', err);
}
}

/**
 * Loads the whitelist data from the 'whitelist.json' file. If the file doesn't exist, it creates a new file with an empty array as initial data.
 *
 * @return {Object} The parsed JSON data from the 'whitelist.json' file or an empty array if the file doesn't exist.
 */
exports.loadWhitelist = async function () {
  try {
      const data = fs.readFileSync('./src/data/whitelists.json', 'utf8');
      return JSON.parse(data);
  } catch (err) {
      if (err.code === 'ENOENT') {
          // Create a new file with empty array as initial data
          exports.saveWhitelist([]);
          // Return empty array
          return [];
      } else {
          console.error('Error loading whitelist user ids:', err);
          throw err; // rethrow the error to handle it elsewhere if needed
      }
  }
}

/**
 * Removes a user from the whitelist.
 *
 * @param {string} userId - The ID of the user to be removed from the whitelist
 * @return {Promise<void>} A Promise that resolves to undefined
 */
exports.removeWhitelist = async function (userId) {
  try {
    // Load the current whitelist from the file
    const currentWhitelist = await exports.loadWhitelist();

    // Find the index of the entry with the specified userId
    const index = currentWhitelist.findIndex(entry => entry === userId);

    // If the entry was found
    if (index !== -1) {
      // Remove the entry from the array
      currentWhitelist.splice(index, 1);

      // Save the updated whitelist back to the file
      exports.saveWhitelist(currentWhitelist);
    }
  } catch (err) {
    console.error('Error removing user from whitelist:', err);
  }
}