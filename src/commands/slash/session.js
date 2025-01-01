const { Command } = require("sheweny");
const { ApplicationCommandOptionType, GuildScheduledEventManager, GuildScheduledEventPrivacyLevel, GuildScheduledEventEntityType } = require("discord.js");
const moment = require('moment-timezone');

module.exports = class SessionCommand extends Command {
    constructor(client) {
        super(client, {
            name: "session",
            description: "[ADMIN] Créer une notification pour une session de jeu.",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
            options: [
                {
                    name: 'date',
                    description: 'Saisissez une date pour la session (Format JJ/MM/AAAA)',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false,
                    required: true
                },
                {
                    name: 'hour',
                    description: 'Saisissez une heure pour la session (Format HH:MM)',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false,
                    required: true
                },
                {
                    name: 'duration',
                    description: 'Saisissez une durée de la session (Format HH:MM)',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false,
                    required: true
                },
                {
                    name: 'role',
                    description: 'Les rôles à mentionner pour la notification. (Format: @role1 @role2)',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false,
                    required: true
                },
                {
                    name: 'note',
                    description: 'Message complémentaire à ajouter à la notification.',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false,
                    required: false
                },
            ],
        });
    }

    async execute(interaction) {
        const date = interaction.options.getString('date');
        const hour = interaction.options.getString('hour');
        const role = interaction.options.getString('role');
        const note = interaction.options.getString('note');

        if (!interaction.member.roles.cache.has("1167133889563734096")) {
            return interaction.reply({
                content: "Vous n'avez pas la permission d'utiliser cette commande.",
                ephemeral: true
            });
        }

        if (!date || !role) {
            return interaction.reply({
                content: "Il y a eu un incident technique lors de la récupération des paramètres envoyés. Veuillez réessayer.",
                ephemeral: true
            });
        }
        // Goal: Make a notification system for a game session. This command will be used by mods and admins of the server to allow them to notify players of a game session.
        // The command will have 3 arguments:
        // - date: The date of the session
        // - role: The roles to mention
        // - note: A note to add to the notification

        // The command should send a message with the following content:
        // @role1 @role2 @role3
        // **Game Session**
        // Date: JJ/MM/AAAA
        // Note: The note
        // The message should also have a button that players can click to confirm their participation.
        // When a player clicks on the button, the bot should send a message in the same channel with the following content:
        // @player
        // You have confirmed your participation in the game session on JJ/MM/AAAA.
        // The bot should also send a DM to the player with the same message.

        // Now make a function to get the date from the format JJ/MM/AAAA from the date argument
        const dateParts = date.split("/");
        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];

        // Now make a function to get the hour from the format HH:MM from the hour argument
        const hourParts = hour.split(":");
        let hourValue = hourParts[0];
        const minute = hourParts[1];

        // Now make a function to get the duration from the format HH:MM from the duration argument
        const durationParts = interaction.options.getString('duration').split(":");
        const durationHour = durationParts[0];
        const durationMinute = durationParts[1];

        // Create a moment object with the date and time in the local timezone
        const localTime = moment.tz(`${year}-${month}-${day} ${hourValue}:${minute}`, 'Europe/Paris');
        // Convert the local time to UTC and get the timestamp
        const timestamp = localTime.utc().unix();
        const timestampEnd = localTime.add(durationHour, 'hours').add(durationMinute, 'minutes').utc().unix();
        const event_manager = new GuildScheduledEventManager(interaction.guild);

        try {
            await event_manager.create({
                name: 'Session Rôleplay',
                scheduledStartTime: new Date(timestamp * 1000),
                scheduledEndTime: new Date(timestampEnd * 1000),
                privacyLevel: GuildScheduledEventPrivacyLevel.GuildOnly,
                entityType: GuildScheduledEventEntityType.External,
                description: 'Une nouvelle session RP a été planifiée réservées aux joueurs inscrit sur la liste blanche (Whitelist)',
                entityMetadata: { location: 'https://aston-rp.fr/join' },
                image: 'https://media.discordapp.net/attachments/1222306549310165102/1242775900706050068/Calque_1_6.png?ex=664f10c0&is=664dbf40&hm=deb3701e459889a3d3491c96cd8e0c1a179c2bc2b8dbdd3d15d7bb6a78bd1ea0&=&format=webp&quality=lossless&width=1178&height=662',
                reason: `Création d'une session par ${interaction.user.tag}`,
            })
                .then((event) => {
                    const message = `Bonjour à tous ! [${role}]\n\n> Nous vous donnons rendez-vous à ${hour} (<t:${timestamp}:R>) pour une nouvelle session qui durera ${durationHour}h sur notre jeu [Ariège, Aston](https://www.roblox.com/games/3616171959) !${note ? `\n\nNote: ${note}` : ""}\n\n# <:digtools:1167410001971785738> Soyez acteur du développement d'Aston\n- Faites nous part de vos idées d'ajout(s) ou de modification via <#1169588802331869214> \n- Aidez-nous à nous améliorer en nous signalant des problèmes via <#1169588725383184455>\n\n[Lien de l'événement](${event.url})`;
                    const channel = interaction.guild.channels.cache.get('1167172194779025569');
                    channel.send({
                        content: message,
                    });
                });
        } catch (error) {
            console.error(error);
            if (error.message === 'Invalid Form Body') {
                return interaction.reply({
                    content: "Une erreur s'est produite lors de la création de la session. Veuillez réessayer.\n\nCause possible: La date et/ou l'heure de fin de la session est antérieure à la date actuelle.",
                    ephemeral: true
                });

            }
            return interaction.reply({
                content: "Une erreur s'est produite lors de la création de la session. Veuillez réessayer.",
                ephemeral: true
            });
        }
    }
};