const { Command } = require("sheweny");
const { EmbedBuilder, userMention, ButtonBuilder, ButtonStyle, ActionRowBuilder, ApplicationCommandOptionType } = require("discord.js");

const { G4F } = require("g4f");
const g4f = new G4F();
module.exports = class PingCommand extends Command {
    constructor(client) {
        super(client, {
            name: "imagine",
            description: "Créez des images imaginaires grâce à l'IA",
            type: "SLASH_COMMAND",
            category: "Misc",
            cooldown: 15,
            option: [
                {
                    name: "prompt",
                    description: "Descriptif de l'image à générer",
                    type: ApplicationCommandOptionType.STRING,
                    required: true,
                },
            ],
        });
    }

    async execute(interaction) {

        const text = interaction.options.getString("prompt");

        interaction.reply("Génération de l'image en cours...");

        const base64Image = await g4f.imageGeneration(text, {
            provider: g4f.providers.Emi,
            debug: true,
            providerOptions: {
                height: 512,
                width: 512,
            }
        });

        // Encode and send the image to the discord channel
        const buffer = Buffer.from(base64Image, 'base64');
        const attachment = new AttachmentBuilder(buffer, 'imagine.png');
        const embed = new EmbedBuilder()
            .setTitle("Image générée")
            .setDescription(`Image générée pour le prompt suivant:\n**${text}**`)
            .setImage("attachment://imagine.png")
            .setColor("#FF0000")
            .build();
        interaction.editReply({ embeds: [embed], files: [attachment] });

    }
};