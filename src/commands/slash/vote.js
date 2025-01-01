const { Command } = require("sheweny");
const { EmbedBuilder, ApplicationCommandOptionType, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const axios = require("axios");
const { currentPlayers } = require("../../utils/roblox.js");

// Name: Vote
// Description: Permet à l'utilisateur de voir les derniers votes du top-serveurs ou de voter pour le serveur.
module.exports = class VoteCommand extends Command {
    constructor(client) {
        super(client, {
            name: "vote",
            description: "Permet de voter ou de voir les derniers vote du top-serveurs",
            type: "SLASH_COMMAND",
            category: "Misc",
            aliases: ["voter"],
            cooldown: 3,
            options: [
                {
                    name: "list",
                    description: "Permet de voir les derniers votes du top-serveurs",
                    type: ApplicationCommandOptionType.Subcommand,
                    required: false
                },
                {
                    name: "vote",
                    description: "Permet de voter pour le serveur",
                    type: ApplicationCommandOptionType.Subcommand,
                    required: false
                },
                {
                    name: "reminder",
                    description: "Envoi un message de rappel pour voter",
                    type: ApplicationCommandOptionType.Subcommand,
                    required: false
                }
            ]
        });
    }

    async execute(interaction) {
        const subcmd = interaction.options.getSubcommand();
        const button = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Voter")
            .setURL(`https://top-serveurs.net/roblox/vote/astonfr?pseudo=${interaction.user.displayName}`)
            .setEmoji("🗳️")

        const button2 = new ButtonBuilder()
            .setStyle(ButtonStyle.Link)
            .setLabel("Voter")
            .setURL(`https://top-serveurs.net/roblox/vote/astonfr`)
            .setEmoji("🗳️")
        const actionRow = new ActionRowBuilder()
            .addComponents(button)


        const actionRow2 = new ActionRowBuilder()
            .addComponents(button2)
        if (subcmd == 'reminder') {

            const reminderEmbed = new EmbedBuilder()
                .setTitle("Rappel")
                .setDescription("N'oubliez pas de voter pour le serveur en cliquant sur le bouton ci-dessous.")
                .setColor("#00FF00")
            const channel = interaction.channel;
            await interaction.reply({ content: "Rappel envoyé !", ephemeral: true })
            return await channel.send({ embeds: [reminderEmbed], components: [actionRow2] });
        } else if (subcmd == 'list') {
            await interaction.deferReply({ ephemeral: true });
            await interaction.editReply("Récupération des votes en cours...")
            const votes = await axios.get(`https://api.top-serveurs.net/v1/servers/${process.env.VOTE_TOKEN}/players-ranking`)
                .then(async res => {
                    await interaction.editReply("Récupération des données en cours...")
                    let votes = "";
                    res.data.players.forEach((player, index) => {
                        let playerName = player.playername === "" ? "*Inconnu*" : player.playername;
                        votes += `**${index + 1}.** ${playerName} - ${player.votes} votes\n`
                    });
                    const latestVoteEmbed = new EmbedBuilder()
                        .setTitle("Derniers votes")
                        .setDescription(votes)
                        .setColor("#00FF00")
                        .setFooter({
                            text: "© Aston - Tous droits réservés | 2019 - 2024",
                            iconURL:
                                "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
                        });
                    return await interaction.editReply({ content: '', embeds: [latestVoteEmbed] })
                });
        } else {
            const voteEmbed = new EmbedBuilder()
                .setTitle("Voter")
                .setDescription("Cliquez sur le bouton ci-dessous afin de voter avec votre pseudonyme Roblox.")
                .setColor("#00FF00")
                .setFooter({
                    text: "© Aston - Tous droits réservés | 2019 - 2024",
                    iconURL:
                        "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
                });
            return await interaction.reply({ embeds: [voteEmbed], components: [actionRow], ephemeral: true});

        }
    }
};