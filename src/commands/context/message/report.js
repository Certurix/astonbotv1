const { Command } = require("sheweny");
const { loadReports, saveReports, sendReport } = require("../../../utils/reports.js");

module.exports = class Context_ReportCommand extends Command {
  constructor(client) {
    super(client, {
      name: "Report ce message",
      description: "Report ce message",
      type: "CONTEXT_MENU_MESSAGE",
      category: "Moderation",
      cooldown: 10,
    });
  }

  async execute(interaction) {
    const message = await interaction.channel.messages.fetch(interaction.targetId);
    const user = await interaction.user;
    const channel = interaction.client.channels.cache.get(process.env.REPORT_CHANNEL_ID);
    if (message.author.id === interaction.client.user.id) {
      return await interaction.reply({
        content: "Vous ne pouvez pas signaler ce message.",
        ephemeral: true,
      });
    }

    if (message.author.id === user.id) {
      return await interaction.reply({
        content: "Vous ne pouvez pas signaler votre propre message.",
        ephemeral: true,
      });
    }

    if (!message) {
      return await interaction.reply({
        content: "Ce message est invalide ou introuvable.",
        ephemeral: true,
      })
    }
    // Load reports
    let reports = await loadReports();
    // Check if the report already exists
    if (reports.includes(message.id)) {
      return await interaction.reply({ content: "Ce message a déjà été signalé.", ephemeral: true });
    }

    reports.push(message.id);
    saveReports(reports);
    sendReport(message, user, channel);

    await interaction.reply({ content: "Signalement envoyé !", ephemeral: true });
  }
};