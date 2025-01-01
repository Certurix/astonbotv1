const { Button } = require("sheweny");
const {
    ActionRowBuilder,
    EmbedBuilder,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    time,
    userMention,
    roleMention
} = require("discord.js");
const { resolveRobloxUser } = require("../../utils/roblox.js");

module.exports = class ButtonComponent extends Button {
    constructor(client) {
        super(client, ["duolingo-spanish-button", "duolingo-vanish-button"]);
    }

    async execute(button) {
        // use switch case
        switch (button.customId) {
            case "duolingo-spanish-button":
                await button.reply({ content: "Va réviser !!!", ephemeral: true });
                break;
            case "duolingo-vanish-button":
                // Timeout user for 60 seconds.
                await button.member.timeout(60, "Vanished").catch(error => {
                    button.reply({ content: `Erreur: Duo n'a pas pu vous vanish :(`, ephemeral: true });
                });
               break;
        }
    };
};