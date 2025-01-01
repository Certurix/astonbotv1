// const { Button } = require("sheweny");
// const {
//     ActionRowBuilder,
//     EmbedBuilder,
//     ModalBuilder,
//     TextInputBuilder,
//     TextInputStyle,
//     time,
//     userMention,
//     roleMention
// } = require("discord.js");
// const noblox = require("noblox.js");
// const { resolveRobloxUser } = require("../../utils/roblox.js");

// module.exports = class ButtonComponent extends Button {
//     constructor(client) {
//         super(client, ["request-whitelist-button"]);
//     }

//     async execute(button) {
//         await button.deferReply({ ephemeral: true });
//         const member = button.member;

//         if (!button.member.roles.cache.has(process.env.WHITELISTED_ROLE_ID)) {
//             const noWhitelistedRole = new EmbedBuilder()
//                 .setTitle("❗ ERREUR")
//                 .setDescription(
//                     "Vous devez avoir le rôle 'Citoyen' pour valider votre demande."
//                 )
//                 .setFooter({
//                     text: "© Aston - Tous droits réservés | 2019 - 2024",
//                     iconURL:
//                         "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//                 });
//             return await button.editReply({
//                 embeds: [noWhitelistedRole],
//                 ephemeral: true,
//             });
//         }

//         const robloxUser = await resolveRobloxUser(member.user.id);

//         if (!robloxUser) {
//             const noRobloxUser = new EmbedBuilder()
//                 .setTitle("❗ ERREUR")
//                 .setDescription(
//                     "Impossible de trouver le compte Roblox associé à votre compte Discord. Veuillez contacter le support."
//                 )
//                 .setFooter({
//                     text: "© Aston - Tous droits réservés | 2019 - 2024",
//                     iconURL:
//                         "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//                 });
//             return await button.editReply({
//                 embeds: [noRobloxUser],
//                 ephemeral: true,
//             });
//         }

//         const currentRequest = await noblox.getJoinRequest(process.env.ROBLOX_GROUP_ID, robloxUser.data.robloxId);

//         if (!currentRequest || currentRequest == null) {
//             const noGroupRequest = new EmbedBuilder()
//                 .setTitle("❗ ERREUR")
//                 .setDescription(
//                     `Impossible de trouver une demande à rejoindre le groupe :
//                     - Soit vous n'avez pas fait une demande pour le rejoindre\n- Soit vous êtes déja dans le groupe`
//                 )
//                 .setFooter({
//                     text: "© Aston - Tous droits réservés | 2019 - 2024",
//                     iconURL:
//                         "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//                 });
//             return await button.editReply({
//                 embeds: [noGroupRequest],
//                 ephemeral: true,
//             });
//         }

//         await noblox
//             .handleJoinRequest(process.env.ROBLOX_GROUP_ID, robloxUser.data.robloxId, true)
//             .catch(error => {
//                 console.error(error);
//                 const groupRequestError = new EmbedBuilder()
//                     .setTitle("❗ ERREUR")
//                     .setDescription(
//                         "Une erreur est survenue lors de la tentative de validation de la demande. Veuillez contacter le support."
//                     )
//                     .setFooter({
//                         text: "© Aston - Tous droits réservés | 2019 - 2024",
//                         iconURL:
//                             "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//                     });
//                 return button.editReply({
//                     embeds: [groupRequestError],
//                     ephemeral: true,
//                 });
//             })
//         const groupRequestEmbed = new EmbedBuilder()
//             .setTitle("✅ VALIDATION")
//             .setDescription(
//                 "Vous avez bien reçu votre rôle sur le groupe."
//             )
//             .setFooter({
//                 text: "© Aston - Tous droits réservés | 2019 - 2024",
//                 iconURL:
//                     "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
//             });

//         return await button.editReply({
//             embeds: [groupRequestEmbed],
//             ephemeral: true,
//         });

//     };
// };
