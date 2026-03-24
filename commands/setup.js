import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  PermissionsBitField
} from 'discord.js';
import { setGuildConfig } from '../utils/config.js';

async function ensureCategory(guild, name) {
  let category = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name === name
  );

  if (!category) {
    category = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [PermissionsBitField.Flags.ViewChannel]
        }
      ]
    });
  }

  return category;
}

async function ensureTextChannel(guild, name, parentId) {
  let channel = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      c.name === name &&
      c.parentId === parentId
  );

  if (!channel) {
    channel = await guild.channels.create({
      name,
      type: ChannelType.GuildText,
      parent: parentId,
      permissionOverwrites: [
        {
          id: guild.roles.everyone.id,
          allow: [
            PermissionsBitField.Flags.ViewChannel,
            PermissionsBitField.Flags.SendMessages,
            PermissionsBitField.Flags.ReadMessageHistory
          ]
        }
      ]
    });
  }

  return channel;
}

function buildInfoEmbed(title, description, footer = 'Step Mod!Z BOT • Setup Hilfe') {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x5865f2)
    .setFooter({ text: footer })
    .setTimestamp();
}

export default {
  data: new SlashCommandBuilder()
    .setName('setup')
    .setDescription('Richtet Step Mod!Z BOT für diesen Server ein.')
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
    )
    .addChannelOption((option) =>
      option
        .setName('log_channel')
        .setDescription('Optional: Log-Channel für Bot-Aktionen')
        .addChannelTypes(ChannelType.GuildText)
        .setRequired(false)
    ),

  async execute(interaction) {
    await interaction.deferReply({ ephemeral: true });

    const guild = interaction.guild;

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

    // Zentrale Setup-Kategorie
    const setupCategory = await ensureCategory(guild, 'Step Mod!Z BOT Setup');

    // Allgemeiner Info-Channel
    const botInfoChannel = await ensureTextChannel(guild, 'bot-info', setupCategory.id);
    await botInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '🤖 Step Mod!Z BOT – Nächste Schritte',
          [
            `Hallo **${guild.name}** 👋`,
            '',
            'Dein Grundsetup wurde gespeichert.',
            '',
            '**Was du jetzt machen kannst:**',
            '• `/info` → Übersicht & Einrichtung',
            '• `/settings` → aktuelle Konfiguration ansehen',
            '• Nutze die Setup-Hilfe-Channels unten für die einzelnen Systeme'
          ].join('\n')
        )
      ]
    });

    // Welcome-System
    if (!config.welcomeChannelId) {
      const welcomeChannel = await ensureTextChannel(guild, 'welcome', setupCategory.id);
      config.welcomeChannelId = welcomeChannel.id;
    }

    const welcomeInfoChannel = await ensureTextChannel(guild, 'welcome-info', setupCategory.id);
    await welcomeInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '👋 Welcome System',
          [
            'Hier erklärst du das Welcome-System.',
            '',
            '**So aktivierst du es:**',
            '1. Prüfe mit `/settings`, ob ein Welcome-Channel gesetzt ist',
            '2. Nutze `/setup-welcome`, um eine Welcome-Nachricht zu senden',
            '3. Neue Mitglieder bekommen dann Begrüßungen im gesetzten Channel'
          ].join('\n'),
          'Step Mod!Z BOT • Welcome Hilfe'
        )
      ]
    });

    // Verify-System (nur wenn Rolle gesetzt)
    if (config.verifyRoleId) {
      const verifyInfoChannel = await ensureTextChannel(guild, 'verify-info', setupCategory.id);
      await verifyInfoChannel.send({
        embeds: [
          buildInfoEmbed(
            '🔐 Verify System',
            [
              'Das Verify-System ist aktiviert, weil eine Verify-Rolle gesetzt wurde.',
              '',
              '**So aktivierst du es vollständig:**',
              '1. Nutze `/verify-panel` in dem Channel, in dem das Verify-Panel erscheinen soll',
              '2. Nutzer klicken dort auf den Verify-Button',
              '3. Nach erfolgreicher Verifizierung bekommen sie die Verify-Rolle'
            ].join('\n'),
            'Step Mod!Z BOT • Verify Hilfe'
          )
        ]
      });
    }

    // Ticket-System
    let ticketCategory = null;
    if (config.ticketCategoryId) {
      ticketCategory = guild.channels.cache.get(config.ticketCategoryId) || null;
    }
    if (!ticketCategory) {
      ticketCategory = await ensureCategory(guild, 'Tickets');
      config.ticketCategoryId = ticketCategory.id;
    }

    const ticketInfoChannel = await ensureTextChannel(guild, 'ticket-info', ticketCategory.id);
    await ticketInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '🎫 Ticket System',
          [
            'Diese Kategorie ist für dein Ticket-System vorbereitet.',
            '',
            '**So aktivierst du es:**',
            '1. Optional: Setze in `/setup` eine Ticket Support Rolle',
            '2. Nutze `/ticket-panel` in dem Channel, in dem das Ticket-Panel erscheinen soll',
            '3. Nutzer klicken auf den Button',
            '4. Der Bot erstellt danach private Support-Tickets in dieser Kategorie'
          ].join('\n'),
          'Step Mod!Z BOT • Ticket Hilfe'
        )
      ]
    });

    // Whitelist-System
    let whitelistCategory = null;
    if (config.whitelistCategoryId) {
      whitelistCategory = guild.channels.cache.get(config.whitelistCategoryId) || null;
    }
    if (!whitelistCategory) {
      whitelistCategory = await ensureCategory(guild, 'Whitelist');
      config.whitelistCategoryId = whitelistCategory.id;
    }

    const whitelistInfoChannel = await ensureTextChannel(guild, 'whitelist-info', whitelistCategory.id);
    await whitelistInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '📋 Whitelist System',
          [
            'Diese Kategorie ist für dein Whitelist-System vorbereitet.',
            '',
            '**So aktivierst du es:**',
            '1. Optional: Setze in `/setup` eine Review Rolle',
            '2. Optional: Setze in `/setup` eine Approved Rolle',
            '3. Nutze `/whitelist-panel` in dem Channel, in dem das Whitelist-Panel erscheinen soll',
            '4. Nutzer können sich dann direkt bewerben'
          ].join('\n'),
          'Step Mod!Z BOT • Whitelist Hilfe'
        )
      ]
    });

    // Validator-Hilfe
    const validatorInfoChannel = await ensureTextChannel(guild, 'validator-info', setupCategory.id);
    await validatorInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '🧪 Validator Hilfe',
          [
            'Mit dem Validator kannst du JSON-, XML- und DayZ-Dateien prüfen.',
            '',
            '**So benutzt du ihn:**',
            '1. Nutze `/validate`',
            '2. Lade eine JSON- oder XML-Datei hoch',
            '3. Der Bot erkennt den Typ automatisch',
            '4. Du bekommst Fehler, Hinweise und DayZ-Sonderprüfungen'
          ].join('\n'),
          'Step Mod!Z BOT • Validator Hilfe'
        )
      ]
    });

    // Log-Channel automatisch anlegen, wenn keiner gesetzt
    if (!config.logChannelId) {
      const logChannel = await ensureTextChannel(guild, 'bot-logs', setupCategory.id);
      config.logChannelId = logChannel.id;
    }

    // Konfiguration speichern
    setGuildConfig(interaction.guild.id, config);

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Step Mod!Z BOT Setup gespeichert')
      .setDescription(
        [
          `Der Bot wurde erfolgreich für **${interaction.guild.name}** eingerichtet.`,
          '',
          'Zusätzlich wurden Hilfs-Channels und Kategorien vorbereitet.',
          'Dort steht jeweils direkt, was du als Nächstes machen musst.'
        ].join('\n')
      )
      .addFields(
        {
          name: '🔐 Verify Rolle',
          value: config.verifyRoleId
            ? `<@&${config.verifyRoleId}>`
            : 'Nicht gesetzt (optional)',
          inline: false
        },
        {
          name: '🚫 Unverified Rolle',
          value: config.unverifiedRoleId
            ? `<@&${config.unverifiedRoleId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '👋 Welcome Channel',
          value: config.welcomeChannelId
            ? `<#${config.welcomeChannelId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🎫 Ticket Kategorie',
          value: config.ticketCategoryId
            ? `<#${config.ticketCategoryId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🛡️ Ticket Support Rolle',
          value: config.ticketSupportRoleId
            ? `<@&${config.ticketSupportRoleId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '📋 Whitelist Kategorie',
          value: config.whitelistCategoryId
            ? `<#${config.whitelistCategoryId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '👀 Whitelist Review Rolle',
          value: config.whitelistReviewRoleId
            ? `<@&${config.whitelistReviewRoleId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '✅ Whitelist Approved Rolle',
          value: config.whitelistApprovedRoleId
            ? `<@&${config.whitelistApprovedRoleId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '📝 Log Channel',
          value: config.logChannelId
            ? `<#${config.logChannelId}>`
            : 'Nicht gesetzt',
          inline: false
        },
        {
          name: '🚀 Nächste Schritte',
          value: [
            '`/info` → Übersicht & Einrichtung',
            '`/settings` → aktuelle Konfiguration',
            '`/verify-panel` → Verify Panel senden',
            '`/ticket-panel` → Ticket Panel senden',
            '`/whitelist-panel` → Whitelist Panel senden',
            '`/setup-welcome` → Welcome-Nachricht senden'
          ].join('\n'),
          inline: false
        }
      )
      .setFooter({ text: 'Step Mod!Z BOT • Automatisches Setup-System' })
      .setTimestamp();

    await interaction.editReply({
      embeds: [embed]
    });
  }
};