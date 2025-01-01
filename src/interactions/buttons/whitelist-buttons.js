const { Button } = require("sheweny");
const {
  ActionRowBuilder,
  EmbedBuilder,
  ModalBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextInputBuilder,
  TextInputStyle,
  time,
  userMention,
  channelMention,
} = require("discord.js");
const { resolveRobloxUser } = require("../../utils/roblox.js");
const {
  sendLogs,
  loadWhitelist,
  removeWhitelist,
} = require("../../utils/whitelist.js");
const { GroupsApi } = require("openblox/cloud");
const { Info, Error } = require("../../utils/logger.js");
const { HttpError } = require("openblox/http");

let robloxUser = "N/A";
const DMButton = new ActionRowBuilder().addComponents(
  new ButtonBuilder()
    .setCustomId("whitelist-button-dm")
    .setLabel("Envoyé depuis Aston")
    .setStyle(ButtonStyle.Secondary)
    .setDisabled(true)
);

const DMAcceptedEmbed = new EmbedBuilder()
  .setTitle("ℹ️ DEMANDE DE WHITELIST")
  .setColor(0x7d4efd)
  .setDescription(
    "Nous sommes ravis de vous annoncer que votre demande à bien été acceptée ! Bienvenue sur Aston et bon jeu parmis nous !\n\n> Si vous quittez le serveur et/ou le groupe, vous perdrez l'accès au jeu et devrez faire une nouvelle demande pour y jouer à nouveau."
  )
  .setFooter({
    text: "© Aston - Tous droits réservés | 2019 - 2024",
    iconURL:
      "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
  });

const DMDeclinedEmbed = new EmbedBuilder()
  .setTitle("ℹ️ DEMANDE DE WHITELIST")
  .setColor(0x7d4efd)
  .setDescription(
    "Nous avons le regret de vous annoncer que votre demande à été refusée. Vous pouvez faire une nouvelle demande ultérieurement."
  )
  .setFooter({
    text: "© Aston - Tous droits réservés | 2019 - 2024",
    iconURL:
      "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
  });

const DMRequestNotFound = new EmbedBuilder()
  .setTitle("ℹ️ DEMANDE DE WHITELIST")
  .setColor(0x7d4efd)
  .setDescription(
    "Nous avons le regret de vous annoncer que votre demande n'a pas pu être traitée. Notre système n'a pas pu trouver une demande à rejoindre le groupe Roblox du jeu. Par conséquent votre demande de whitelist a automatiquement été refusée. Vous pouvez faire une nouvelle demande ultérieurement."
  )
  .setFooter({
    text: "© Aston - Tous droits réservés | 2019 - 2024",
    iconURL:
      "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
  });

const RequestExist = new EmbedBuilder()
  .setTitle("ℹ️ DEMANDE DE WHITELIST")
  .setColor(0x7d4efd)
  .setDescription(
    "Vous avez déjà fait une demande de whitelist. Veuillez patienter qu'elle soit traitée avant d'en faire une autre."
  )
  .setFooter({
    text: "© Aston - Tous droits réservés | 2019 - 2024",
  });

