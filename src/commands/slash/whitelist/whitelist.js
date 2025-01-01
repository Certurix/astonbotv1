// const { Command } = require("sheweny");
// const {
//   EmbedBuilder,
//   ButtonBuilder,
//   ButtonStyle,
//   ActionRowBuilder,
//   ApplicationCommandOptionType,
// } = require("discord.js");
// const axios = require("axios");
// const noblox = require("noblox.js");

// const logger = require("../../../utils/logger.js");
// const { isVerified } = require("../../../utils/roblox.js");
// const { sendLogs } = require("../../../utils/whitelist.js");
// const STAFF_ROLE_ID = process.env.WL_REQUIRED_ROLE_ID;
// const INVITED_ROLE_ID = 1;

// const headers = {
//   Authorization: `Bearer ${process.env.ROVER_API_KEY}`,
// };

// module.exports = class WhitelistCommand extends Command {
//   constructor(client) {
//     super(client, {
//       name: "whitelist",
//       description: "(Un)Whitelist un joueur",
//       type: "SLASH_COMMAND",
//       category: "Moderation",
//       cooldown: 3,
//       adminsOnly: true,
//       options: [
//         {
//           name: "username",
//           description: "Le nom du joueur (Roblox) a whitelist",
//           type: ApplicationCommandOptionType.String,
//           required: true,
//         },
//         {
//           name: "send-dm",
//           description: "Envoyer un DM au joueur",
//           type: ApplicationCommandOptionType.Boolean,
//           required: false,
//         },
//       ],
//     });
//   }

//   async execute(interaction) {
//     const member = interaction.member;
//     const guild = interaction.guild;
//     const channel = interaction.client.channels.cache.get(
//       process.env.WL_LOGS_CHANNEL_ID
//     );

//     const admins = process.env.ADMINS;

//     interaction.deferReply({ ephemeral: true });

//     if (!interaction.member.roles.cache.has(STAFF_ROLE_ID)) {
//       const embed = new EmbedBuilder()
//         .setTitle("❗ WHITELIST")
//         .setDescription("Vous n'êtes pas autorisé à utiliser cette commande.")
//         .setColor("#7d4efd")
//         .setFooter({
//           text: "© Aston - Tous droits réservés | 2019 - 2024",
//           iconURL:
//             "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//         });
//       return interaction.reply({ embeds: [embed], ephemeral: true });
//     }
//     const whitelistedRole = guild.roles.cache.find(
//       (role) => role.id == process.env.WHITELISTED_ROLE_ID
//     );
//     const notwhitelistedRole = guild.roles.cache.find(
//       (role) => role.id == process.env.UNWHITELISTED_ROLE_ID
//     );

//     const username = interaction.options.getString("username");
//     const sendDM = interaction.options.getBoolean("send-dm");
//     // Get the Roblox ID from the player username (input)
//     const robloxUserId = await noblox.getIdFromUsername(username);

//     // Request to RoVer API to get the discord user id from the Roblox username
//     const user = await axios.get(
//       `https://registry.rover.link/api/guilds/${process.env.GUILD_ID}/roblox-to-discord/${robloxUserId}`,
//       { headers }
//     );
//     const guildMember = interaction.guild.members.cache.get(
//       user.data.discordUsers[0].user.id
//     );

//     if (admins.includes(guildMember.id)) {
//       const embed = new EmbedBuilder()
//         .setTitle("❗ WHITELIST")
//         .setDescription("Cet utilisateur est un administrateur.")
//         .setColor("#7d4efd")
//         .setFooter({
//           text: "© Aston - Tous droits réservés | 2019 - 2024",
//         });

//       return await interaction.editReply({ embeds: [embed], ephemeral: true });
//     }

//     const embed = new EmbedBuilder()
//       .setTitle("❗ WHITELIST")
//       .setDescription(
//         `${user.data.discordUsers[0].user.username} n'est pas sur le serveur.`
//       )
//       .setColor("#7d4efd")
//       .setFooter({
//         text: "© Aston - Tous droits réservés | 2019 - 2024",
//       });
//     if (!guildMember) return interaction.editReply({ embeds: [embed] });
//     // If verified, we check if the user has the Invited role on the roblox group. If so, we set his rank to "Joueur" and we give him the Whitelisted role on DISCORD, if not we set it to "Invités" and give him the same role on DISCORD. If not verified, we send an embed message error.
//     const verified = await isVerified(user.data.discordUsers[0].user);
//     try {
//       if (verified) {
//         // Check if the user has submitted a join request on the group
//         const currentRequest = await noblox.getJoinRequest(process.env.ROBLOX_GROUP_ID, robloxUser.data.robloxId);

