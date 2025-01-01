const { Event } = require("sheweny");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { resolveRobloxUser } = require("../../utils/roblox.js");
const { removeWhitelist } = require("../../utils/whitelist.js");

module.exports = class guildMemberRemove extends Event {
    constructor(client) {
        super(client, "guildMemberRemove", {
          description: "When a member leave the server",
          once: false,
          emitter: client,
        });
    }

    async execute(member) {
        removeWhitelist(member.user.id);
    }
}