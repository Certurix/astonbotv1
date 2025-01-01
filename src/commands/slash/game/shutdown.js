const { Command } = require("sheweny");
const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
const { handleMessageServiceAPI } = require("../../../utils/roblox.js");

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "shutdown",
            description: "Shutdown le jeu",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
            options: [
                {
                    name: 'message',
                    description: 'Message à afficher lors du shutdown',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false,
                    required: false
                },
            ],
        });
    }

    async execute(interaction) {
        const shutdownMessage = interaction.options.getString('message');
        const topic = 'GAMESHUTDOWN'
        const data = {
            message: shutdownMessage || 'Redémarrage du jeu.'
        }
        const response = await handleMessageServiceAPI(data, topic, process.env.ROBLOX_UNIVERSE_ID)
        console.log(response)
        if (response.data == '') {
            interaction.reply({ content: 'Le jeu est maintenant en cours de shutdown', ephemeral: true })
        } else {
            interaction.reply({ content: 'Une erreur est survenue.', ephemeral: true })
        }
    }
};