//         console.log(currentRequest);

//         console.log(
//           `${username} is ${user.data.discordUsers[0].user.username}`
//         );

//         if (groupRole == INVITED_ROLE_ID) {
//           console.log(
//             `${user.data.discordUsers[0].user.username} will be Whitelisted.`
//           );
//           // If the user has the Invited role, we set his rank to "Joueur", give him the Whitelisted role and delete the not whitelisted role on DISCORD
//           await noblox.setRank(
//             process.env.ROBLOX_GROUP_ID,
//             robloxUserId,
//             98108536
//           );
//           interaction.client.users
//             .fetch(user.data.discordUsers[0].user.id)
//             .then(async (discordUser) => {
//               interaction.guild.members.cache
//                 .get(discordUser.id)
//                 .roles.add(whitelistedRole);
//               interaction.guild.members.cache
//                 .get(discordUser.id)
//                 .roles.remove(notwhitelistedRole);

//               const embed = new EmbedBuilder()
//                 .setTitle("✅ WHITELIST")
//                 .setColor("#7d4efd")
//                 .setDescription(
//                   `**@${username} | ${robloxUserId}** à été ajouté avec succès.`
//                 )
//                 .setFooter({
//                   text: "© Aston - Tous droits réservés | 2019 - 2024",
//                   iconURL:
//                     "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//                 });

//               await interaction.editReply({ embeds: [embed] });

//               logger.Success(`${user.data.discordUsers[0].user.username} has been Whitelisted`)

//               // Send a DM to the user to inform them that they have been whitelisted
//               if (sendDM) {
//                 const dmEmbed = new EmbedBuilder()
//                   .setTitle("✅ WHITELIST")
//                   .setColor("#7d4efd")
//                   .setDescription(
//                     `Vous avez été ajouté à la whitelist d'Aston !`
//                   )
//                   .setFooter({
//                     text: "© Aston - Tous droits réservés | 2019 - 2024",
//                   });

//                 await discordUser.send({ embeds: [dmEmbed] });
//               }
//             })
//             .catch((error) => {
//               console.error(`Error fetching user: ${error.message}`);
//             });

//           const logsData = {
//             userId: robloxUserId,
//             username: username,
//             member: member,
//           };

//           await sendLogs(logsData, "➕ AJOUT WHITELIST", channel);
//         } else if (groupRole == 0) {
//           // User not in group
//           const embed = new EmbedBuilder()
//             .setTitle("❌ ERREUR")
//             .setColor("#7d4efd")
//             .setDescription(`Le joueur ${username} n'est pas dans le groupe.`)
//             .setFooter({
//               text: "© Aston - Tous droits réservés | 2019 - 2024",
//             });
//           // Add a button to the embed
//           const profileButton = new ButtonBuilder()
//             .setStyle(ButtonStyle.Link)
//             .setURL(`https://www.roblox.com/users/${robloxUserId}/profile`)
//             .setLabel("Voir le profil");

//           const row = new ActionRowBuilder().addComponents(profileButton);
//           await interaction.editReply({ embeds: [embed], components: [row] });
//         } else {
//           // If the user has the Whitelisted role, we set his rank to "Invités" and we give him the not whitelisted role and remove the Whitelisted role on DISCORD
//           await noblox.setRank(
//             process.env.ROBLOX_GROUP_ID,
//             robloxUserId,
//             32077396
//           );
//           interaction.client.users
//             .fetch(user.data.discordUsers[0].user.id)
//             .then(async (discordUser) => {
//               interaction.guild.members.cache
//                 .get(discordUser.id)
//                 .roles.add(notwhitelistedRole);
//               interaction.guild.members.cache
//                 .get(discordUser.id)
//                 .roles.remove(whitelistedRole);

//               const embed = new EmbedBuilder()
//                 .setTitle("❌ WHITELIST")
//                 .setColor("#7d4efd")
//                 .setDescription(
//                   `**@${username} | ${robloxUserId}** à été retiré avec succès.`
//                 )
//                 .setFooter({
//                   text: "© Aston - Tous droits réservés | 2019 - 2024",
//                   iconURL:
//                     "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//                 });

//               await interaction.editReply({ embeds: [embed] });
//             })
//             .catch((error) => {
//               console.error(`Error fetching user: ${error.message}`);
//             });

//           logger.Success(`${user.data.discordUsers[0].user.username} has been Unwhitelisted`)

//           const logsData = {
//             userId: robloxUserId,
//             username: username,
//             member: member,
//           };
//           await sendLogs(logsData, "➖ RETRAIT WHITELIST", channel);
//         }
//       }
//     } catch (error) {
//       console.error("Error in whitelist command", error);
//     }
//   }
// };