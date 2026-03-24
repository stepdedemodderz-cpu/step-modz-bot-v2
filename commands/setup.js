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
    .setDescription('Richtet Step Mod!Z BOT für diesen Server ein.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
      option
        .setName('verify_role')
        .setDescription('Rolle für Nutzer nach erfolgreicher Verifizierung')
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('unverified_role')
        .setDescription('Optionale Rolle für neue, noch nicht verifizierte Nutzer')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('welcome_channel')
        .setDescription('Channel für Begrüßungsnachrichten bei neuen Mitgliedern')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('ticket_category')
        .setDescription('Kategorie, in der neue Support-Tickets erstellt werden')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('ticket_support_role')
        .setDescription('Rolle, die Zugriff auf Support-Tickets bekommen soll')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('whitelist_category')
        .setDescription('Kategorie, in der neue Whitelist-Bewerbungen erstellt werden')
        .addChannelTypes(ChannelType.GuildCategory)
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('whitelist_review_role')
        .setDescription('Rolle, die Whitelist-Bewerbungen prüfen darf')
        .setRequired(false)
    )
    .addRoleOption((option) =>
      option
        .setName('whitelist_approved_role')
        .setDescription('Rolle, die Nutzer nach angenommener Whitelist erhalten')
        .setRequired(false)
    )
    .addChannelOption((option) =>
      option
        .setName('log_channel')
        .setDescription('Optionaler Log-Channel für wichtige Bot-Aktionen')
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

    const embed = new EmbedBuilder()
      .setImage('https://media.discordapp.net/attachments/1468693516942180372/1485943376179237026/25882009-b8b1-4350-bdaa-9652c0bfead3.png?ex=69c3b41c&is=69c2629c&hm=06fb2176062774d470971c3fdd5c9d03b262e02e860c1b491e669c424dc96547&=&format=webp&quality=lossless')
      .setTitle('⚙️ Step Mod!Z BOT Setup gespeichert')
      .setDescription(
        [
          `Der Bot wurde erfolgreich für **${interaction.guild.name}** eingerichtet.`,
          '',
          'Hier siehst du direkt, was gesetzt wurde und wofür es ist.'
        ].join('\n')
      )
      .addFields(
        {
          name: '🔐 Verify Rolle',
          value: config.verifyRoleId
            ? `<@&${config.verifyRoleId}>\nDiese Rolle erhalten Nutzer nach erfolgreicher Verifizierung.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🚫 Unverified Rolle',
          value: config.unverifiedRoleId
            ? `<@&${config.unverifiedRoleId}>\nDiese Rolle kann neuen Nutzern vor der Verifizierung gegeben werden.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '👋 Welcome Channel',
          value: config.welcomeChannelId
            ? `<#${config.welcomeChannelId}>\nHier sendet der Bot Begrüßungsnachrichten für neue Mitglieder.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🎫 Ticket Kategorie',
          value: config.ticketCategoryId
            ? `<#${config.ticketCategoryId}>\nIn dieser Kategorie erstellt der Bot neue Support-Tickets.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🛡️ Ticket Support Rolle',
          value: config.ticketSupportRoleId
            ? `<@&${config.ticketSupportRoleId}>\nDiese Rolle kann Support-Tickets sehen und bearbeiten.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '📋 Whitelist Kategorie',
          value: config.whitelistCategoryId
            ? `<#${config.whitelistCategoryId}>\nIn dieser Kategorie erstellt der Bot neue Whitelist-Bewerbungen.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '👀 Whitelist Review Rolle',
          value: config.whitelistReviewRoleId
            ? `<@&${config.whitelistReviewRoleId}>\nDiese Rolle darf Whitelist-Bewerbungen annehmen oder ablehnen.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '✅ Whitelist Approved Rolle',
          value: config.whitelistApprovedRoleId
            ? `<@&${config.whitelistApprovedRoleId}>\nDiese Rolle wird nach angenommener Whitelist vergeben.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '📝 Log Channel',
          value: config.logChannelId
            ? `<#${config.logChannelId}>\nHier kann der Bot wichtige Informationen und Logs senden.`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🚀 Nächste Schritte',
          value: [
            '`/settings` → Zeigt die aktuelle Konfiguration',
            '`/verify-panel` → Sendet das Verifizierungs-Panel',
            '`/ticket-panel` → Sendet das Ticket-Panel',
            '`/whitelist-panel` → Sendet das Whitelist-Panel',
            '`/setup-welcome` → Sendet eine Welcome-Nachricht in den Welcome-Channel'
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ text: 'Step Mod!Z BOT • Deutsches Setup-System' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};