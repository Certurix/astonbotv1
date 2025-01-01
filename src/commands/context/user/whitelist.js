// const { Command } = require("sheweny");
// const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
// const axios = require("axios");
// const noblox = require("noblox.js");
// const { resolveRobloxUser } = require("../../../utils/roblox.js");
// const { sendLogs } = require("../../../utils/whitelist.js")
// const logger = require("../../../utils/logger.js");

// const INVITED_ROLE_ID = 1;
// const ROBLOX_GROUP_ID = process.env.ROBLOX_GROUP_ID;
// module.exports = class Context_WhitelistCommand extends Command {
//   constructor(client) {
//     super(client, {
//       name: "(Un)Whitelist",
//       description: "(Un)Whitelist un joueur",
//       type: "CONTEXT_MENU_USER",
//       category: "Moderation",
//       cooldown: 3,
//     });
//   }

//   async execute(interaction) {
//     const guild = await interaction.guild;
//     const GuildMember = await interaction.member;
//     const targetMember = await guild.members.fetch(interaction.targetId);
//     const targetUsername = targetMember.user.globalName;
//     const logChannel = await interaction.client.channels.cache.get(
//       process.env.WL_LOGS_CHANNEL_ID
//     );

//     // Check if the targetMember is an admin. An admin cannot be whitelisted/unwhitelisted.
//     const admins = interaction.client.options.admins;
//     if (admins.includes(targetMember.id)) {
//       const embed = new EmbedBuilder()
//         .setTitle("❗ WHITELIST")
//         .setDescription("Cet utilisateur est un administrateur.")
//         .setColor("#7d4efd")
//         .setFooter({
//           text: "© Aston - Tous droits réservés | 2019 - 2024",
//         })

//       return await interaction.reply({ embeds: [embed], ephemeral: true });
//     }

//     if (!interaction.member.roles.cache.has(process.env.WL_REQUIRED_ROLE_ID)) {
//       const embed = new EmbedBuilder()
//         .setTitle("❗ ERREUR")
//         .setDescription(
//           "Vous n'avez pas la permission d'utiliser cette commande."
//         )
//         .setColor("#7d4efd")
//         .setFooter({
//           text: "© Aston - Tous droits réservés | 2019 - 2024",
//         });

//       return await interaction.reply({ embeds: [embed], ephemeral: true });
//     }

//     const whitelistedRole = await guild.roles.cache.find(
//       (role) => role.id == process.env.WHITELISTED_ROLE_ID
//     );
//     const notwhitelistedRole = await guild.roles.cache.find(
//       (role) => role.id == process.env.UNWHITELISTED_ROLE_ID
//     );

//     interaction.deferReply({ ephemeral: true });

//     const targetRobloxUser = await resolveRobloxUser(interaction.targetId);
//     const targetRobloxId = targetRobloxUser.data.robloxId;
//     const groupRole = await noblox.getRankInGroup(
//       ROBLOX_GROUP_ID,
//       targetRobloxId
//     );

//     if (groupRole == INVITED_ROLE_ID) {

//       await noblox.setRank(process.env.ROBLOX_GROUP_ID, targetRobloxId, 98108536);
//       targetMember.roles.add(whitelistedRole);
//       targetMember.roles.remove(notwhitelistedRole);

//       const embed = new EmbedBuilder()
//         .setTitle("✅ WHITELIST")
//         .setColor("#7d4efd")
//         .setDescription(
//           `**@${targetUsername} | ${targetRobloxId}** à été ajouté avec succès.`
//         )
//         .setFooter({
//           text: "© Aston - Tous droits réservés | 2019 - 2024",
//           iconURL:
//             "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//         });
//       await interaction.editReply({ embeds: [embed] });
//       logger.Success(`Added ${targetUsername} (${targetRobloxId}) to the Whitelist.`);
//       const logsData = {
//         userId: targetRobloxId,
//         targetUsername: targetUsername,
//         member: GuildMember,
//       };

//       await sendLogs(logsData, "➕ AJOUT WHITELIST", logChannel);

//     } else if (groupRole == 0) {
//       // User not in group
//       const embed = new EmbedBuilder()
//         .setTitle("❗ ERREUR")
//         .setColor("#7d4efd")
//         .setDescription(`Le joueur ${targetUsername} n'est pas dans le groupe.`)
//         .setFooter({
//           text: "© Aston - Tous droits réservés | 2019 - 2024",
//         });
//       // Add a button to the embed
//       const profileButton = new ButtonBuilder()
//         .setStyle(ButtonStyle.Link)
//         .setURL(`https://www.roblox.com/users/${targetRobloxId}/profile`)
//         .setLabel("Voir le profil");

//       const row = new ActionRowBuilder().addComponents(profileButton);
//       await interaction.editReply({ embeds: [embed], components: [row] });
//     } else {
//       await noblox.setRank(process.env.ROBLOX_GROUP_ID, targetRobloxId, 32077396);
//       targetMember.roles.add(notwhitelistedRole);
//       targetMember.roles.remove(whitelistedRole);

//       const embed = new EmbedBuilder()
//         .setTitle("❌ WHITELIST")
//         .setColor("#7d4efd")
//         .setDescription(
//           `**@${targetUsername} | ${targetRobloxId}** à été retiré avec succès.`
//         )
//         .setFooter({
//           text: "© Aston - Tous droits réservés | 2019 - 2024",
//           iconURL:
//             "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//         });

//       await interaction.editReply({ embeds: [embed] });
//       logger.Success(`Removed ${targetUsername} (${targetRobloxId}) from the Whitelist.`);

//       const logsData = {
//         "userId": targetRobloxId,
//         "username": targetUsername,
//         "member": GuildMember,
//       };
//       await sendLogs(logsData, "➖ RETRAIT WHITELIST", logChannel);
//     }
//   }
// };