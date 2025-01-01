const { Event } = require("sheweny");
const { MessageAttachment } = require("discord.js");

module.exports = class ImageDetectionEvent extends Event {
  constructor(client) {
    super(client, "messageCreate", {
      description: "Multiple messages handlers",
      once: false,
      emitter: client,
    });
  }

  async execute(message) {
    // Check if the message is sent in the target channel and sent by a user (not a bot)
    if (message.channel.id === process.env.STARBOARD_CHANNEL_ID && !message.author.bot) {
      // Check if the message contains only an image attachment
      if (message.attachments.size === 1 && message.attachments.first().contentType.startsWith("image/")) {
        // Add the emoji reaction to the message
        await message.react(process.env.STARBOARD_EMOJI);
      }
    }
  }
};