const { Modal } = require("sheweny");
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, userMention, roleMention, time } = require("discord.js");
const { resolveRobloxUser } = require("../../utils/roblox.js");
const { saveWhitelist, loadWhitelist } = require("../../utils/whitelist.js");

const DMErrorEmbed = new EmbedBuilder()
    .setTitle("Erreur")
    .setDescription("Impossible de vous envoyer un message privé. Veuillez vérifier vos paramètres de confidentialité et réessayer.")
    .setColor("#FF0000")
    .setFooter({
        text: "© Aston - Tous droits réservés | 2019 - 2024",
        iconURL:
            "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
    });

const DMSuccessEmbed = new EmbedBuilder()
    .setTitle("Demande de whitelist envoyée")
    .setDescription("Votre demande de whitelist a bien été envoyée. Vous recevrez une réponse par message privé dès lorsque votre demande aura été traitée. Merci de votre patience.")
    .setColor("#7d4efd")
    .setFooter({
        text: "© Aston - Tous droits réservés | 2019 - 2024",
        iconURL:
            "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
    });

const DMButton = new ActionRowBuilder()
    .addComponents(
        new ButtonBuilder()
            .setCustomId("whitelist-button-dm")
            .setLabel("Envoyé depuis Aston")
            .setStyle(ButtonStyle.Secondary)
            .setDisabled(true)
    )

const WHITELIST_CHANNEL_ID = process.env.WL_REQUEST_CHANNEL_ID
module.exports = class ModalComponent extends Modal {
    constructor(client) {
        super(client, ["whitelist-modal"]);
    }

    async execute(modal) {
        await modal.deferReply({ ephemeral: true });
        modal.editReply({ content: "Récupération de vos données...", ephemeral: true });

        const robloxUser = resolveRobloxUser(modal.user.id)

        modal.editReply({ content: "Récupération de vos réponses...", ephemeral: true });
        const q1 = modal.fields.getTextInputValue("q1");
        const q2 = modal.fields.getTextInputValue("q2");
        const q3 = modal.fields.getTextInputValue("q3");
        const q4 = modal.fields.getTextInputValue("q4");
        const q5 = modal.fields.getTextInputValue("q5");

        const DMSummaryEmbed = new EmbedBuilder()
            .setTitle("Résumé de votre demande de whitelist")
            .setDescription("Vous trouverez ci-dessous les réponses saisies de votre dernière demande de whitelist.")
            .addFields(
                { name: 'Pourquoi voulez-vous rejoindre Aston ?', value: q1 },
                { name: 'Comment avez-vous connu Aston ?', value: q2 },
                { name: 'Avez-vous joué sur d\'autres serveurs RP ?', value: q3 },
                { name: 'Allez-vous vous investir & jouer sur Aston ?', value: q4 },
                { name: 'Fréquence de jeu prévue sur le serveur ?', value: q5 },
            )
            .setColor("#7d4efd")
            .setFooter({
                text: "© Aston - Tous droits réservés | 2019 - 2024",
                iconURL:
                    "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
            });

        const guild = modal.member.guild
        const guildMember = guild.members.cache.get(modal.member.user.id)
        robloxUser.then(async rbx => {
            modal.editReply({ content: "Envoi de votre réponse...", ephemeral: true });
            const robloxUsername = rbx.data.cachedUsername
            const embed = new EmbedBuilder()
                .setTitle("DEMANDE DE WHITELIST REÇUE")
                .addFields(
                    { name: '👥 Utilisateur', value: userMention(modal.user.id), inline: true },
                    { name: '⏰ Membre Discord', value: time(guildMember.joinedAt, "R"), inline: true },
                    { name: '👥 Pseudo Roblox', value: `[${robloxUsername}](https://www.roblox.com/users/${rbx.data.robloxId})` },
                    { name: 'Pourquoi voulez-vous rejoindre Aston ?', value: q1 },
                    { name: 'Comment avez-vous connu Aston ?', value: q2 },
                    { name: 'Avez-vous joué sur d\'autres serveurs RP ?', value: q3 },
                    { name: 'Allez-vous vous investir & jouer sur Aston ?', value: q4 },
                    { name: 'Fréquence de jeu prévue sur le serveur ?', value: q5 },
                    { name: 'ℹ️ STATUT', value: 'EN ATTENTE' }
                )
                .setColor('7d4efd')
                .setFooter({
                    text: modal.user.id,
                    iconURL: "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=65a123d1&is=658eaed1&hm=f222bd11fdadc14faff90e236487651500819ed76eb37b4be05727a10722df71&=&format=webp&quality=lossless&width=171&height=222"
                });
            const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("whitelist-button-accept")
                        .setLabel("ACCEPTER")
                        .setStyle(ButtonStyle.Success)
                )
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("whitelist-button-decline")
                        .setLabel("REFUSER")
                        .setStyle(ButtonStyle.Danger)
                );
            // Test if we can send a private message to the user
            modal.user.send({ embeds: [DMSuccessEmbed], components: [DMButton] }).then(async () => {
                modal.user.send({ embeds: [DMSummaryEmbed], components: [DMButton] });

                modal.editReply({ content: "", embeds: [DMSuccessEmbed], ephemeral: true });

                let whitelists = await loadWhitelist();
                whitelists.push(modal.user.id);
                saveWhitelist(whitelists)
                const channel = await modal.client.channels.cache.get(WHITELIST_CHANNEL_ID);
                await channel.send({ embeds: [embed], components: [row] }).then(msg => {
                    msg.startThread({
                        name: `${modal.user.username}-${modal.user.id}`,
                        autoArchiveDuration: 60,
                        type: 'GUILD_PUBLIC_THREAD'
                    });
                })

            }).catch(() => {
                modal.editReply({ embeds: [DMErrorEmbed], ephemeral: true });
                modal.followUp({ embeds: [DMSummaryEmbed], components: [DMButton], ephemeral: true });
                return;
            });
        }).catch(error => {
            console.error(error);
            modal.editReply({ content: "Une erreur est survenue lors de la récupération de vos données. Si cette erreur persiste, veuillez <#1167172193856274465> (Catégorie 'Support Développement')", ephemeral: true });
        });
    }
};
