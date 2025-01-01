const { Event } = require("sheweny");
const { ActivityType } = require("discord.js");
const axios = require("axios");
const logger = require("../utils/logger.js");
const sqlite3 = require("sqlite3").verbose();
const { setConfig } = require("openblox/config");
const { GroupsApi } = require("openblox/cloud");

const { joinVoiceChannel, createAudioPlayer, createAudioResource, entersState, VoiceConnectionStatus } = require('@discordjs/voice');

const newYearMessage = "# <a:party:1323749112276979825> Merveilleuse année 2025 ! <a:party:1323749112276979825>"

module.exports = class ReadyEvent extends Event {
  constructor(client) {
    super(client, "ready", {
      description: "Client is logged in",
      once: true,
      emitter: client,
    });
  }

  async execute() {
    logger.Success(`${this.client.user.tag} is logged in`);
    setConfig({
      cloudKey: process.env.ROBLOX_CLOUD_KEY,
    });

    let db = new sqlite3.Database(
      "./src/data/stickyMessages.db",
      sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE
    );

    db.serialize(function () {
      db.run(
        `CREATE TABLE IF NOT EXISTS StickyMessages (channelId TEXT, message TEXT, messageId TEXT)`
      );
    });
    const guild = await this.client.guilds.cache.get("1110606596649799701");
    const channel = await guild.channels.cache.get("1167196973942710303");
    var ny = false
    async function checkNewYear() { 
      const now = new Date(); 
      const year = now.getFullYear(); 
      const month = now.getMonth(); 
      const date = now.getDate(); 
      const hours = now.getHours(); 
      const minutes = now.getMinutes();

if (ny) return;
  if (year === 2024 && month === 11 || month === 1 && date === 31 && hours === 23 && minutes >= 0) { 
  if (channel) {
    
   // channel.send(newYearMessage).then(() => console.log('Happy new year!')).catch(console.error);
    ny = true
  } else { 
    console.error('Channel not found!'); 
  } 
} 
}
    setInterval(checkNewYear, 1000)
    const fetchPlayerCount = async () => {
      try {
        const response = await axios.get(
          `https://games.roproxy.com/v1/games?universeIds=${process.env.ROBLOX_UNIVERSE_ID}`
        );
        const playersPlaying = response.data.data[0].playing || 0;
        const player = playersPlaying <= 1 ? "joueur" : "joueurs";
        // Set the bot status
        if (playersPlaying >= 1) {
        this.client.user.setPresence({
          activities: [
            {
              name: `${playersPlaying} ${player}`,
              type: ActivityType.Watching,
            },
          ],
          status: "dnd",
        });
        } else {
                  this.client.user.setPresence({
          activities: [
            {
              name: `aston-rp.fr`,
              type: ActivityType.Custom,
            },
          ],
          status: "dnd",
        });
        }
      } catch (error) {
        console.error("Error fetching player count:", error.message);
      }
    };
    fetchPlayerCount();
       
      
            // Join the voice channel
        const connection = joinVoiceChannel({
            channelId: 1200577838278004786,
            guildId: 1110606596649799701,
            adapterCreator: guild.voiceAdapterCreator,
        });

        // Create an audio player
        const player = createAudioPlayer();

        player.on('error', error => {
            console.error('Error:', error);
        });

        player.on('idle', () => {
            connection.destroy();
        });

        // Wait for the connection to become ready before playing audio
        connection.on(VoiceConnectionStatus.Ready, () => {
            // Create an audio resource from a file
            // loop through all files in the folder and select one of them
            const audioFolder = './src/assets/audio/duolingo';
            const resource = createAudioResource(createReadStream('./src/assets/audio/duolingo/duolingo.mp3'));

            // Play the audio resource
            player.play(resource);

            // Subscribe the connection to the player
            connection.subscribe(player);
        });
    
    // Fetch player count every 30 seconds
    setInterval(fetchPlayerCount, 30000);
  }
};