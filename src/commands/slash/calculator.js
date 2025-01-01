const { Command } = require("sheweny");
const simplydjs = require("simply-djs");
const { EmbedBuilder } = require("discord.js");
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "calculator",
            description: "Accéder à une calculatrice intéractive",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
        });
    }

    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Calculatrice")
            .setDescription("Cliquez sur le bouton ci-dessous pour accéder à la calculatrice.")
            .setColor("#406dbc")
            .setFooter({
                text: "© Aston - Tous droits réservés | 2019 - 2024",
                iconURL:
                    "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
            });
        simplydjs.calculator(interaction, {
            strict: true,
            embed: embed.toJSON()
        })
    }
};