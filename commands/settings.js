import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('settings')
    .setDescription('Zeigt die gespeicherten Einstellungen dieses Servers.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config) {
      await interaction.reply({
        content: '❌ Für diesen Server wurde noch kein Setup gespeichert. Nutze zuerst /setup',
        ephemeral: true
      });
      return;
    }

    const lines = [
      `Verify Role: ${config.verifyRoleId ? `<@&${config.verifyRoleId}>` : 'Nicht gesetzt'}`,
      `Unverified Role: ${config.unverifiedRoleId ? `<@&${config.unverifiedRoleId}>` : 'Nicht gesetzt'}`,
      `Welcome Channel: ${config.welcomeChannelId ? `<#${config.welcomeChannelId}>` : 'Nicht gesetzt'}`,
      `Ticket Kategorie: ${config.ticketCategoryId ? `<#${config.ticketCategoryId}>` : 'Nicht gesetzt'}`,
      `Ticket Support Rolle: ${config.ticketSupportRoleId ? `<@&${config.ticketSupportRoleId}>` : 'Nicht gesetzt'}`,
      `Whitelist Kategorie: ${config.whitelistCategoryId ? `<#${config.whitelistCategoryId}>` : 'Nicht gesetzt'}`,
      `Whitelist Review Rolle: ${config.whitelistReviewRoleId ? `<@&${config.whitelistReviewRoleId}>` : 'Nicht gesetzt'}`,
      `Whitelist Approved Rolle: ${config.whitelistApprovedRoleId ? `<@&${config.whitelistApprovedRoleId}>` : 'Nicht gesetzt'}`,
      `Log Channel: ${config.logChannelId ? `<#${config.logChannelId}>` : 'Nicht gesetzt'}`
    ];

    await interaction.reply({
      content: lines.join('\n'),
      ephemeral: true
    });
  }
};
