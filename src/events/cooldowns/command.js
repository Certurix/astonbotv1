const { Event } = require("sheweny");

module.exports = class CooldownEvent extends Event {
    constructor(client) {
        super(client, "cooldownLimit", {
            description: "cooldownLimit",
            emitter: client.managers.commands
        });
    }

    async execute(interaction, time) {
        // Display a message in the channel to inform the user that the command is on cooldown
        return await interaction.reply({
            content: `Veuillez réessayer dans ${Math.round(time / 1000)} secondes`,
            ephemeral: true
        });
    }
};