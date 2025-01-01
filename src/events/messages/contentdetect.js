const { Event } = require("sheweny");
const { G4F } = require("g4f");
const g4f = new G4F();

module.exports = class contentDetect extends Event {
    constructor(client) {
        super(client, "messageCreate", {
            description: "Detect content",
            once: false,
            emitter: client,
        });
    }

    async execute(message) {
        if (message.author.bot) return;
        if (!message.guild) return;
        if (!message.content) return;
        if (message.channel.id !== "1239902720056623186") return;
        if (!message.mentions.has(this.client.user.id)) return;
        const msgContent = message.content.toLowerCase();

        const today = new Date();
        const date = today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
        console.log(date)
        const messages = [
            // {
            //     role: "system", content: `NE REPONDS QU'EN FRANCAIS.`,
            //     role: "system", content: `TU ES UN ROBOT AUTOMATIQUE SUR DISCORD, TU T'APPELLE "ASTON" (LE MEME NOM QUE CELUI DE LA COMMUNAUTE) ET TU DOIS AIDER LES UTILISATEURS DE LA COMMUNAUTE EN REPONDANT A LEURS QUESTIONS.`,
            //     role: "system", content: `ASTON (OU ASTON RP) EST UNE COMMUNAUTE DE JEU DE ROLE (ROLEPLAY) SUR ROBLOX DANS LEQUEL LES JOUEURS PEUVENT INCARNER LEUR PROPRE PERSONNAGE, CREER LEUR PROPRE HISTOIRE ET INTERAGIR ET RENCONTRER D'AUTRES JOUEURS PASSIONNES.`,
            //     role: "system", content: `SI UN UTILISATEUR POSE UNE QUESTION SUR LAQUELLE TU N'AS PAS DE REPONSE, DEMANDE LUI DE CONTACTER LE SUPPORT SI NECESSAIRE DANS LE SALON #nous-contacter. SINON, DES INFORMATIONS GENERALES SONT DISPONIBLE DANS LE SALON #informations.`,
            //     role: "system", content: `SI ON TE DEMANDE LA DATE, L'ANNEE, LE MOIS, LA SEMAINE OU LE JOUR REPONDS "Aujourd'hui, nous sommes le ${date}".`,
            // },
            // { role: "system", content: `Tu t'appelle Aston, tu es un assistant virtuel pour la communauté Aston. Tu dois répondre aux question et demandes des utilisateurs. Si tu ne sais pas répondre à une question, demande à l'utilisateur de contacter le support dans le salon #nous-contacter. Sinon, des informations générales sont disponibles dans le salon #informations. Si on te demande la date, l'année, le mois, la semaine ou le jour, réponds UNIQUEMENT PAR "Aujourd'hui, nous sommes le ${date}".`},
            { role: "system", content: `You are Aston, an AI chatbot created to help the Aston community created by Certurix. You must answer the questions and requests of the users. If you don't know how to answer a question, ask the user to contact the support in the #nous-contacter channel. Otherwise, general information is available in the #informations channel. If you are asked the date, the year, the month, the week or the day, answer ONLY BY "Today is ${date}".` },
            { role: "user", content: msgContent },


        ];
        const options = {
            provider: g4f.providers.GPT,
            model: "gpt-3.5-turbo-16k",
            debug: true,
        };
        g4f.chatCompletion(messages, options).then(
            (response) => {
                message.reply(response || "**Une erreur est survenue, veuillez réessayez.**");
            }
        );;

    }
};