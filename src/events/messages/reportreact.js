const { Event } = require("sheweny");
const { loadReports, saveReports, sendReport } = require("../../utils/reports.js");

module.exports = class messageReactionAdd extends Event {
    constructor(client) {
        super(client, "messageReactionAdd", {
            description: "report reaction system",
            once: false,
            emitter: client,
        });
    }

    async execute(reaction, user) {
        const channel = reaction.client.channels.cache.get(process.env.REPORT_CHANNEL_ID);
        try {
            if (reaction.emoji.id == process.env.REPORT_EMOJI_ID) {
                var reportReact = await reaction.fetch();
                var message = await reportReact.message.fetch();

                // Check if the message & its content exists
                if (!message || message.content == '') {
                    return;
                  }

                // Load reports
                let reports = await loadReports();

                // Check if the report already exists
                if (reports.includes(message.id)) {
                    return await reaction.users.remove(user.id);
                }

                // Update reports
                reports.push(message.id);
                saveReports(reports);

                // Send report
                sendReport(message, user, channel);
            }
        } catch (error) {
            console.error(error);
            return;
        }
    }
};
