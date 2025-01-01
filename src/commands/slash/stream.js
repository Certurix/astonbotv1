const { Command } = require("sheweny");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
module.exports = class StreamCommand extends Command {
    constructor(client) {
        super(client, {
            name: "stream",
            description: "???",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
            options: [
                {
                    name: 'stream',
                    description: 'URL à stream',
                    type: ApplicationCommandOptionType.String,
                    autocomplete: false,
                    required: true
                },
            ],
        });
    }

    async execute(interaction) {
        const streamURL = interaction.options.getString('stream');
        try {
            const newState = interaction.member;
            if (newState.channelId === null) return;
            if (newState.user.bot) return;
        } catch (error) {
            console.error(error);
        }

        // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: interaction.member.voice.channel.id,
            guildId: interaction.guild.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
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
        connection.on(VoiceConnectionStatus.Ready, async () => {
            // Make a HTTP request to the stream URL
            const response = await axios.get(streamURL, { responseType: 'stream' });

            // Create an audio resource from the stream
            const resource = createAudioResource(response.data);

            // Play the audio resource
            player.play(resource);

            // Subscribe the connection to the player
            connection.subscribe(player);
        });
    }
};