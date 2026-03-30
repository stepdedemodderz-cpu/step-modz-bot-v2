import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} from 'discord.js';
import { getGuildConfig, setGuildConfig } from './config.js';
import { buildTicketPanelRow } from './tickets.js';
import { buildWhitelistPanelRow } from './whitelist.js';
import { buildVerifyEmbed, buildVerifyRow } from './verify.js';
import { buildRulesIntroEmbed, buildLanguageButtons } from './rules.js';

const TOOL_MIGRATIONS = [
  {
    id: 'server-status-v1',
    label: 'Server Status System',
    run: async ({
      guild,
      ownerId,
      botId,
      everyoneId,
      ensureCategory,
      ensureTextChannel,
      ownerOnlyOverwrites
    }) => {
      const created = [];

      const categoryResult = await ensureCategory(
        guild,
        '🖥️ Server',
        ownerOnlyOverwrites(ownerId, botId, everyoneId),
        ['Server']
      );

      if (categoryResult.created) {
        created.push('🖥️ Server Kategorie');
      }

      const category = categoryResult.channel;

      const statusResult = await ensureTextChannel(
        guild,
        '📡 server-status',
        category.id,
        ownerOnlyOverwrites(ownerId, botId, everyoneId),
        ['server-status']
      );

      if (statusResult.created) {
        created.push('📡 server-status Kanal');

        await statusResult.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('🧟 Server Status')
              .setDescription(
                '⚙️ Server Status System wurde installiert.\n\n' +
                'Nutze den Command:\n' +
                '`/server-status-setup`'
              )
              .setColor(0x22c55e)
          ]
        });
      }

      const infoResult = await ensureTextChannel(
        guild,
        'server-info',
        category.id,
        ownerOnlyOverwrites(ownerId, botId, everyoneId),
        ['server-info']
      );

      if (infoResult.created) {
  created.push('server-info Kanal');

  await infoResult.channel.send(
    [
      '# 🖥️ Server Status Info',
      '',
      'Mit diesem System kannst du deinen DayZ Server Status im Discord anzeigen lassen.',
      '',
      'Angezeigt werden später zum Beispiel:',
      '• Server Online / Offline',
      '• Spieleranzahl',
      '• Server Status im Discord',
      '',
      '## Einrichtung',
      '',
      'Nutze den Befehl:',
      '`/server-status-setup`',
      '',
      'Danach musst du eingeben:',
      '• `ip` = deine Server-IP',
      '• `port` = dein Server-Port',
      '',
      '## Wo finde ich IP und Port bei Nitrado?',
      '',
      '1. Logge dich bei Nitrado ein',
      '2. Öffne „Meine Dienste / My Services“',
      '3. Wähle deinen DayZ Server aus',
      '4. Öffne das Webinterface',
      '5. Schau im Dashboard nach deiner Server-IP und dem Port',
      '',
      '## Wichtig',
      '',
      '• Für eine direkte Serververbindung wird meistens der Game Port verwendet',
      '• Für Steam / Favoriten wird oft der Query Port verwendet',
      '• Wenn du unsicher bist, prüfe zuerst die Angaben im Nitrado Dashboard',
      '',
      '⚠️ Für dieses System wird kein Nitrado Token benötigt.'
    ].join('\n')
  );
}

      return created;
    }
  }
];

function ownerOnlyOverwrites(ownerId, botId, everyoneId) {
  return [
    { id: everyoneId, deny: [PermissionsBitField.Flags.ViewChannel] },
    {
      id: ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages
      ]
    },
    {
      id: botId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ManageChannels
      ]
    }
  ];
}

async function ensureCategory(guild, name, overwrites, aliases = []) {
  await guild.channels.fetch();

  let category = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildCategory &&
      (c.name === name || aliases.includes(c.name))
  );

  if (category) return { channel: category, created: false };

  category = await guild.channels.create({
    name,
    type: ChannelType.GuildCategory,
    permissionOverwrites: overwrites
  });

  return { channel: category, created: true };
}

async function ensureTextChannel(guild, name, parentId, overwrites, aliases = []) {
  await guild.channels.fetch();

  let channel = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      (c.name === name || aliases.includes(c.name))
  );

  if (channel) return { channel, created: false };

  channel = await guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: parentId,
    permissionOverwrites: overwrites
  });

  return { channel, created: true };
}

async function runUpdateOnly(guild, currentConfig) {
  const owner = await guild.fetchOwner();
  const ownerId = owner.id;
  const botId = guild.members.me.id;
  const everyoneId = guild.roles.everyone.id;

  const installed = currentConfig.installedToolMigrations || [];

  const createdList = [];
  const newInstalled = [...installed];

  for (const tool of TOOL_MIGRATIONS) {
    if (installed.includes(tool.id)) continue;

    const result = await tool.run({
      guild,
      ownerId,
      botId,
      everyoneId,
      ensureCategory,
      ensureTextChannel,
      ownerOnlyOverwrites
    });

    newInstalled.push(tool.id);

    if (result.length > 0) {
      createdList.push(...result);
    }
  }

  setGuildConfig(guild.id, {
    ...currentConfig,
    installedToolMigrations: newInstalled
  });

  return {
    createdAnything: createdList.length > 0,
    createdList
  };
}

export async function runAutoSetup(guild, options = {}) {
  const mode = options.mode || 'full';
  const currentConfig = getGuildConfig(guild.id) || {};

  if (mode === 'update') {
    return await runUpdateOnly(guild, currentConfig);
  }

  return {
    createdAnything: false,
    createdList: []
  };
}