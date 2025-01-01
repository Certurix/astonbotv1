const { Event } = require('sheweny');
const logger = require('../utils/logger.js');
module.exports = class ErrorEvent extends Event {
  constructor(client) {
    super(client, 'uncaughtException', {
      emitter: process,
    });
  }
  execute(ctx) {
    logger.Fatal(`An uncaught exception has occurred: ${ctx}\n${ctx.stack}`);
  }
};
