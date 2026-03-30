import {
  Events,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { t } from '../utils/i18n.js';
import {
  buildRulesEmbed,
  buildRulesAcceptRow
} from '../utils/rules.js';
import { buildInfoEmbed } from '../utils/infoEmbed.js';
import { buildHelpEmbed } from '../utils/helpMenu.js';
import { runAutoSetup } from '../utils/autosetup.js';
import { createTicketChannel } from '../utils/tickets.js';
import {
  buildWhitelistModal,
  createWhitelistChannel,
  handleWhitelistDecision
} from '../utils/whitelist.js';

function buildCloseRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_close_help')
      .setLabel('Schließen')
      .setStyle(ButtonStyle.Danger)
  );
}

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction, client) {
    try {
      const isOwner = interaction.guild && interaction.user.id === interaction.guild.ownerId;
      const config = interaction.guild ? getGuildConfig(interaction.guild.id) || {} : {};
      let language = config.language || 'de';

      if (interaction.isChatInputCommand()) {
        if (interaction.commandName !== 'validate' && interaction.commandName !== 'update-server' && !isOwner) {
          await interaction.reply({
            content: '❌ Diesen Befehl darf nur der Server-Besitzer benutzen.',
            ephemeral: true
          });
          return;
        }

        if (interaction.commandName === 'validate') {
          const validatorChannelId = config.validatorChannelId;
          if (validatorChannelId && interaction.channelId !== validatorChannelId) {
            await interaction.reply({
              content: '❌ `/validate` darf nur im Validator-Channel benutzt werden.',
              ephemeral: true
            });
            return;
          }
        }

        const command = client.commands.get(interaction.commandName);

        if (!command) {
          await interaction.reply({
            content: `❌ Command nicht gefunden: ${interaction.commandName}`,
            ephemeral: true
          });
          return;
        }

        await command.execute(interaction, client);
        return;
      }

      if (interaction.isButton()) {
        if (interaction.customId === 'stepmodz_lang_de') {
          if (!isOwner) {
            await interaction.reply({
              content: '❌ Diese Funktion darf nur der Server-Besitzer benutzen.',
              ephemeral: true
            });
            return;
          }

          setGuildConfig(interaction.guild.id, { ...config, language: 'de' });
          await interaction.reply({
            content: t('de', 'languageSetGerman'),
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_lang_en') {
          if (!isOwner) {
            await interaction.reply({
              content: '❌ Diese Funktion darf nur der Server-Besitzer benutzen.',
              ephemeral: true
            });
            return;
          }

          setGuildConfig(interaction.guild.id, { ...config, language: 'en' });
          await interaction.reply({
            content: t('en', 'languageSetEnglish'),
            ephemeral: true
          });
          return;
        }

        language = (getGuildConfig(interaction.guild.id) || {}).language || language;

        if (interaction.customId === 'stepmodz_close_help') {
          await interaction.update({
            content: '✅ Geschlossen.',
            embeds: [],
            components: []
          });
          return;
        }

        if (interaction.customId === 'stepmodz_open_info') {
          await interaction.reply({
            embeds: [buildInfoEmbed(language)],
            components: [buildCloseRow()],
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_rules_de') {
          await interaction.reply({
            embeds: [buildRulesEmbed('de')],
            components: [buildRulesAcceptRow('de')],
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_rules_en') {
          await interaction.reply({
            embeds: [buildRulesEmbed('en')],
            components: [buildRulesAcceptRow('en')],
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_rules_accept') {
          await interaction.deferReply({ ephemeral: true });

          if (!config.rulesAcceptedRoleId) {
            await interaction.editReply({
              content: '❌ RulesAccepted Rolle fehlt. Nutze Schnell Einrichtung erneut.'
            });
            return;
          }

          const member = interaction.member;
          const rulesRole = interaction.guild.roles.cache.get(config.rulesAcceptedRoleId);

          if (!rulesRole) {
            await interaction.editReply({
              content: '❌ RulesAccepted Rolle existiert nicht.'
            });
            return;
          }

          if (!member.roles.cache.has(rulesRole.id)) {
            await member.roles.add(rulesRole).catch(() => null);
          }

          await interaction.editReply({
            content: '✅ Regeln bestätigt. Klicke jetzt unten auf **Verifizieren**.'
          });
          return;
        }

        if (interaction.customId === 'stepmodz_verify') {
          await interaction.deferReply({ ephemeral: true });

          if (!config.verifyRoleId || !config.unverifiedRoleId || !config.rulesAcceptedRoleId) {
            await interaction.editReply({
              content: '❌ Verify / Unverify / RulesAccepted Rollen fehlen. Nutze Schnell Einrichtung oder `/setup`.'
            });
            return;
          }

          const member = interaction.member;
          const verifyRole = interaction.guild.roles.cache.get(config.verifyRoleId);
          const unverifyRole = interaction.guild.roles.cache.get(config.unverifiedRoleId);
          const rulesAcceptedRole = interaction.guild.roles.cache.get(config.rulesAcceptedRoleId);

          if (!verifyRole) {
            await interaction.editReply({
              content: '❌ Die Verify Rolle existiert nicht mehr.'
            });
            return;
          }

          if (!rulesAcceptedRole || !member.roles.cache.has(rulesAcceptedRole.id)) {
            await interaction.editReply({
              content: '❌ Du musst zuerst die Regeln bestätigen.'
            });
            return;
          }

          try {
            if (!member.roles.cache.has(verifyRole.id)) {
              await member.roles.add(verifyRole);
            }

            if (unverifyRole && member.roles.cache.has(unverifyRole.id)) {
              await member.roles.remove(unverifyRole);
            }

            if (rulesAcceptedRole && member.roles.cache.has(rulesAcceptedRole.id)) {
              await member.roles.remove(rulesAcceptedRole).catch(() => null);
            }

            await interaction.editReply({
              content: '✅ Du wurdest erfolgreich verifiziert!'
            });
            return;
          } catch (error) {
            console.error('VERIFY ERROR:', error);

            await interaction.editReply({
              content:
                '❌ Fehler beim Verifizieren. Prüfe, ob der Bot Rollen verwalten darf und ob seine Rolle über Verify / Unverify steht.'
            });
            return;
          }
        }

        if (interaction.customId === 'stepmodz_open_ticket') {
          try {
            const result = await createTicketChannel(interaction);

            await interaction.reply({
              content: result.exists
                ? `ℹ️ Du hast bereits ein Ticket: ${result.channel}`
                : `✅ Dein Ticket wurde erstellt: ${result.channel}`,
              ephemeral: true
            });
          } catch (error) {
            console.error('TICKET BUTTON ERROR:', error);

            await interaction.reply({
              content: '❌ Ticket konnte nicht erstellt werden. Prüfe Ticket-Kategorie und Bot-Rechte.',
              ephemeral: true
            });
          }
          return;
        }

        if (interaction.customId === 'stepmodz_close_ticket') {
          await interaction.reply({
            content: '🔒 Ticket wird geschlossen...',
            ephemeral: true
          });

          setTimeout(async () => {
            await interaction.channel.delete().catch(() => null);
          }, 3000);

          return;
        }

        if (interaction.customId === 'stepmodz_open_whitelist') {
          try {
            await interaction.showModal(buildWhitelistModal());
          } catch (error) {
            console.error('WHITELIST BUTTON ERROR:', error);

            await interaction.reply({
              content: '❌ Whitelist-Formular konnte nicht geöffnet werden.',
              ephemeral: true
            });
          }
          return;
        }

        if (interaction.customId === 'stepmodz_whitelist_accept') {
          if (!isOwner) {
            await interaction.reply({
              content: '❌ Diese Funktion darf nur der Server-Besitzer benutzen.',
              ephemeral: true
            });
            return;
          }

          await handleWhitelistDecision(interaction, true);
          await interaction.reply({
            content: '✅ Bewerbung angenommen.',
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_whitelist_deny') {
          if (!isOwner) {
            await interaction.reply({
              content: '❌ Diese Funktion darf nur der Server-Besitzer benutzen.',
              ephemeral: true
            });
            return;
          }

          await handleWhitelistDecision(interaction, false);
          await interaction.reply({
            content: '❌ Bewerbung abgelehnt.',
            ephemeral: true
          });
          return;
        }

        return;
      }

      if (interaction.isStringSelectMenu()) {
        if (!isOwner) {
          await interaction.reply({
            content: '❌ Diese Funktion darf nur der Server-Besitzer benutzen.',
            ephemeral: true
          });
          return;
        }

        language = (getGuildConfig(interaction.guild.id) || {}).language || language;

        if (interaction.customId === 'stepmodz_help_menu') {
          const selected = interaction.values[0];

          if (selected === 'dropdown_info') {
            await interaction.reply({
              embeds: [buildHelpEmbed(language, selected)],
              components: [buildCloseRow()],
              ephemeral: true
            });
            return;
          }

          if (selected === 'quicksetup') {
            await interaction.deferReply({ ephemeral: true });

          if (selected === 'update_tools') {
  await interaction.deferReply({ ephemeral: true });

  const result = await runAutoSetup(interaction.guild, { mode: 'update' });

  const embed = new EmbedBuilder()
    .setTitle('🆕 Neue Tools übernehmen')
    .setDescription(
      !result.createdAnything
        ? '✅ Bot hat bereits das neueste Update. Es wurden keine neuen Tools gefunden.'
        : '✅ Der Bot hat neue fehlende Tools und Bereiche ergänzt.'
    )
    .addFields(
      {
        name: 'Bedeutung',
        value:
          'Diese Funktion ergänzt nur neue fehlende Bot-Bereiche, die nach späteren Updates hinzugekommen sind.\n' +
          'Bereits vorhandene Kanäle und Kategorien werden nicht neu eingerichtet.',
        inline: false
      },
      {
        name: 'Neu ergänzt',
        value: !result.createdAnything
          ? '• Keine neuen Tools gefunden'
          : result.createdList.map((x) => `• ${x}`).join('\n'),
        inline: false
      }
    )
    .setColor(0x22c55e)
    .setFooter({ text: 'Step Mod!Z BOT' })
    .setTimestamp();

  await interaction.editReply({
    embeds: [embed],
    components: [buildCloseRow()]
  });
  return;
}

            const result = await runAutoSetup(interaction.guild, { mode: 'full' });

            const embed = new EmbedBuilder()
              .setTitle(
                language === 'en'
                  ? '⚡ Quick setup completed'
                  : '⚡ Schnell Einrichtung abgeschlossen'
              )
              .setDescription(
                language === 'en'
                  ? 'The bot has automatically created the main categories for you.'
                  : 'Der Bot hat die wichtigsten Kategorien automatisch für dich eingerichtet.'
              )
              .addFields(
                {
                  name: 'Erstellte Kategorien',
                  value: [
                    `• ${result.verificationCategory.name}`,
                    `• ${result.welcomeCategory.name}`,
                    `• ${result.ticketCategory.name}`,
                    `• ${result.whitelistCategory.name}`,
                    `• ${result.validatorCategory.name}`
                  ].join('\n'),
                  inline: false
                }
              )
              .setColor(0x22c55e)
              .setFooter({ text: 'Step Mod!Z BOT' })
              .setTimestamp();

            await interaction.editReply({
              embeds: [embed],
              components: [buildCloseRow()]
            });
            return;
          }

          await interaction.reply({
            embeds: [buildHelpEmbed(language, selected)],
            components: [buildCloseRow()],
            ephemeral: true
          });
          return;
        }

        return;
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId !== 'stepmodz_whitelist_modal') return;

        const data = {
          gamertag: interaction.fields.getTextInputValue('gamertag'),
          age: interaction.fields.getTextInputValue('age'),
          experience: interaction.fields.getTextInputValue('experience'),
          reason: interaction.fields.getTextInputValue('reason')
        };

        const channel = await createWhitelistChannel(interaction, data);

        await interaction.reply({
          content: `✅ Deine Whitelist-Bewerbung wurde gesendet: ${channel}`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('InteractionCreate Fehler:', error);

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ Fehler beim Ausführen des Commands.',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: '❌ Fehler beim Ausführen des Commands.',
            ephemeral: true
          });
        }
      } catch (replyError) {
        console.error('Fehler beim Antworten auf Interaction:', replyError);
      }
    }
  }
};