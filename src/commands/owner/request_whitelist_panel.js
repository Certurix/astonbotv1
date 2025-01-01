const { Command } = require("sheweny");
const { EmbedBuilder, ModalBuilder, ButtonBuilder,
    TextInputStyle, ButtonStyle, ActionRowBuilder } = require("discord.js");

module.exports = class RequestWhitelistPanel extends Command {
    constructor(client) {
        super(client, {
            name: "requestwhitelistpanel",
            description: "Envoyer le panel de requête de whitelist",
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
            .setTitle("REQUÊTE DE WHITELIST")
            .setDescription(`
            **Afin de récupérer votre rôle sur le groupe principal d'Aston, suivez les étapes suivantes :**
:one: Cliquez sur le bouton 'Accéder au groupe' pour être redirigé vers le groupe d'Aston
:two: Faites une demande pour rejoindre le groupe
:three: Cliquez sur le bouton 'Vérifier ma requête'
:four: Après avoir cliqué sur le bouton, vous devriez récupérer votre rôle sur le groupe principal d'Aston.

:information_source: Vous n'aurez pas à refaire une demande de whitelist.
            `)
            .setColor(0x7d4efd)
            .setFooter({
                text: "© Aston - Tous droits réservés | 2019 - 2024",
                iconURL: "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=65a123d1&is=658eaed1&hm=f222bd11fdadc14faff90e236487651500819ed76eb37b4be05727a10722df71&=&format=webp&quality=lossless&width=171&height=222"
            })

        const btn2 = new ButtonBuilder()
            .setCustomId("request-whitelist-button")
            .setLabel("Vérifier ma requête")
            .setStyle(ButtonStyle.Primary)

        const row = new ActionRowBuilder()
            .addComponents(btn2);

        await interaction.reply({ embeds: [embed], components: [row] })

    }
};