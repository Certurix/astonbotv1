const { ShewenyClient } = require("sheweny");
const { Partials, GatewayIntentBits } = require("discord.js");
const env = require("dotenv")
const isCanaryMode = process.argv.includes('--canary');

const client = new ShewenyClient({
  admins: process.env.ADMINS,
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildEmojisAndStickers, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildInvites, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildScheduledEvents],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction, Partials.GuildMember, Partials.GuildScheduledEvent],
  managers: {
    commands: {
      directory: "./commands",
      autoRegisterApplicationCommands: true,
      prefix: "!",
      default: {
        userPermissions: ["UseApplicationCommands"],
      },
    },
    events: {
      directory: "./events",
    },
    buttons: {
      directory: "./interactions/buttons",
    },
    selectMenus: {
      directory: "./interactions/selectmenus",
    },
    modals: {
      directory: "./interactions/modals",
    },
  },
  mode : isCanaryMode ? "development" : "production",
});

if (isCanaryMode) {
  env.config({ path: '.env.local' });
  client.login(process.env.CANARY_TOKEN);
  exports.canaryMode = true;
} else {
  env.config({ path: '.env' });
  client.login(process.env.DISCORD_TOKEN);
  exports.canaryMode = false;
}
