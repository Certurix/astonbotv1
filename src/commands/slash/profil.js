// const { Command } = require("sheweny");
// const { EmbedBuilder, ApplicationCommandOptionType } = require("discord.js");
// const { handleMessageServiceAPI, resolveRobloxUser } = require("../../utils/roblox.js");
// const { handleGetUserFromUserId } = require("../../utils/api.js");
// const { isWhitelisted } = require("../../utils/whitelist.js");

// let whitelisted = false
// /** Command description 
// - Title: Profil
// - Description: Consulter le profil d'un joueur
// - Options:
//     - name: 'utilisateur'
//       description: 'Nom du joueur'
// - Exemple: /profil @Utilisateur
// - Catégorie: Misc
// - Algorithm:
// Make a first request to RoVer API to get the user id if the user is verified. If not, the API should return the error "User not found". Then, we handle that error to make another request to Roblox to fetch the user by its username to get his userID, but won't be marked as verified.
// Then, use the userid to get the data through the DataStore (OpenCloud DataStore on Roblox)
// After that, display all the ingame data in an embed and then send it to the channel via the slash command interaction handler.
// **/

// module.exports = class ProfilCommand extends Command {
//     constructor(client) {
//         super(client, {
//             name: "profil",
//             description: "Consulter le profil d'un joueur",
//             type: "SLASH_COMMAND",
//             category: "Misc",
//             cooldown: 3,
//             options: [
//                 {
//                     name: 'utilisateur',
//                     description: 'Nom du joueur',
//                     type: ApplicationCommandOptionType.User,
//                     autocomplete: true,
//                     required: false
//                 },
//             ],

//         });

//     }
//     async execute(interaction) {
//         const roverApiKey = process.env.ROVER_API_KEY;
//         const discordUser = interaction.options.getMember('utilisateur') || interaction.member;
//         // if (!await isWhitelisted(discordUser)) {
//         //     let whitelisted = false;
//         // } else {
//         //     let whitelisted = true
//         // }

//         const roverData = await resolveRobloxUser(discordUser.id)
//         let userId = roverData.data.robloxId;
//         console.log(roverData)
//         if (roverData) {
//             handleMessageServiceAPI({
//                 message: userId
//             }
//                 , "GAMEDATAREQUEST"
//                 , process.env.ROBLOX_UNIVERSE_ID)
//         }
//         const res = await handleGetUserFromUserId(userId)
//         console.log(res)
//         if (res.data.id == 0) {
//             const embed = new EmbedBuilder()
//                 .setTitle("Profil")
//                 .setDescription("*Ce joueur n'est pas vérifié.*")
//                 .setColor('7d4efd')
//             interaction.reply({ embeds: [embed] })
//         } else {
//             const embed = new EmbedBuilder()
//                 .setTitle("Profil")
//                 .addFields(
//                     {
//                         name: "Whitelist",
//                         value: "✅",
//                     },
//                     {
//                         name: "ID",
//                         value: userId,
//                     },
//                     {
//                         name: "Nom RP",
//                         value: res.data.rpname,
//                     },
//                     {
//                         name: "Argent",
//                         value: res.data.money,
//                     },
//                     {
//                         name: "Banque",
//                         value: res.data.bank,
//                     }
//                 )
//                 .setColor('7d4efd')
//             interaction.reply({ embeds: [embed] })
//         }
//     }
// };