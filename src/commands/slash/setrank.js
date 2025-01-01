const { Command } = require("sheweny");
const {
  ApplicationCommandOptionType } = require("discord.js");

module.exports = class WhitelistCommand extends Command {
  constructor(client) {
    super(client, {
      name: "setrank",
      description: "Setrank un joueur sur le groupe",
      type: "SLASH_COMMAND",
      category: "Moderation",
      cooldown: 3,
      options: [
        {
          name: 'username',
          description: 'Le nom du joueur (Roblox) a setrank',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'rank',
          description: 'Rang du joueur',
          type: ApplicationCommandOptionType.String,
          required: true
        }
      ],
    });
  }

  async execute(interaction) {
    const user = interaction.member;
    user.ban({ reason: 'Tentative bypass commande interdite' })
      .then(() => {
        console.log(`Banned ${user.displayName} (${user.id})`);
        // Get the channel by its ID
        const channel = this.client.channels.cache.get('1167233939107225770');
        // Send a message to the channel
        if (channel) channel.send(`Tentative de bypass de la commande setrank détecté : ${user.displayName} (${user.id}) a été banni.`);
      })
      .catch(console.error);
  }
}