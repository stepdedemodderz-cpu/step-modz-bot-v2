import {
  ChannelType,
  PermissionsBitField
} from 'discord.js';
import { getGuildConfig, setGuildConfig } from './config.js';
import { buildTicketPanelRow } from './tickets.js';
import { buildWhitelistPanelRow } from './whitelist.js';
import { buildVerifyEmbed, buildVerifyRow } from './verify.js';

const DEFAULT_TICKET_MESSAGE = [
  'Benötigst du Hilfe von einem Admin oder Moderator?',
  '',
  'Klicke auf den Button unten, um ein privates Ticket zu öffnen.'
].join('\n');

const DEFAULT_WHITELIST_MESSAGE = [
  'Du möchtest dich für die Whitelist bewerben?',
  '',
  'Klicke auf den Button unten und fülle das Formular aus.'
].join('\n');

const DEFAULT_WELCOME_MESSAGE = [
  'Willkommen auf dem Server 👋',
  '',
  'Wir wünschen dir viel Spaß.'
].join('\n');

function ownerOnlyOverwrites(guild) {
  return [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: guild.ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: guild.client.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageMessages
      ]
    }
  ];
}

function verificationPublicOverwrites(guild) {
  return [
    {
      id: guild.roles.everyone.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory
      ],
      deny: [PermissionsBitField.Flags.SendMessages]
    },
    {
      id: guild.client.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageMessages
      ]
    }
  ];
}

function verifiedOnlyOverwrites(guild, verifyRoleId) {
  return [
    {
      id: guild.roles.everyone.id,
      deny: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: guild.ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: guild.client.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageMessages
      ]
    },
    {
      id: verifyRoleId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory
      ],
      deny: [PermissionsBitField.Flags.SendMessages]
    }
  ];
}

async function ensureCategory(guild, name, overwrites) {
  let category = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name === name
  );

  if (!category) {
    category = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: overwrites
    });
  } else {
    await category.edit({ permissionOverwrites: overwrites }).catch(() => null);
  }

  return category;
}

async function ensureTextChannel(guild, name, parentId, overwrites) {
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
      permissionOverwrites: overwrites
    });
  } else {
    await channel.edit({
      parent: parentId,
      permissionOverwrites: overwrites
    }).catch(() => null);
  }

  return channel;
}

async function ensureRole(guild, name, color = null) {
  let role = guild.roles.cache.find((r) => r.name === name);

  if (!role) {
    role = await guild.roles.create({
      name,
      color: color || undefined,
      reason: 'Step Mod!Z BOT Schnell Einrichtung'
    });
  }

  return role;
}

