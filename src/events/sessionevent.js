"use strict";
const { Event } = require("sheweny");

module.exports = class SessionEvent extends Event {
    constructor(client) {
        super(client, "guildScheduledEventUpdate", {
            description: "Evenement lorsqu'une session RP démarre",
        });
    }

    async execute(oldEvent, newEvent) {
        console.log(newEvent);
    }
};