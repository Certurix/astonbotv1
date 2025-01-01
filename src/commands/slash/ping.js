const { Command } = require("sheweny");
const { EmbedBuilder } = require("discord.js");

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "ping",
            description: "Consulter le ping du bot",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
        });
    }

    async execute(interaction) {
        const startTime = Date.now();
        const reply = await interaction.reply({ content: "Ping en cours..." });
        const endTime = Date.now();

        const embed = new EmbedBuilder()
            .setDescription(`:stopwatch: Latence \`\`>\`\` ${endTime - startTime}ms\n:satellite: Websocket \`\`>\`\` ${Date.now() - interaction.createdTimestamp}ms`)
            .setColor("#00FF00")
            .setFooter({
                text: "© Aston - Tous droits réservés | 2019 - 2024",
                iconURL:
                    "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
            });

        await reply.edit({ content: "", embeds: [embed] });
    }
};