export async function runAutoSetup(guild) {
  const currentConfig = getGuildConfig(guild.id) || {};

  const verifyRole =
    (currentConfig.verifyRoleId && guild.roles.cache.get(currentConfig.verifyRoleId)) ||
    await ensureRole(guild, 'Verify');

  const unverifyRole =
    (currentConfig.unverifiedRoleId && guild.roles.cache.get(currentConfig.unverifiedRoleId)) ||
    await ensureRole(guild, 'Unverify');

  const verifiedOverwrites = verifiedOnlyOverwrites(guild, verifyRole.id);

  // Nur Verifizierte
  const welcomeCategory = await ensureCategory(guild, 'Welcome', verifiedOverwrites);
  const welcomeChannel = await ensureTextChannel(
    guild,
    'welcome',
    welcomeCategory.id,
    verifiedOverwrites
  );

  const ticketCategory = await ensureCategory(guild, 'Ticket', verifiedOverwrites);
  const ticketChannel = await ensureTextChannel(
    guild,
    'ticket',
    ticketCategory.id,
    verifiedOverwrites
  );

  const whitelistCategory = await ensureCategory(guild, 'Whitelist', verifiedOverwrites);
  const whitelistChannel = await ensureTextChannel(
    guild,
    'whitelist',
    whitelistCategory.id,
    verifiedOverwrites
  );

  const validatorCategory = await ensureCategory(guild, 'Validator', verifiedOverwrites);
  const validatorChannel = await ensureTextChannel(
    guild,
    'json-xml-validator',
    validatorCategory.id,
    verifiedOverwrites
  );

  const botCategory = await ensureCategory(
    guild,
    'Step Mod!Z BOT',
    verifiedOverwrites
  );

  const botChannel = await ensureTextChannel(
    guild,
    'step-modz-bot',
    botCategory.id,
    verifiedOverwrites
  );

  // Für alle sichtbar
  const verificationCategory = await ensureCategory(
    guild,
    'Verification',
    verificationPublicOverwrites(guild)
  );

  const verificationChannel = await ensureTextChannel(
    guild,
    'verified',
    verificationCategory.id,
    verificationPublicOverwrites(guild)
  );

  // Nur Owner
  const verificationSetupChannel = await ensureTextChannel(
    guild,
    'verification-setup',
    verificationCategory.id,
    ownerOnlyOverwrites(guild)
  );

  const newConfig = {
    ...currentConfig,
    verifyRoleId: verifyRole.id,
    unverifiedRoleId: unverifyRole.id,
    welcomeChannelId: currentConfig.welcomeChannelId || welcomeChannel.id,
    ticketCategoryId: currentConfig.ticketCategoryId || ticketCategory.id,
    whitelistCategoryId: currentConfig.whitelistCategoryId || whitelistCategory.id,
    ticketPanelMessage: currentConfig.ticketPanelMessage || DEFAULT_TICKET_MESSAGE,
    whitelistPanelMessage: currentConfig.whitelistPanelMessage || DEFAULT_WHITELIST_MESSAGE,
    welcomeMessage: currentConfig.welcomeMessage || DEFAULT_WELCOME_MESSAGE
  };

  setGuildConfig(guild.id, newConfig);

  // Bestehende Member: Unverify setzen, außer Owner/Bots/Verifizierte
  const members = await guild.members.fetch().catch(() => null);
  if (members) {
    for (const [, member] of members) {
      if (member.user.bot) continue;
      if (member.id === guild.ownerId) continue;
      if (member.roles.cache.has(verifyRole.id)) continue;
      if (!member.roles.cache.has(unverifyRole.id)) {
        await member.roles.add(unverifyRole).catch(() => null);
      }
    }
  }

  await welcomeChannel.send(
    [
      '# 👋 Welcome',
      '',
      'Hier steht nur das Wichtigste.',
      '',
      'Die aktuelle Welcome-Nachricht kann geändert werden mit:',
      '`/welcome-nachricht`',
      '',
      'Danach kannst du mit `/setup-welcome` die aktuelle Welcome-Nachricht erneut senden.'
    ].join('\n')
  );

  await verificationChannel.send({
    embeds: [buildVerifyEmbed(guild.id)],
    components: [buildVerifyRow()]
  });

  await verificationSetupChannel.send(
    [
      '# 🔐 Verification Setup',
      '',
      'Wie funktioniert es? Was musst du machen?',
      '',
      'Erstelle in deinen Servereinstellungen zuerst zwei neue Rollen:',
      '• Verify',
      '• Unverify',
      '',
      'Danach jede Kategorie und jeden Kanal bearbeiten.',
      'Rechtsklick auf alle Kategorien und Kanäle links in der Leiste.',
      '',
      'Kategorie und oder Kanäle bearbeiten',
      '• Setze das Häkchen auf Private Kategorie/Kanal',
      '• Füge nun allen Kategorien und Kanälen die Rolle Verify hinzu',
      '',
      'WICHTIG:',
      '• Dem Kanal `verified` die Rolle Unverify hinzufügen',
      '',
      'Nach Klick auf Verifizieren werden alle Kategorien und Kanäle angezeigt.',
      '',
      'Der Bot macht automatisch:',
      '• Unverify entfernen',
      '• Verify hinzufügen'
    ].join('\n')
  );

  await ticketChannel.send({
    content: [
      '# 🎫 Ticket',
      '',
      'Hier steht nur das Wichtigste.',
      '',
      'Die Ticket-Nachricht kann geändert werden mit:',
      '`/ticket-nachricht`',
      '',
      'Danach kannst du mit `/ticket-panel` das Panel erneut senden.',
      '',
      'Das Ticket-System erstellt private Support-Tickets.'
    ].join('\n'),
    components: [buildTicketPanelRow()]
  });

  await whitelistChannel.send({
    content: [
      '# 📋 Whitelist',
      '',
      'Hier steht nur das Wichtigste.',
      '',
      'Die Whitelist-Nachricht kann geändert werden mit:',
      '`/whitelist-nachricht`',
      '',
      'Danach kannst du mit `/whitelist-panel` das Panel erneut senden.',
      '',
      'Das Whitelist-System erstellt Bewerbungs-Channels für DayZ.'
    ].join('\n'),
    components: [buildWhitelistPanelRow()]
  });

  await validatorChannel.send(
    [
      '# 🧪 Json/XML Validator',
      '',
      'Hier steht nur das Wichtigste.',
      '',
      'Nutze `/validate` und lade eine JSON- oder XML-Datei hoch.',
      'Der Bot erkennt den Typ automatisch und zeigt Fehler oder Hinweise an.'
    ].join('\n')
  );

  return {
    welcomeCategory,
    verificationCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory,
    botCategory,
    botChannel
  };
}