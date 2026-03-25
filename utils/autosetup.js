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

function infoEmbed(title, description, footer = 'Step Mod!Z BOT • Schnell Einrichtung') {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(0x5865f2)
    .setFooter({ text: footer })
    .setTimestamp();
}

export async function runAutoSetup(guild) {
  const currentConfig = getGuildConfig(guild.id) || {};

  const welcomeCategory = await ensureCategory(guild, 'Welcome');
  const welcomeInfoChannel = await ensureTextChannel(guild, 'welcome-info', welcomeCategory.id);

  await welcomeInfoChannel.send({
    embeds: [
      infoEmbed(
        '👋 Welcome',
        [
          'Hier findest du nur das Wichtigste.',
          '',
          '**So funktioniert es:**',
          '• Der Bot kann Begrüßungen in einen Welcome-Channel senden.',
          '',
          '**Wichtig für dich:**',
          '• Du kannst die Welcome-Nachricht später anpassen.',
          '• Nutze dafür `/setup-welcome`.'
        ].join('\n'),
        'Step Mod!Z BOT • Welcome'
      )
    ]
  });

  const rolesCategory = await ensureCategory(guild, 'Roles');
  const rolesInfoChannel = await ensureTextChannel(guild, 'roles', rolesCategory.id);

  await rolesInfoChannel.send({
    embeds: [
      infoEmbed(
        '🛡️ Roles',
        [
          'Hier findest du nur das Wichtigste.',
          '',
          '**So funktioniert es:**',
          '• Verify ist optional.',
          '• Nutzer können nach Verifizierung eine Rolle bekommen.',
          '',
          '**Wichtig für dich:**',
          '• Wenn du Verify nutzen willst, setze eine Verify Rolle mit `/setup`.',
          '• Danach nutze `/verify-panel`.'
        ].join('\n'),
        'Step Mod!Z BOT • Roles'
      )
    ]
  });

  const ticketCategory = await ensureCategory(guild, 'Ticket');
  const ticketInfoChannel = await ensureTextChannel(guild, 'ticket', ticketCategory.id);

  await ticketInfoChannel.send({
    embeds: [
      infoEmbed(
        '🎫 Ticket',
        [
          'Hier findest du nur das Wichtigste.',
          '',
          '**So funktioniert es:**',
          '• Nutzer können private Support-Tickets öffnen.',
          '',
          '**Wichtig für dich:**',
          '• Standardmäßig kannst du das Panel mit `/ticket-panel` senden.',
          '• Du sollst die Ticket-Nachricht später auch selbst ändern können.',
          '• Geplant ist dafür ein eigener Befehl wie `/ticket-nachricht`.'
        ].join('\n'),
        'Step Mod!Z BOT • Ticket'
      )
    ]
  });

  const whitelistCategory = await ensureCategory(guild, 'Whitelist');
  const whitelistInfoChannel = await ensureTextChannel(guild, 'whitelist', whitelistCategory.id);

  await whitelistInfoChannel.send({
    embeds: [
      infoEmbed(
        '📋 Whitelist',
        [
          'Hier findest du nur das Wichtigste.',
          '',
          '**So funktioniert es:**',
          '• Nutzer können sich für die Whitelist bewerben.',
          '',
          '**Wichtig für dich:**',
          '• Standardmäßig kannst du das Panel mit `/whitelist-panel` senden.',
          '• Du sollst die Whitelist-Nachricht später auch selbst ändern können.',
          '• Das bauen wir danach mit ein.'
        ].join('\n'),
        'Step Mod!Z BOT • Whitelist'
      )
    ]
  });

  const validatorCategory = await ensureCategory(guild, 'Validator');
  const validatorChannel = await ensureTextChannel(guild, 'json-validator', validatorCategory.id);

  await validatorChannel.send({
    embeds: [
      infoEmbed(
        '🧪 Validator',
        [
          'Hier findest du nur das Wichtigste.',
          '',
          '**So funktioniert es:**',
          '• Mit `/validate` prüfst du JSON-, XML- und DayZ-Dateien.',
          '• Der Bot erkennt den Typ automatisch.',
          '',
          '**Wichtig für dich:**',
          '• Lade einfach die Datei hoch und der Bot zeigt Fehler oder Hinweise.'
        ].join('\n'),
        'Step Mod!Z BOT • Validator'
      )
    ]
  });

  const newConfig = {
    ...currentConfig,
    ticketCategoryId: currentConfig.ticketCategoryId || ticketCategory.id,
    whitelistCategoryId: currentConfig.whitelistCategoryId || whitelistCategory.id
  };

  setGuildConfig(guild.id, newConfig);

  return {
    welcomeCategory,
    rolesCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory
  };
}