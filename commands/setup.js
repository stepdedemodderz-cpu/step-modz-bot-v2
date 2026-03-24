import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder
} from 'discord.js';
import { setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Speichert die Einstellungen für Step Mod!Z BOT.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName('verify_role')
        .setDescription('Optional: Rolle für Nutzer nach erfolgreicher Verifizierung')
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('unverified_role')
        .setDescription('Optional: Rolle für neue, noch nicht verifizierte Nutzer')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('welcome_channel')
        .setDescription('Optional: Channel für Begrüßungsnachrichten')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('ticket_category')
        .setDescription('Optional: Kategorie für Support-Tickets')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('ticket_support_role')
        .setDescription('Optional: Rolle mit Zugriff auf Support-Tickets')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('whitelist_category')
        .setDescription('Optional: Kategorie für Whitelist-Bewerbungen')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('whitelist_review_role')
        .setDescription('Optional: Rolle, die Whitelist-Bewerbungen prüfen darf')
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('whitelist_approved_role')
        .setDescription('Optional: Rolle nach angenommener Whitelist')
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
      whitelistApprovedRoleId: interaction.options.getRole('whitelist_approved_role')?.id || null
    };

    setGuildConfig(interaction.guild.id, config);

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Step Mod!Z BOT Setup gespeichert')
      .setDescription(
        [
          `Die Einstellungen für **${interaction.guild.name}** wurden gespeichert.`,
          '',
          '**Wichtig:**',
          'Mit `/setup` werden **keine** Kategorien oder Channels automatisch erstellt.',
          '',
          'Wenn du alles automatisch erstellen lassen willst, nutze im Bot-Channel das Dropdown:',
          '**Step BOT Schnell Einrichtung**'
        ].join('\n')
      )
      .addFields(
        {
          name: '🔐 Verify Rolle',
          value: config.verifyRoleId ? `<@&${config.verifyRoleId}>` : 'Nicht gesetzt (optional)',
          inline: false
        },
        {
          name: '🚫 Unverified Rolle',
          value: config.unverifiedRoleId ? `<@&${config.unverifiedRoleId}>` : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '👋 Welcome Channel',
          value: config.welcomeChannelId ? `<#${config.welcomeChannelId}>` : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🎫 Ticket Kategorie',
          value: config.ticketCategoryId ? `<#${config.ticketCategoryId}>` : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🛡️ Ticket Support Rolle',
          value: config.ticketSupportRoleId ? `<@&${config.ticketSupportRoleId}>` : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '📋 Whitelist Kategorie',
          value: config.whitelistCategoryId ? `<#${config.whitelistCategoryId}>` : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '👀 Whitelist Review Rolle',
          value: config.whitelistReviewRoleId ? `<@&${config.whitelistReviewRoleId}>` : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '✅ Whitelist Approved Rolle',
          value: config.whitelistApprovedRoleId ? `<@&${config.whitelistApprovedRoleId}>` : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🚀 Nächste Schritte',
          value: [
            '`/settings` → aktuelle Konfiguration ansehen',
            '`/verify-panel` → Verify Panel senden',
            '`/ticket-panel` → Ticket Panel senden',
            '`/whitelist-panel` → Whitelist Panel senden',
            '`/setup-welcome` → Welcome Nachricht senden',
            'oder im Dropdown **Step BOT Schnell Einrichtung** wählen'
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ text: 'Step Mod!Z BOT • Manuelles Setup' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};