const { Event } = require("sheweny");
const { ActivityType } = require("discord.js");
const axios = require("axios");
const { OpenCloud } = require("rbxcloud");
const logger = require("../utils/logger.js");
module.exports = class InteractionsLogger extends Event {
    constructor(client) {
        super(client, "interactionCreate", {
            description: "Logs each interactions on the bot",
            emitter: client,
        });
    }

    async execute(interaction) {
        // check if interaction type is ButtonInteraction or not
        if (interaction.isButton()) {
            logger.Info(`${interaction.user.username} (${interaction.user.id}) clicked on ${interaction.customId}.`);
        } else if (interaction.isStringSelectMenu()) {
            logger.Info(`${interaction.user.username} (${interaction.user.id}) selected ${interaction.customId}.`);
        } else if (interaction.isModalSubmit()) {
            logger.Info(`${interaction.user.username} (${interaction.user.id}) submitted ${interaction.customId}.`);
        } else {
            logger.Info(`${interaction.user.username} (${interaction.user.id}) ran ${interaction.commandName}.`);
        }
    }
};