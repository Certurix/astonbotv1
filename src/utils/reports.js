const fs = require("fs");
const { EmbedBuilder, messageLink, userMention } = require("discord.js");

/**
 * Sends a report message to the specified channel.
 *
 * @param {string} message - the message to be reported
 * @param {User} user - the user who is reporting the message
 * @param {TextChannel} channel - the channel where the report should be sent
 * @return {void}
 */
exports.sendReport = function (message, user, channel) {
  const reportEmbed = new EmbedBuilder()
    .setTitle("SIGNALEMENT DE MESSAGE")
    .addFields(
      {
        name: "📥 Auteur",
        value: userMention(message.author.id),
        inline: true,
      },
      {
        name: "🔗 Lien du message",
        value: messageLink(message.channelId, message.id),
        inline: true,
      },
      {
        name: "⚠️ Signaleur",
        value: userMention(user.id),
        inline: true,
      },
      {
        name: "💬 Message",
        value: message.content,
        inline: false,
      }
    )
    .setColor("#7d4edf")
    .setFooter({
      text: "© Aston - Tous droits réservés | 2019 - 2024",
      iconURL:
        "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=65a123d1&is=658eaed1&hm=f222bd11fdadc14faff90e236487651500819ed76eb37b4be05727a10722df71&=&format=webp&quality=lossless&width=171&height=222",
    })
    .setTimestamp();
  channel.send({ embeds: [reportEmbed] });
};

/**
 * Saves the reports to a JSON file.
 *
 * @param {Array} reports - The array of reports to be saved
 * @return {Promise} A promise that resolves when the reports are saved
 */
exports.saveReports = async function (reports) {
  try {
    fs.writeFileSync("./src/data/reports.json", JSON.stringify(reports));
  } catch (err) {
    console.error("Error saving reported messages:", err);
  }
};

/**
 * Loads the reports from the reports.json file. If the file does not exist, creates a new file with an empty array as initial data and returns an empty array.
 *
 * @return {Array} The reports loaded from the file or an empty array if the file does not exist.
 */
exports.loadReports = async function () {
  try {
    const data = fs.readFileSync("./src/data/reports.json", "utf8");
    return JSON.parse(data);
  } catch (err) {
    if (err.code === "ENOENT") {
      // Create a new file with empty array as initial data
      exports.saveReports([]);
      // Return empty array
      return [];
    } else {
      console.error("Error loading reported messages:", err);
      throw err; // rethrow the error to handle it elsewhere if needed
    }
  }
};

/**
 * Remove a report with the given reportId from the reports file.
 *
 * @param {string} reportId - The ID of the report to be removed
 * @return {Promise<void>} A promise that resolves when the report is successfully removed
 */
exports.removeReport = async function (reportId) {
    try {
      // Load the current reports from the file
      const currentReports = exports.loadReports();
  
      // Find the index of the entry with the specified reportId
      const index = currentReports.findIndex((entry) => entry.id === reportId);
  
      // If the entry was found, remove the entry from the array
      currentReports.splice(index, 1);
      // Save the updated reports back to the file
      exports.saveReports(currentReports);
    } catch (err) {
      console.error("Error removing report:", err);
      throw err;
    }
  };