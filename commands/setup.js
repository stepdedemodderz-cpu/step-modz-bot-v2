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
      whitelistApprovedRoleId: interaction.options.getRole('whitelist_approved_role')?.id || null
    };

    // WELCOME
    const welcomeCategory = await ensureCategory(guild, 'Welcome');
    const welcomeInfoChannel = await ensureTextChannel(guild, 'welcome-info', welcomeCategory.id);

    await welcomeInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '👋 Welcome',
          [
            'Hier findest du die Hilfe für das Welcome-System.',
            '',
            '**So aktivierst du es:**',
            '1. Setze mit `/setup` optional einen Welcome Channel',
            '2. Nutze danach `/setup-welcome`',
            '3. Der Bot sendet dann eine Welcome-Nachricht in den gesetzten Channel',
            '',
            '**Tipp:**',
            'Wenn du noch keinen Welcome Channel gesetzt hast, kannst du `/setup` einfach nochmal benutzen.'
          ].join('\n'),
          'Step Mod!Z BOT • Welcome Hilfe'
        )
      ]
    });

    // ROLES
    const rolesCategory = await ensureCategory(guild, 'Roles');
    const rolesInfoChannel = await ensureTextChannel(guild, 'roles-info', rolesCategory.id);

    await rolesInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '🛡️ Roles',
          [
            'Hier findest du die Hilfe für Rollen und Verifizierung.',
            '',
            '**Verify Rolle:**',
            'Optional. Nutzer bekommen diese Rolle nach erfolgreicher Verifizierung.',
            '',
            '**Unverified Rolle:**',
            'Optional. Diese Rolle kann neuen Nutzern vor der Verifizierung gegeben werden.',
            '',
            '**So aktivierst du Verify:**',
            '1. Setze optional eine Verify Rolle in `/setup`',
            '2. Nutze danach `/verify-panel`',
            '3. Nutzer klicken auf den Verify Button'
          ].join('\n'),
          'Step Mod!Z BOT • Roles Hilfe'
        )
      ]
    });

    // TICKET
    let ticketCategory = null;
    if (config.ticketCategoryId) {
      ticketCategory = guild.channels.cache.get(config.ticketCategoryId) || null;
    }
    if (!ticketCategory) {
      ticketCategory = await ensureCategory(guild, 'Ticket');
      config.ticketCategoryId = ticketCategory.id;
    }

    const ticketInfoChannel = await ensureTextChannel(guild, 'ticket-info', ticketCategory.id);

    await ticketInfoChannel.send({
      embeds: [
        buildInfoEmbed(
          '🎫 Ticket',
          [
            'Hier findest du die Hilfe für das Ticket-System.',
            '',
            '**So aktivierst du es:**',
            '1. Prüfe, ob die Kategorie **Ticket** gesetzt ist',
            '2. Setze optional in `/setup` eine Ticket Support Rolle',
            '3. Nutze danach `/ticket-panel` in dem Channel, in dem das Ticket-Panel erscheinen soll',
            '4. Nutzer klicken auf den Button und der Bot erstellt Tickets in dieser Kategorie'
          ].join('\n'),
          'Step Mod!Z BOT • Ticket Hilfe'
        )
      ]
    });

    // WHITELIST
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
          '📋 Whitelist',
          [
            'Hier findest du die Hilfe für das Whitelist-System.',
            '',
            '**So aktivierst du es:**',
            '1. Prüfe, ob die Kategorie **Whitelist** gesetzt ist',
            '2. Setze optional in `/setup` eine Review Rolle',
            '3. Setze optional in `/setup` eine Approved Rolle',
            '4. Nutze danach `/whitelist-panel` in dem Channel, in dem das Panel erscheinen soll',
            '5. Nutzer können sich danach direkt bewerben'
          ].join('\n'),
          'Step Mod!Z BOT • Whitelist Hilfe'
        )
      ]
    });

    // VALIDATOR
    const validatorCategory = await ensureCategory(guild, 'Validator');
    const validatorChannel = await ensureTextChannel(guild, 'json-validator', validatorCategory.id);

    await validatorChannel.send({
      embeds: [
        buildInfoEmbed(
          '🧪 Validator',
          [
            'Hier findest du die Hilfe für den JSON / XML / DayZ Validator.',
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

    // Konfiguration speichern
    setGuildConfig(interaction.guild.id, config);

    const embed = new EmbedBuilder()
      .setTitle('⚙️ Step Mod!Z BOT Setup gespeichert')
      .setDescription(
        [
          `Der Bot wurde erfolgreich für **${interaction.guild.name}** eingerichtet.`,
          '',
          'Die Kategorien und Hilfe-Channels wurden vorbereitet.',
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