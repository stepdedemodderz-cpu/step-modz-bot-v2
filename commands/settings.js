import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { getGuildConfig } from '../utils/config.js';

function formatRole(id) {
  return id ? `<@&${id}>` : 'Nicht gesetzt';
}

function formatChannel(id) {
  return id ? `<#${id}>` : 'Nicht gesetzt';
}

export default {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Zeigt die gespeicherten Einstellungen dieses Servers.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Kein Setup gefunden')
        .setDescription(
          [
            'Für diesen Server wurde noch keine Bot-Konfiguration gespeichert.',
            '',
            'Nutze zuerst **`/setup`**, um Step Mod!Z BOT einzurichten.'
          ].join('\n')
        )
        .setFooter({ text: 'Step Mod!Z BOT • Setup Hilfe' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      return;
    }

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Aktuelle Server-Einstellungen')
      .setDescription(`Gespeicherte Konfiguration für **${interaction.guild.name}**`)
      .addFields(
        {
          name: '🔐 Verify System',
          value: [
            `**Verify Rolle:** ${formatRole(config.verifyRoleId)}`,
            `**Unverified Rolle:** ${formatRole(config.unverifiedRoleId)}`
          ].join('\n'),
          inline: false
        },
        {
          name: '👋 Welcome System',
          value: `**Welcome Channel:** ${formatChannel(config.welcomeChannelId)}`,
          inline: false
        },
        {
          name: '🎫 Ticket System',
          value: [
            `**Ticket Kategorie:** ${formatChannel(config.ticketCategoryId)}`,
            `**Support Rolle:** ${formatRole(config.ticketSupportRoleId)}`
          ].join('\n'),
          inline: false
        },
        {
          name: '📋 Whitelist System',
          value: [
            `**Whitelist Kategorie:** ${formatChannel(config.whitelistCategoryId)}`,
            `**Review Rolle:** ${formatRole(config.whitelistReviewRoleId)}`,
            `**Approved Rolle:** ${formatRole(config.whitelistApprovedRoleId)}`
          ].join('\n'),
          inline: false
        },
        {
          name: '📝 Logs',
          value: `**Log Channel:** ${formatChannel(config.logChannelId)}`,
          inline: false
        }
      )
      .setFooter({ text: 'Step Mod!Z BOT • Konfigurationsübersicht' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};