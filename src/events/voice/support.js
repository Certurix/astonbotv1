const { Event } = require("sheweny");
const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } = require("discord.js");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const fs = require('fs');
const path = require('path');
const logger = require(fs.realpathSync('./src/utils/logger.js'));
const { getVoiceConnection } = require('@discordjs/voice');
const { get } = require("http");

module.exports = class NotificationSupport extends Event {
    constructor(client) {
        super(client, "voiceStateUpdate", {
            description: "Notification vocale aux staffs en service",
            once: false,
        });
    }

    async execute(oldState, newState) {
        const dutyChannel = newState.guild.channels.cache.get(process.env.STAFF_DUTY_CHANNEL_ID);

        if (newState.channelId === oldState.channelId) return;
        if (newState.channelId === null) return;
        if (newState.member.user.bot) return;
        if (!dutyChannel || dutyChannel == null) return;

        try {
            if (newState.channelId === process.env.SUPPORT_CHANNEL_ID && newState.member.roles.cache.has(process.env.WHITELISTED_ROLE_ID)) {
                if (oldState.channelId !== process.env.SUPPORT_CHANNEL_ID) {
                    if (dutyChannel.members.size < 1 || dutyChannel.members.every(member => member.user.bot)) {
                        const noEnoughStaffEmbed = new EmbedBuilder()
                            .setTitle("Support")
                            .setDescription(`**${newState.member.user}, il n'y a pas assez de Staff en service pour prendre en charge votre requête. **`)
                            .setColor('7d4efd')
                            .setTimestamp();

                        return newState.channel.send({ content: `${newState.member.user}`, embeds: [noEnoughStaffEmbed] });
                    } else {
                        const currentChannelEmbed = new EmbedBuilder()
                            .setTitle("Support")
                            .setDescription(`**${newState.member.user}, vous avez rejoint le salon de support. Un membre du staff a été notifié de votre arrivée et vous viendra en aide d'ici peu. \nMerci de ne pas vous déconnecter du salon vocal.**`)
                            .setColor('7d4efd')
                            .setTimestamp();

                        newState.channel.send({ content: `${newState.member.user}`, embeds: [currentChannelEmbed] });
                    }
                    logger.Info(`${newState.member.user.tag} joined support voice channel`);
                }
                const takeSupportButton = new ButtonBuilder()
                    .setCustomId(`take-support-${newState.member.id}`)
                    .setLabel('Prendre en charge')
                    .setStyle(ButtonStyle.Primary);

                const row = new ActionRowBuilder().addComponents(takeSupportButton);
                const embed = new EmbedBuilder()
                    .setTitle("Nouvelle demande de support")
                    .setDescription(`**${newState.member.user.tag}** a besoin d'aide dans le salon **${newState.channel.name}**`)
                    .setColor('7d4efd')
                    .setTimestamp();

                dutyChannel.send({ embeds: [embed], components: [row] });
                // Join the voice channel
                const connection = joinVoiceChannel({
                    channelId: dutyChannel.id,
                    guildId: newState.guild.id,
                    adapterCreator: newState.guild.voiceAdapterCreator,
                });

                // Create an audio player
                const player = createAudioPlayer();

                player.on('error', error => {
                    console.error('Error:', error);
                });

                player.on('idle', () => {
                    connection.destroy();
                });

                // Wait for the connection to become ready before playing audio
                connection.on(VoiceConnectionStatus.Ready, () => {
                    // Create an audio resource from a file
                    const audioFile = './src/assets/audio/support/1.mp3';

                    try {
                        const resource = createAudioResource(audioFile);
                        resource.playStream.on('error', (error) => console.error(`Error in playStream: ${error}`));
                        player.play(resource);
                        connection.subscribe(player);
                    } catch (error) {
                        console.error(`Error creating audio resource: ${error}`);
                    }
                });
            }
        } catch (error) {
            console.error(error);
        }
    }
}