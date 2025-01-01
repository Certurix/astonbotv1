const { Event } = require("sheweny");
const sqlite3 = require('sqlite3').verbose();
const stickyMessages = new Map(); // This map will store the sticky messages for each channel
const stickyMessageIds = new Map(); // This map will store the IDs of the last sticky message sent in each channel

module.exports = class stickyMessage extends Event {
    constructor(client) {
        super(client, "messageCreate", {
            description: "Resend sticky message when a new message is sent",
            once: false,
        });
    }

    async before(Event) {
        // Open the database
        let db = new sqlite3.Database('./src/data/stickyMessages.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE);

        // Fetch the sticky messages from the database and store them in memory
        db.each(`SELECT channelId, message, messageId FROM StickyMessages`, [], (err, row) => {
            if (err) {
                return console.error(err.message);
            }
            stickyMessages.set(row.channelId, row.message);
            stickyMessageIds.set(row.channelId, row.messageId);
        });

        // Close the database
        db.close();

    }
    async execute(message) {
        // Check if there is a sticky message for the channel where the new message has been sent
        if (stickyMessages.has(message.channel.id) && !message.author.bot) {
            // Resend the sticky message
            // Get the ID of the old sticky message
            const oldStickyMessageId = stickyMessageIds.get(message.channel.id);
            console.log(oldStickyMessageId)
            if (oldStickyMessageId) {
                const oldStickyMessage = await message.channel.messages.fetch(oldStickyMessageId);
                if (oldStickyMessage) {
                    await oldStickyMessage.delete();
                }
            }
            const newStickyMessage = await message.channel.send(stickyMessages.get(message.channel.id));
            // Update the ID of the last sticky message sent in the channel
            stickyMessageIds.set(message.channel.id, newStickyMessage.id);
        }
    }
};