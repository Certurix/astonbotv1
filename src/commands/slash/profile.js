const { Command } = require("sheweny");
const { EmbedBuilder, ApplicationCommandOptionType, userMention, time } = require("discord.js");
const { handleMessageServiceAPI, resolveRobloxUser, formatPlaytimeLong } = require("../../utils/roblox.js");
const { handleGetUserFromUserId } = require("../../utils/api.js");
const { isWhitelisted } = require("../../utils/whitelist.js");

// let whitelisted = false
// /** Command description 
// - Title: Profil
// - Description: Consulter le profil d'un joueur
// - Options:
//     - name: 'utilisateur'
//       description: 'Nom du joueur'
// - Exemple: /profile @Utilisateur
// - Catégorie: Misc
// - Algorithm:
// Make a first request to RoVer API to get the user id if the user is verified. If not, the API should return the error "User not found". Then, we handle that error to make another request to Roblox to fetch the user by its username to get his userID, but won't be marked as verified.
// Then, use the userid to get the data through the DataStore (OpenCloud DataStore on Roblox)
// After that, display all the ingame data in an embed and then send it to the channel via the slash command interaction handler.
// **/

module.exports = class ProfilCommand extends Command {
    constructor(client) {
        super(client, {
            name: "profile",
            description: "Consulter le profil d'un joueur",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
            aliases: ["profil", "whois"],
            options: [
                {
                    name: 'utilisateur',
                    description: 'Nom du joueur',
                    type: ApplicationCommandOptionType.User,
                    autocomplete: true,
                    required: false
                },
            ],

        });

    }
    async execute(interaction) {
        const discordUser = interaction.options.getMember('utilisateur') || interaction.member;
        await interaction.deferReply({ ephemeral: true });
        // Check if the user is an admin to allow him to use the option 'utilisateur'. To do so, check the user role with discord.Js
        if (discordUser !== interaction.member) {
            const isAdmin = interaction.member.roles.cache.some(role => role.id == '1167133889563734096');
            if (!isAdmin) {
                return await interaction.editReply({ content: 'Vous devez être Staff pour utiliser la commande sur quelqu\'un d\'autre que vous.', ephemeral: true });
            }
        }

        const roverData = await resolveRobloxUser(discordUser.id)

        if (!roverData) {
            const errorEmbed = new EmbedBuilder()
                .setTitle("Erreur")
                .setDescription("Impossible de trouver les données de l'utilisateur.")
                .setColor("#FF0000")
            return await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
        } else {
            const robloxUser = await handleGetUserFromUserId(roverData.data.robloxId);
            if (!robloxUser || robloxUser.data.error) {
                const errorEmbed = new EmbedBuilder()
                    .setTitle("Erreur")
                    .setDescription(`Une erreur est survenue lors de la récupération des données de ${roverData.data.cachedUsername} (${roverData.data.robloxId}) (Code: ${robloxUser.data.error || "INCONNU"}`)
                    .setColor("#FF0000")
                return await interaction.editReply({ embeds: [errorEmbed], ephemeral: true });
            }
            let licenseFields = [];
            let weaponLicenseField = null;
            console.log(robloxUser.data)
            const Weapon = robloxUser.data.license.Weapon;
            let WeaponSerie = Weapon["Num_Serie"] ? Weapon["Num_Serie"] : "Non défini";
            let WeaponCategory = Weapon["Text"] ? Weapon["Text"] : "Non défini";
            let weaponValue = robloxUser.data.license.Weapon_Active;
            for (let license in robloxUser.data.license) {
                if (license === 'Weapon') continue;
                let licenseValue = robloxUser.data.license[license];
                let licenseStatus;

                if (license === 'Weapon_Active') {
                    license = 'Permis de port d\'arme (PPA)';
                    licenseStatus = weaponValue ? '✅' : '❌';
                    weaponLicenseField = { name: license, value: `${licenseStatus}\n\nN° de série: ${WeaponSerie}\nCatégorie:${WeaponCategory}`, inline: true };
                    continue;
                }
                if (licenseValue === 1) {
                    licenseStatus = 'Théorie: ✅\nPratique: ❌';
                } else if (licenseValue === 2) {
                    licenseStatus = 'Théorie: ✅\nPratique: ✅';
                } else if (licenseValue === 3) {
                    licenseStatus = 'Théorie: ⚠️\nPratique: ⚠️';
                } else {
                    licenseStatus = 'Théorie: ❌\nPratique: ❌';
                }
                licenseFields.push({ name: license, value: licenseStatus, inline: true });
            }

            if (weaponLicenseField) {
                licenseFields.push(weaponLicenseField);
            }

            const embed = new EmbedBuilder()
                .setTitle(`Profil`)
                .addFields(
                    { name: '👥 Utilisateur', value: userMention(discordUser.id), inline: true },
                    { name: '⏰ Membre Discord', value: time(discordUser.joinedAt, "R"), inline: true },
                    { name: '👥 Pseudo Roblox', value: `[${roverData.data.cachedUsername}](https://www.roblox.com/users/${roverData.data.robloxId})` },
                    { name: '⏱️ Temps de jeu', value: formatPlaytimeLong(robloxUser.data.playtime) },
                    { name: '👥 Nom RP', value: `${robloxUser.data.rpname}` },
                    { name: '🏦 Banque', value: `${Math.round((robloxUser.data.bank + Number.EPSILON) * 100) / 100}` },
                    { name: '👛 Porte-monnaie', value: `${Math.round((robloxUser.data.money + Number.EPSILON) * 100) / 100}` },
                    ...licenseFields
                )
                .setColor('7d4efd')
                .setFooter({
                    text: `© Aston - Tous droits réservés | 2019 - 2024 | ${discordUser.id}`,
                    iconURL: "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=65a123d1&is=658eaed1&hm=f222bd11fdadc14faff90e236487651500819ed76eb37b4be05727a10722df71&=&format=webp&quality=lossless&width=171&height=222"
                });
            await interaction.editReply({ embeds: [embed], ephemeral: true });
            // interaction.reply({ content: "Profil demandé", ephemeral: true });
        }
    }
};