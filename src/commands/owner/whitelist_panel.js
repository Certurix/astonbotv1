const { Command } = require("sheweny");
const { EmbedBuilder, ModalBuilder, ButtonBuilder,
    TextInputStyle, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = class WhitelistPanel extends Command {
    constructor(client) {
        super(client, {
            name: "whitelistpanel",
            description: "Envoyer le panel de whitelist",
            type: "SLASH_COMMAND",
            category: "Owner",
            cooldown: 3,
        });
    }

    async execute(interaction) {
        const admins = process.env.ADMINS;

        if (!admins.includes(interaction.member.id)) {
            const noAdminPerm = new EmbedBuilder()
                .setTitle("❗ WHITELIST")
                .setDescription("Vous n'avez pas le droit d'utiliser cette commande.")
                .setColor("#7d4efd")
                .setFooter({
                    text: "© Aston - Tous droits réservés | 2019 - 2024",
                    iconURL: "https://cdn.discordapp.com/attachments/1167234087015165974/1167426140391088138/pic.png",
                });
            return interaction.reply({ embeds: [noAdminPerm], ephemeral: true });
        }

        const embed = new EmbedBuilder()
            .setTitle("DEMANDE DE WHITELIST")
            .setDescription("Afin d'avoir accès à la suite du serveur et pouvoir jouer à notre jeu, il est obligatoire de passer une whitelist.\n\nRien de compliqué ! Il te suffit de faire une demande sur [notre groupe roblox](https://www.roblox.com/groups/4795821/Aston-RP-FR#!/about) et de remplir attentivement le formulaire présent en dessous de ce message.\n\n> **Après avoir envoyé ta demande, tu recevras dans un délai raisonnable un message privé t'informant du statut de ta demande, qu'elle soit acceptée, refusée ou en attente.**\n\n⚠️ **Pense bien à activer tes messages privés sur le serveur afin que le bot puisse te notifier lorsque ta demande aura été traitée !**\n\nSi tu rencontre un quelconque problème, n'hésite pas à nous contacter par message `Support STAFF` <#1167172193856274465> ou en vocal <#1167179905549746226>.")
            .setColor(0x7d4efd)
            .setFooter({
                text: "© Aston - Tous droits réservés | 2019 - 2024",
                iconURL: "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=65a123d1&is=658eaed1&hm=f222bd11fdadc14faff90e236487651500819ed76eb37b4be05727a10722df71&=&format=webp&quality=lossless&width=171&height=222"
            })

        const button = new ButtonBuilder()
            .setCustomId("whitelist-button")
            .setLabel("Faire une demande")
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
            .addComponents(button);
        await interaction.reply({ embeds: [embed], components: [row] })

    }
};