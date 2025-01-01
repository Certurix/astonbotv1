const { Command } = require("sheweny");
const { EmbedBuilder, ApplicationCommandOptionType, channelMention } = require("discord.js");
const sqlite3 = require('sqlite3').verbose();


module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "sticky",
            description: "Envoyer message à épinglé dans un salon spécifique",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
            options: [
                {
                    name: 'message',
                    description: 'Message à envoyer',
                    type: ApplicationCommandOptionType.String,
                    required: true
                },
                {
                    name: 'channel',
                    description: 'Salon où envoyer le message',
                    type: ApplicationCommandOptionType.Channel,
                    required: true
                },
            ],
        });
    }

    async execute(interaction) {
        const message = interaction.options.getString('message');
        const channel = interaction.options.getChannel('channel');

        // Open the database
        let db = new sqlite3.Database('./src/data/stickyMessages.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

        // Insert the sticky message into the database
        db.run(`INSERT INTO StickyMessages(channelId, message) VALUES(?, ?)`, [channel.id, message], function (err) {
            if (err) {
                return console.log(err.message);
            }
            console.log(`A row has been inserted with rowid ${this.lastID}`);
        });

        // Close the database
        db.close();

        // Confirm the action to the user
        await interaction.reply({ content: `Le message a été épinglé dans ${channelMention(channel.id)}`, ephemeral: true });
    }
};