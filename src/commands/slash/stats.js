const { Command } = require("sheweny");
const { EmbedBuilder } = require("discord.js");

const { currentPlayers } = require("../../utils/roblox.js");

module.exports = class StatsCommand extends Command {
    constructor(client) {
        super(client, {
            name: "stats",
            description: "Envoi des statistiques générales sur le jeu",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
        });
    }

    async execute(interaction) {
        const memberCount = interaction.guild.memberCount;

        const whitelistedRole = interaction.guild.roles.cache.find(role => role.id === "1167133705370861628");
        const whitelistedCount = interaction.guild.members.cache.filter(member => member.roles.cache.has(whitelistedRole.id)).size;
        const players = await currentPlayers();
        const embed = new EmbedBuilder()
            .setTitle("Statistiques")
            .setTimestamp()
            .addFields(
                { name: "Membres (Total)", value: `${memberCount} membres`, inline: true },
                { name: "Membres (Whitelist)", value: `${whitelistedCount}`, inline: true },
                { name: "Joueurs (En jeu)", value: `${players} joueur${players > 1 ? "s" : ""}`, inline: true }
            )
            .setFooter({
                text: "© Aston - Tous droits réservés | 2019 - 2024",
                iconURL:
                    "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
            });

        await interaction.reply({ embeds: [embed], ephemeral: true });
    }
};