const { Command } = require("sheweny");
const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');
const { createReadStream } = require('fs');
const fs = require('fs');
const path = require('path');
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "duolingo",
            description: "???",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 3,
        });
    }

    async execute(interaction) {
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
        connection.on(VoiceConnectionStatus.Ready, () => {
            // Create an audio resource from a file
            // loop through all files in the folder and select one of them
            const audioFolder = './src/assets/audio/duolingo';
            const resource = createAudioResource(createReadStream('./src/assets/audio/duolingo/duolingo.mp3'));

            // Play the audio resource
            player.play(resource);

            // Subscribe the connection to the player
            connection.subscribe(player);
        });
    }
};