module.exports = class ButtonComponent extends Button {
  constructor(client) {
    super(client, [
      "whitelist-button",
      "whitelist-button-accept",
      "whitelist-button-decline",
    ]);
  }

  async execute(button) {
    const components = button.message.components;
    const channel = button.client.channels.cache.get(
      process.env.WL_LOGS_CHANNEL_ID
    );
    const date = new Date(Date.now());
    const whitelistedRole = button.guild.roles.cache.find(
      (role) => role.id == process.env.WHITELISTED_ROLE_ID
    );
    const notwhitelistedRole = button.guild.roles.cache.find(
      (role) => role.id == process.env.UNWHITELISTED_ROLE_ID
    );

    switch (button.customId) {
      case "whitelist-button":
        // Verify if the user is already whitelisted
        let whitelists = await loadWhitelist();

        if (whitelists.includes(button.user.id)) {
          return await button.reply({
            embeds: [RequestExist],
            ephemeral: true,
          });
        }

        const modal = new ModalBuilder()
          .setCustomId("whitelist-modal")
          .setTitle("DEMANDE DE WHITELIST");

        const q1 = new TextInputBuilder()
          .setCustomId("q1")
          .setLabel("Pourquoi voulez-vous rejoindre Aston ?")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000);

        const q2 = new TextInputBuilder()
          .setCustomId("q2")
          .setLabel("Comment avez-vous connu Aston ?")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000);

        const q3 = new TextInputBuilder()
          .setCustomId("q3")
          .setLabel("Avez-vous joué sur d'autres serveurs RP ?")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000);

        const q4 = new TextInputBuilder()
          .setCustomId("q4")
          .setLabel("Allez-vous vous investir & jouer sur Aston ?")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000);

        const q5 = new TextInputBuilder()
          .setCustomId("q5")
          .setLabel("Fréquence de jeu prévue sur le serveur ?")
          .setStyle(TextInputStyle.Paragraph)
          .setRequired(true)
          .setMaxLength(1000);

        const rows = [];
        for (const component of [q1, q2, q3, q4, q5]) {
          rows.push(new ActionRowBuilder().addComponents([component]));
        }
        modal.addComponents(rows);

        // Get the user's Roblox ID
        try {
          await resolveRobloxUser(button.user.id).then(async (rbx) => {
            const robloxUsername = rbx.data.cachedUsername;

            try {
              // Check if the user has a pending group request
              await GroupsApi.groupJoinRequests({
                groupId: process.env.ROBLOX_GROUP_ID,
                limit: 1,
                filter: { userId: rbx.data.robloxId },
              }).then(async () => {
                await button.showModal(modal);
              });
            } catch (error) {
              if (error instanceof HttpError && !error.success) {
                // User is not in the group
                if (error.response.statusCode === 404) {
                  const reqErrorEmbed = new EmbedBuilder()
                    .setTitle("Erreur")
                    .setDescription(
                      `Par mesure de sécurité, nous autorisons les demandes de whitelist uniquement si vous avez déjà fait une demande à rejoindre le groupe Roblox. Il semblerait qu'il n'y ait aucune requête en cours sur votre compte Roblox [${robloxUsername}](https://www.roblox.com/users/${rbx.data.robloxId}).\n\n[Rejoindre le groupe Roblox](https://www.roblox.com/groups/4795821)\n\nSi vous avez déjà fait une demande de rejoindre le groupe Roblox, veuillez patienter quelques minutes avant de soumettre une nouvelle demande de whitelist.\n\nSi vous avez des questions, veuillez contacter un membre du staff.`
                    )
                    .setColor("#FF0000")
                    .setFooter({
                      text: "© Aston - Tous droits réservés | 2019 - 2024",
                      iconURL:
                        "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
                    });
                  return button.reply({
                    embeds: [reqErrorEmbed],
                    content: "",
                    ephemeral: true,
                  });
                }
              }
              return button.reply({
                content: `Une erreur s'est produite lors de la résolution de votre compte Roblox. Veuillez réessayer plus tard. Si le problème persiste, veuillez ${channelMention(
                  "1167172193856274465"
                )}`,
                ephemeral: true,
              });
            }
          });
        } catch (error) {
          return button.reply({
            content: `Une erreur s'est produite lors de la résolution de votre compte Roblox. Veuillez réessayer plus tard. Si le problème persiste, veuillez ${channelMention(
              "1167172193856274465"
            )}`,
            ephemeral: true,
          });
        }
        break;
      case "whitelist-button-accept":
        const userId = button.message.embeds[0].footer.text;
        const requestMessage = button.message;
        const requestEmbed = requestMessage.embeds[0];
        const guildMember = button.guild.members.cache.get(userId);
        const admins = process.env.ADMINS;
        const STAFF_ROLE_ID = process.env.WL_REQUIRED_ROLE_ID;

        if (!button.member.roles.cache.has(STAFF_ROLE_ID)) {
          const NoPermissionEmbed = new EmbedBuilder()
            .setTitle("❗ WHITELIST")
            .setDescription(
              "Vous n'êtes pas autorisé à utiliser cette commande. Code d'erreur: `NO_PERMISSION`"
            )
            .setColor("#7d4efd")
            .setFooter({
              text: "© Aston - Tous droits réservés | 2019 - 2024",
              iconURL:
                "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
            });
          return await button.reply({
            embeds: [NoPermissionEmbed],
            ephemeral: true,
          });
        }

        if (admins.includes(guildMember.id)) {
          const embed = new EmbedBuilder()
            .setTitle("❗ WHITELIST")
            .setDescription(
              "Cet utilisateur est un administrateur. Code d'erreur: `IS_ADMINISTRATOR`"
            )
            .setColor("#7d4efd")
            .setFooter({
              text: "© Aston - Tous droits réservés | 2019 - 2024",
              iconURL:
                "https://media.discordapp.net/attachments/1167234087015165974/1167426140391088138/pic.png?ex=6597e951&is=65857451&hm=2a054f9474ac067c213018af3ca53145244648afd7a9b69a3dc26886a50efd16&=&format=webp&quality=lossless&width=171&height=222",
            });

          return await button.reply({ embeds: [embed], ephemeral: true });
        }
        if (!guildMember) {
          requestMessage.delete();
          return button.reply({
            content:
              "Erreur: Impossible de retrouver le membre. Code d'erreur: `MEMBER_NOT_FOUND`",
            ephemeral: true,
          });
        }

        const robloxUser2 = resolveRobloxUser(userId);
        robloxUser2.then(async (rbx) => {
          const robloxUsername = rbx.data.cachedUsername;

          const currentRequest = await GroupsApi.groupJoinRequests({
            groupId: process.env.ROBLOX_GROUP_ID,
            filter: { userId: rbx.data.robloxId },
          });

          if (!currentRequest || currentRequest == null) {
            const noGroupRequest = new EmbedBuilder()
              .setTitle("❗ ERREUR")
              .setDescription(
                "Impossible de trouver une demande à rejoindre le groupe. L'utilisateur a été accepté ou a quitté le groupe. Code d'erreur: `NO_GROUP_REQUEST`\n\n> **La demande a automatiquement été refusée.**"
              );
            this.client.users
              .send(userId, {
                embeds: [DMRequestNotFound],
                components: [DMButton],
              })
              .catch((err) => {
                console.error(err);
                const noDMs = new EmbedBuilder()
                  .setTitle("❗ ERREUR")
                  .setDescription(
                    "Impossible d'envoyer un message privé à l'utilisateur. Celui-ci n'a pas été informé de l'erreur. Code d'erreur: `NO_DMS`"
                  )
                  .setColor("#7d4efd")
                  .setFooter({
                    text: "© Aston - Tous droits réservés | 2019 - 2024",
                  });
                return button.followUp({
                  embeds: [noDMs],
                  ephemeral: true,
                });
              });
            const embed = new EmbedBuilder()
              .setTitle("DEMANDE DE WHITELIST REÇUE")
              .addFields(
                {
                  name: "👥 Utilisateur",
                  value: userMention(userId),
                  inline: true,
                },
                {
                  name: "⏰ Membre du discord",
                  value: time(guildMember.joinedAt),
                  inline: true,
                },
                {
                  name: "👥 Pseudo Roblox",
                  value: `[${robloxUsername}](https://www.roblox.com/users/${rbx.data.robloxId})`,
                },
                {
                  name: "Pourquoi voulez-vous rejoindre Aston ?",
                  value: requestEmbed.data.fields[3].value,
                },
                {
                  name: "Comment avez-vous connu Aston ?",
                  value: requestEmbed.data.fields[4].value,
                },
                {
                  name: "Avez-vous joué sur d'autres serveurs RP ?",
                  value: requestEmbed.data.fields[5].value,
                },
                {
                  name: "Allez-vous vous investir & jouer sur Aston ?",
                  value: requestEmbed.data.fields[6].value,
                },
                {
                  name: "Fréquence de jeu prévue sur le serveur ?",
                  value: requestEmbed.data.fields[7].value,
                },
                {
                  name: "ℹ️ STATUT",
                  value: `REFUS AUTOMATIQUE (${userMention(
                    button.user.id
                  )} ${time(date, "R")})`,
                }
              )
              .setColor("Red");

            // Disable the button that was clicked
            components[0].components[0].data.disabled = true;
            components[0].components[1].data.disabled = true;

            // get message by ID and then edit it
            await requestMessage.edit({
              embeds: [embed],
              components: components,
            });

            const logsData = {
              userId: userId,
              username: robloxUsername,
              member: button.user,
            };

            sendLogs(logsData, "➖ REFUS DE WHITELIST", channel);

            removeWhitelist(userId);
            return button.reply({
              embeds: [noGroupRequest],
              ephemeral: true,
            });
          }
          const handleCurrentJoinRequest = GroupsApi.acceptGroupJoinRequest({
            groupId: process.env.ROBLOX_GROUP_ID,
            userId: rbx.data.robloxId,
          })
            .then(async () => {
              await Info(`${robloxUsername} (${userId}) has been accepted.`);
            })
            .catch((err) => {
              console.error(err);
              return button.reply({
                content:
                  "Une erreur s'est produite lors de la tentative d'acceptation de la demande sur le groupe. Code d'erreur: `HANDLE_JOIN_REQUEST_ERROR`",
                ephemeral: true,
              });
            });
          const embed = new EmbedBuilder()
            .setTitle("DEMANDE DE WHITELIST REÇUE")
            .addFields(
              {
                name: "👥 Utilisateur",
                value: userMention(userId),
                inline: true,
              },
              {
                name: "⏰ Membre Discord",
                value: time(guildMember.joinedAt),
                inline: true,
              },
              {
                name: "👥 Pseudo Roblox",
                value: `[${robloxUsername}](https://www.roblox.com/users/${rbx.data.robloxId})`,
              },
              {
                name: "Pourquoi voulez-vous rejoindre Aston ?",
                value: requestEmbed.data.fields[3].value,
              },
              {
                name: "Comment avez-vous connu Aston ?",
                value: requestEmbed.data.fields[4].value,
              },
              {
                name: "Avez-vous joué sur d'autres serveurs RP ?",
                value: requestEmbed.data.fields[5].value,
              },
              {
                name: "Allez-vous vous investir & jouer sur Aston ?",
                value: requestEmbed.data.fields[6].value,
              },
              {
                name: "Fréquence de jeu prévue sur le serveur ?",
                value: requestEmbed.data.fields[7].value,
              },
              {
                name: "ℹ️ STATUT",
                value: `ACCEPTÉE PAR ${userMention(button.user.id)} ${time(
                  date,
                  "R"
                )}`,
              }
            )
            .setColor("Green");
          components[0].components[0].data.disabled = true;
          components[0].components[1].data.disabled = true;

          button.client.users.fetch(userId).then(async (discordUser) => {
            button.guild.members.cache
              .get(discordUser.id)
              .roles.add(whitelistedRole)
              .then(async () => {
                button.guild.members.cache
                  .get(discordUser.id)
                  .roles.remove(notwhitelistedRole);
              });
          });
          // get message by ID and then edit it
          await requestMessage.edit({
            embeds: [embed],
            components: components,
          });

          const logsData = {
            userId: userId,
            username: robloxUsername,
            member: button.user,
          };
          sendLogs(logsData, "➕ AJOUT WHITELIST", channel);

          button.reply({
            content: "Joueur accepté sur le groupe",
            ephemeral: true,
          });

          removeWhitelist(userId);

          this.client.users
            .send(userId, { embeds: [DMAcceptedEmbed], components: [DMButton] })
            .catch((err) => {
              console.error(err);
              const noDMs = new EmbedBuilder()
                .setTitle("❗ ERREUR")
                .setDescription(
                  "Impossible d'envoyer un message privé à l'utilisateur. Code d'erreur: `NO_DMS`"
                )
                .setColor("#7d4efd")
                .setFooter({
                  text: "© Aston - Tous droits réservés | 2019 - 2024",
                });
              return button.followUp({
                embeds: [noDMs],
                ephemeral: true,
              });
            });
        });
        break;
      case "whitelist-button-decline":
        const userId2 = button.message.embeds[0].footer.text;
        const requestMessage2 = button.message;
        const requestEmbed2 = requestMessage2.embeds[0];
        const guildMember2 = button.guild.members.cache.get(userId2);
        const admins2 = process.env.ADMINS;

        if (admins2.includes(guildMember2.id)) {
          const embed = new EmbedBuilder()
            .setTitle("❗ WHITELIST")
            .setDescription(
              "Cet utilisateur est un administrateur. Code d'erreur: `IS_ADMINISTRATOR`"
            )
            .setColor("#7d4efd")
            .setFooter({
              text: "© Aston - Tous droits réservés | 2019 - 2024",
            });

          return await button.reply({ embeds: [embed], ephemeral: true });
        }

        if (!guildMember2) {
          requestMessage2.delete();
          return button.reply({
            content:
              "Erreur: Impossible de retrouver le membre. Code d'erreur: `MEMBER_NOT_FOUND`",
            ephemeral: true,
          });
        }
        const robloxUser3 = resolveRobloxUser(userId2);
        robloxUser3.then(async (rbx) => {
          const robloxUsername = rbx.data.cachedUsername;
          const embed = new EmbedBuilder()
            .setTitle("DEMANDE DE WHITELIST REÇUE")
            .addFields(
              {
                name: "👥 Utilisateur",
                value: userMention(userId2),
                inline: true,
              },
              {
                name: "⏰ Membre du discord",
                value: time(guildMember2.joinedAt),
                inline: true,
              },
              {
                name: "👥 Pseudo Roblox",
                value: `[${robloxUsername}](https://www.roblox.com/users/${rbx.data.robloxId})`,
              },
              {
                name: "Pourquoi voulez-vous rejoindre Aston ?",
                value: requestEmbed2.data.fields[3].value,
              },
              {
                name: "Comment avez-vous connu Aston ?",
                value: requestEmbed2.data.fields[4].value,
              },
              {
                name: "Avez-vous joué sur d'autres serveurs RP ?",
                value: requestEmbed2.data.fields[5].value,
              },
              {
                name: "Allez-vous vous investir & jouer sur Aston ?",
                value: requestEmbed2.data.fields[6].value,
              },
              {
                name: "Fréquence de jeu prévue sur le serveur ?",
                value: requestEmbed2.data.fields[7].value,
              },
              {
                name: "ℹ️ STATUT",
                value: `REFUSÉE PAR ${userMention(button.user.id)} ${time(
                  date,
                  "R"
                )}`,
              }
            )
            .setColor("Red");

          // Disable the button that was clicked
          components[0].components[0].data.disabled = true;
          components[0].components[1].data.disabled = true;

          // get message by ID and then edit it
          await requestMessage2.edit({
            embeds: [embed],
            components: components,
          });

          const logsData = {
            userId: userId2,
            username: robloxUsername,
            member: button.user,
          };

          sendLogs(logsData, "➖ REFUS DE WHITELIST", channel);

          await button.reply({ content: "Joueur refusé", ephemeral: true });

          removeWhitelist(userId2);

          this.client.users
            .send(userId2, {
              embeds: [DMDeclinedEmbed],
              components: [DMButton],
            })
            .catch((err) => {
              console.error(err);
              const noDMs = new EmbedBuilder()
                .setTitle("❗ ERREUR")
                .setDescription(
                  "Impossible d'envoyer un message privé à l'utilisateur. Code d'erreur: `NO_DMS`"
                )
                .setColor("#7d4efd")
                .setFooter({
                  text: "© Aston - Tous droits réservés | 2019 - 2024",
                });
              return button.followUp({
                embeds: [noDMs],
                ephemeral: true,
              });
            });
        });
        break;
    }
  }
};