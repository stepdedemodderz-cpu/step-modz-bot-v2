import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} from 'discord.js';
import { getGuildConfig, setGuildConfig } from './config.js';

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

function buildInfoEmbed(title, description, footer = 'Step Mod!Z BOT • Schnell Einrichtung') {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x5865f2)
    .setFooter({ text: footer })
    .setTimestamp();
}

export async function runAutoSetup(guild) {
  const currentConfig = getGuildConfig(guild.id) || {};

  // Welcome
  const welcomeCategory = await ensureCategory(guild, 'Welcome');
  const welcomeChannel = await ensureTextChannel(guild, 'welcome', welcomeCategory.id);
  const welcomeInfoChannel = await ensureTextChannel(guild, 'welcome-info', welcomeCategory.id);

  await welcomeInfoChannel.send({
    embeds: [
      buildInfoEmbed(
        '👋 Welcome',
        [
          'Dieses System wurde automatisch vorbereitet.',
          '',
          '**So nutzt du es:**',
          '1. Nutze `/setup-welcome`',
          '2. Der Bot sendet die Welcome-Nachricht',
          '3. Neue Mitglieder werden dann dort begrüßt'
        ].join('\n'),
        'Step Mod!Z BOT • Welcome Hilfe'
      )
    ]
  });

  // Roles
  const rolesCategory = await ensureCategory(guild, 'Roles');
  const rolesInfoChannel = await ensureTextChannel(guild, 'roles-info', rolesCategory.id);

  await rolesInfoChannel.send({
    embeds: [
      buildInfoEmbed(
        '🛡️ Roles',
        [
          'Dieses System wurde automatisch vorbereitet.',
          '',
          '**Wichtig:**',
          'Verify ist optional.',
          '',
          '**Wenn du Verify nutzen willst:**',
          '1. Nutze `/setup` und setze optional eine Verify Rolle',
          '2. Nutze danach `/verify-panel`',
          '3. Nutzer klicken auf den Verify Button'
        ].join('\n'),
        'Step Mod!Z BOT • Roles Hilfe'
      )
    ]
  });

  // Ticket
  const ticketCategory = await ensureCategory(guild, 'Ticket');
  const ticketInfoChannel = await ensureTextChannel(guild, 'ticket-info', ticketCategory.id);

  await ticketInfoChannel.send({
    embeds: [
      buildInfoEmbed(
        '🎫 Ticket',
        [
          'Das Ticket-System wurde automatisch vorbereitet.',
          '',
          '**So aktivierst du es:**',
          '1. Optional in `/setup` eine Ticket Support Rolle setzen',
          '2. Nutze `/ticket-panel` in dem Channel, in dem dein Ticket-Panel erscheinen soll',
          '3. Nutzer klicken auf den Button',
          '4. Tickets werden in dieser Kategorie erstellt'
        ].join('\n'),
        'Step Mod!Z BOT • Ticket Hilfe'
      )
    ]
  });

  // Whitelist
  const whitelistCategory = await ensureCategory(guild, 'Whitelist');
  const whitelistInfoChannel = await ensureTextChannel(guild, 'whitelist-info', whitelistCategory.id);

  await whitelistInfoChannel.send({
    embeds: [
      buildInfoEmbed(
        '📋 Whitelist',
        [
          'Das Whitelist-System wurde automatisch vorbereitet.',
          '',
          '**So aktivierst du es:**',
          '1. Optional in `/setup` eine Review Rolle setzen',
          '2. Optional in `/setup` eine Approved Rolle setzen',
          '3. Nutze `/whitelist-panel` in dem Channel, in dem dein Panel erscheinen soll',
          '4. Nutzer können sich danach direkt bewerben'
        ].join('\n'),
        'Step Mod!Z BOT • Whitelist Hilfe'
      )
    ]
  });

  // Validator
  const validatorCategory = await ensureCategory(guild, 'Validator');
  const validatorChannel = await ensureTextChannel(guild, 'json-validator', validatorCategory.id);

  await validatorChannel.send({
    embeds: [
      buildInfoEmbed(
        '🧪 Validator',
        [
          'Der Validator wurde automatisch vorbereitet.',
          '',
          '**So nutzt du ihn:**',
          '1. Nutze `/validate`',
          '2. Lade eine JSON- oder XML-Datei hoch',
          '3. Der Bot erkennt den Typ automatisch',
          '4. Du bekommst Fehler, Hinweise und DayZ-Sonderprüfungen'
        ].join('\n'),
        'Step Mod!Z BOT • Validator Hilfe'
      )
    ]
  });

  const newConfig = {
    ...currentConfig,
    welcomeChannelId: currentConfig.welcomeChannelId || welcomeChannel.id,
    ticketCategoryId: currentConfig.ticketCategoryId || ticketCategory.id,
    whitelistCategoryId: currentConfig.whitelistCategoryId || whitelistCategory.id
  };

  setGuildConfig(guild.id, newConfig);

  return {
    welcomeCategory,
    rolesCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory,
    welcomeChannel,
    welcomeInfoChannel,
    rolesInfoChannel,
    ticketInfoChannel,
    whitelistInfoChannel,
    validatorChannel
  };
}