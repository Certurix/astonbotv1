const { Button } = require('sheweny');
const { EmbedBuilder, ChannelType, PermissionFlagsBits } = require("discord.js");
const { request } = require('http');

module.exports = class ButtonComponent extends Button {
    constructor(client) {
        super(client, [/take-support-.*/]);
    }

    async execute(button) {
        const components = button.message.components;
        await button.deferReply({ ephemeral: true });
        const staff = button.member;
        const requesterId = button.customId.split('-')[2];


        // Goal: Make a system to allow a staff member to take in charge a support request from a voice channel. When clicked on the button, the bot will move the staff and the requester to a support channel if available. (if they are empty). If none of each support channels are empty, the bot will create a new support channel and move them in it. After that, the bot must delete the created channel.

        // Step 1: Check if the requester is in a support channel
        // Step 2: Check if the staff is in a support channel
        // Step 3: Check if there is an available support channel
        // Step 4: If there is no available support channel, create a new one
        // Step 5: Move the requester and the staff to the support channel
        // Step 6: Delete the created channel when no one is in it

        // Step 1
        const requester = button.guild.members.cache.get(requesterId);
        const requesterChannel = requester.voice.channel;
        const staffChannel = staff.voice.channel;

        // Step 2
        if (!requesterChannel) {
            return await button.editReply({ content: 'Le membre n\'est plus dans un salon vocal.' });
        }

        if (!staffChannel) {
            return await button.editReply({ content: 'Vous n\'êtes pas dans un salon vocal.' });
        }

        // Step 3
        // Get all support channels and sort them by their position
        const supportChannels = button.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice && c.name.includes('Requête')).sort((a, b) => a.position - b.position);

        // Find the first available support channel
        let availableSupportChannel = null;
        let supportChannel = null;
        for (const channel of supportChannels.values()) {
            // Check if the channel has no members
            if (channel.members.size === 0) {
                availableSupportChannel = channel;
                break;
            }
        }

        // Step 4
        if (!availableSupportChannel) {
            supportChannel = await button.guild.channels.create({
                name: `Requête ~ ${button.guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice && c.name.includes('Requête')).size + 1}`,
                type: ChannelType.GuildVoice,
                parent: button.guild.channels.cache.get(process.env.SUPPORT_CATEGORY_ID),
                permissionOverwrites: [
                    {
                        id: button.guild.id,
                        deny: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: requester.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                    {
                        id: staff.id,
                        allow: [PermissionFlagsBits.ViewChannel],
                    },
                ],
            });

            // Find the position of the last default support channel
            const defaultSupportChannels = button.guild.channels.cache.filter(c => c.type === 'GUILD_VOICE' && c.name.includes('Requête'));
            let lastDefaultSupportChannel = null;
            if (defaultSupportChannels.size > 0) {
                lastDefaultSupportChannel = defaultSupportChannels.sort((a, b) => b.position - a.position).first();
            }

            // Set the position of the new channel to be one more than the last default support channel
            if (lastDefaultSupportChannel) {
                await supportChannel.setPosition(lastDefaultSupportChannel.position + 1);
            }
        } else {
            supportChannel = availableSupportChannel;
        }

        // Step 5
        await requester.voice.setChannel(supportChannel);
        await staff.voice.setChannel(supportChannel);
        console.log(components[0].components[0])
        components[0].components[0].data.disabled = true;

        // Step 6
        const supportChannelListener = async (oldState, newState) => {
            if (newState.id === requesterId && newState.channelId === null && supportChannel.members.size === 0) {
                // Check if the support channel is not a default one before deleting it
                if (supportChannel !== availableSupportChannel) {
                    button.guild.channels.cache.get(supportChannel.id).delete();
                }
                button.client.off('voiceStateUpdate', supportChannelListener);
            }
        };

        button.client.on('voiceStateUpdate', supportChannelListener);

        return await button.editReply({ content: 'Vous avez pris en charge la demande de support.' });
    }
}