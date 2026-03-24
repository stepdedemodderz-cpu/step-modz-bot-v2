import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType
} from 'discord.js';
import { setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Richtet Step Mod!Z BOT für diesen Server ein.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName('verify_role')
        .setDescription('Rolle für verifizierte Nutzer')
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName('unverified_role')
        .setDescription('Rolle für nicht verifizierte Nutzer')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('welcome_channel')
        .setDescription('Welcome Channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('ticket_category')
        .setDescription('Kategorie für Tickets')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('ticket_support_role')
        .setDescription('Support Rolle für Tickets')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('whitelist_category')
        .setDescription('Kategorie für Whitelist Bewerbungen')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('whitelist_review_role')
        .setDescription('Rolle für Whitelist Team')
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('whitelist_approved_role')
        .setDescription('Rolle nach angenommener Whitelist')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('log_channel')
        .setDescription('Log Channel')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

  async execute(interaction) {
    const config = {
      verifyRoleId: interaction.options.getRole('verify_role')?.id || null,
      unverifiedRoleId: interaction.options.getRole('unverified_role')?.id || null,
      welcomeChannelId: interaction.options.getChannel('welcome_channel')?.id || null,
      ticketCategoryId: interaction.options.getChannel('ticket_category')?.id || null,
      ticketSupportRoleId: interaction.options.getRole('ticket_support_role')?.id || null,
      whitelistCategoryId: interaction.options.getChannel('whitelist_category')?.id || null,
      whitelistReviewRoleId: interaction.options.getRole('whitelist_review_role')?.id || null,
      whitelistApprovedRoleId: interaction.options.getRole('whitelist_approved_role')?.id || null,
      logChannelId: interaction.options.getChannel('log_channel')?.id || null
    };

    setGuildConfig(interaction.guild.id, config);

    await interaction.reply({
      content: '✅ Step Mod!Z BOT wurde für diesen Server eingerichtet.',
      ephemeral: true
    });
  }
};
