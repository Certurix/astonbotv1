const { Command } = require("sheweny");
const { EmbedBuilder, userMention } = require("discord.js");

const { loadWhitelist } = require("../../../utils/whitelist.js");
const { resolveRobloxUser } = require("../../../utils/roblox.js");

module.exports = class WhitelistRequestsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "viewrequests",
      description: "Voir la liste de toutes les demandes de whitelist",
      type: "SLASH_COMMAND",
      category: "Moderation",
      cooldown: 3,
    });
  }

  async execute(interaction) {
    await interaction.deferReply({ephemeral: true});
    const whitelist = await loadWhitelist();
    let description = "";
    if (whitelist.length === 0) {
      description = "Aucune demande de whitelist";
    }
    for (const userId of whitelist) {
      const user = await this.client.users.fetch(userId);
      const robloxuser = await resolveRobloxUser(userId);

      const robloxUserString = `[${robloxuser.data.cachedUsername}](https://roblox.com/users/${robloxuser.data.robloxId}/profile)`;
      description += `${userMention(user.id)} (${robloxUserString})\n`;
    }

    const embed = new EmbedBuilder()
      .setTitle("DEMANDES DE WHITELIST")
      .setColor("#7d4efd")
      .setDescription(description);

    await interaction.editReply({ embeds: [embed], ephemeral: true });
  }
};