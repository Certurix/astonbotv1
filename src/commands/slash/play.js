const { Command } = require("sheweny");
const { EmbedBuilder, userMention, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType } = require("discord.js");

module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "play",
            description: "Envoi un message contenant les informations pour jouer sur le jeu",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
            aliases: ["jouer", "connexion", "rejoindre"],
            options: [
                {
                    name: 'utilisateur',
                    description: 'Mentionnez un utilisateur pour le notifier dans le message',
                    type: ApplicationCommandOptionType.User,
                    autocomplete: true,
                    required: false
                },
            ],
        });
    }

    async execute(interaction) {
        const user = interaction.options.getUser('utilisateur');
        const hasUser = user ? userMention(user.id) : ""
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Règlement")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://aston-rp.fr/reglement"),
                new ButtonBuilder()
                    .setLabel("Jouer")
                    .setStyle(ButtonStyle.Link)
                    .setURL("https://www.roblox.com/games/start?placeId=3616171959")
            );
        const embed = new EmbedBuilder()
            .setDescription("Assurez-vous d'avoir rejoint le groupe et d'avoir les prérequis pour jouer sur le jeu. N'oubliez pas que vous serez en mesure de jouer uniquement sur les sessions organisées par le Staff !\n> Pour jouer directement au jeu (sans passer par le site), cliquez sur le bouton ci-dessous.")
            .setFooter({
                text: "© Aston - Tous droits réservés | 2019 - 2024",
                iconURL:
                    "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
            });
            await interaction.reply({ embeds: [embed], components: [row], content: hasUser });
    }
};