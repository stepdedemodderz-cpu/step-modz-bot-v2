import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
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

function ownerOnlyOverwrites(ownerId, botId, everyoneId) {
  return [
    {
      id: everyoneId,
      deny: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: botId,
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

function publicVerificationOverwrites(botId, everyoneId) {
  return [
    {
      id: everyoneId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory
      ],
      deny: [PermissionsBitField.Flags.SendMessages]
    },
    {
      id: botId,
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

function verifiedOnlyOverwrites(ownerId, botId, everyoneId, verifyRoleId) {
  return [
    {
      id: everyoneId,
      deny: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: botId,
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
      ]
    }
  ];
}

function botBaseOverwrites(ownerId, botId, everyoneId) {
  return [
    {
      id: everyoneId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory
      ],
      deny: [PermissionsBitField.Flags.SendMessages]
    },
    {
      id: ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: botId,
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

async function clearBotMessages(channel, botUserId) {
  const messages = await channel.messages.fetch({ limit: 25 }).catch(() => null);
  if (!messages) return;

  const botMessages = messages.filter((m) => m.author.id === botUserId);
  for (const [, msg] of botMessages) {
    await msg.delete().catch(() => null);
  }
}

export async function runAutoSetup(guild) {
  const currentConfig = getGuildConfig(guild.id) || {};

  const owner = await guild.fetchOwner();
  const ownerId = owner.id;
  const botId = guild.members.me?.id || guild.client.user.id;
  const everyoneId = guild.roles.everyone.id;

  const verifyRole =
    (currentConfig.verifyRoleId && guild.roles.cache.get(currentConfig.verifyRoleId)) ||
    await ensureRole(guild, 'Verify');

  const unverifyRole =
    (currentConfig.unverifiedRoleId && guild.roles.cache.get(currentConfig.unverifiedRoleId)) ||
    await ensureRole(guild, 'Unverify');

  const verifiedPerms = verifiedOnlyOverwrites(ownerId, botId, everyoneId, verifyRole.id);

  const verificationCategory = await ensureCategory(
    guild,
    'Verification',
    publicVerificationOverwrites(botId, everyoneId)
  );
  const verifiedChannel = await ensureTextChannel(
    guild,
    'verified',
    verificationCategory.id,
    publicVerificationOverwrites(botId, everyoneId)
  );
  const verificationSetupChannel = await ensureTextChannel(
    guild,
    'verification-setup',
    verificationCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId)
  );

  const stepBotCategory = await ensureCategory(
    guild,
    'Step Mod!Z BOT',
    botBaseOverwrites(ownerId, botId, everyoneId)
  );
  const stepBotChannel = await ensureTextChannel(
    guild,
    'step-modz-bot',
    stepBotCategory.id,
    botBaseOverwrites(ownerId, botId, everyoneId)
  );

  const welcomeCategory = await ensureCategory(guild, 'Welcome', verifiedPerms);
  const welcomeChannel = await ensureTextChannel(
    guild,
    'welcome',
    welcomeCategory.id,
    verifiedPerms
  );
  const welcomeInfoChannel = await ensureTextChannel(
    guild,
    'welcome-info',
    welcomeCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId)
  );

  const ticketCategory = await ensureCategory(guild, 'Ticket', verifiedPerms);
  const ticketChannel = await ensureTextChannel(
    guild,
    'ticket',
    ticketCategory.id,
    verifiedPerms
  );
  const ticketInfoChannel = await ensureTextChannel(
    guild,
    'ticket-info',
    ticketCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId)
  );

  const whitelistCategory = await ensureCategory(guild, 'Whitelist', verifiedPerms);
  const whitelistChannel = await ensureTextChannel(
    guild,
    'whitelist',
    whitelistCategory.id,
    verifiedPerms
  );
  const whitelistInfoChannel = await ensureTextChannel(
    guild,
    'whitelist-info',
    whitelistCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId)
  );

  const validatorCategory = await ensureCategory(guild, 'Validator', verifiedPerms);
  const validatorChannel = await ensureTextChannel(
    guild,
    'json-xml-validator',
    validatorCategory.id,
    verifiedPerms
  );
  const validatorInfoChannel = await ensureTextChannel(
    guild,
    'validator-info',
    validatorCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId)
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

  const members = await guild.members.fetch().catch(() => null);
  if (members) {
    for (const [, member] of members) {
      if (member.user.bot) continue;
      if (member.id === ownerId) continue;
      if (member.roles.cache.has(verifyRole.id)) continue;
      if (!member.roles.cache.has(unverifyRole.id)) {
        await member.roles.add(unverifyRole).catch(() => null);
      }
    }
  }

  for (const c of [
    verifiedChannel,
    verificationSetupChannel,
    welcomeChannel,
    welcomeInfoChannel,
    ticketChannel,
    ticketInfoChannel,
    whitelistChannel,
    whitelistInfoChannel,
    validatorChannel,
    validatorInfoChannel
  ]) {
    await clearBotMessages(c, botId);
  }

  await verifiedChannel.send({
    embeds: [buildVerifyEmbed(guild.id)],
    components: [buildVerifyRow()]
  });

  await welcomeChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle('👋 Welcome')
        .setDescription(newConfig.welcomeMessage)
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Welcome' })
        .setTimestamp()
    ]
  });

  await ticketChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle('🎫 Support Tickets')
        .setDescription(newConfig.ticketPanelMessage)
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Ticket Panel' })
        .setTimestamp()
    ],
    components: [buildTicketPanelRow()]
  });

  await whitelistChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle('📋 Whitelist Bewerbung')
        .setDescription(newConfig.whitelistPanelMessage)
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Whitelist Panel' })
        .setTimestamp()
    ],
    components: [buildWhitelistPanelRow()]
  });

  await validatorChannel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle('🧪 Json/XML Validator')
        .setDescription(
          [
            'Nutze `/validate` und lade eine JSON- oder XML-Datei hoch.',
            '',
            'Der Bot erkennt den Typ automatisch und zeigt Fehler oder Hinweise an.'
          ].join('\n')
        )
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Validator' })
        .setTimestamp()
    ]
  });

  await verificationSetupChannel.send(
    [
      '# 🔐 Verification Setup',
      '',
      'Wie funktioniert es? Was musst du machen?',
      '',
      '⚠️ Erstelle in deinen Servereinstellungen zuerst zwei neue Rollen: ⚠️',
      '• ⚠️ Erledigt - Verify wurde von Step erstellt ✅',
      '• ⚠️ Erledigt - Unverify wurde von Step erstellt ✅',
      '',
      '⚠️ WICHTIG: ⚠️',
      '⚠️ Rechtsklick auf alle Kategorien und Kanäle links in der Leiste. ⚠️',
      '',
      '⚠️ Kategorie und Kanäle bearbeiten ⚠️',
      '• ⚠️ WICHTIG: Ändere die Kategorie und den Kanal von Step Mod!Z BOT, in Privat + Rolle Verify Hinzu',
      '• ⚠️ Setze das Häkchen auf Private Kategorie/Kanal',
      '• ⚠️ Füge nun allen Kategorien und Kanälen die Rolle Verify hinzu',
      '• ⚠️ Das muss mit ALLEN Kategorien und Kanälen gemacht werden die NICHT vom Step Bot erstellt wurd',
      '',
      '⚠️ Nach Klick auf Verifizieren werden alle Kategorien und Kanäle angezeigt. ⚠️',
      '',
      '⚠️ Der Bot macht automatisch: ⚠️',
      '• Unverify entfernen ✅',
      '• Verify hinzufügen ✅'
    ].join('\n')
  );

  await welcomeInfoChannel.send(
    [
      '# 👋 Welcome Info',
      '',
      'Die Welcome-Nachricht kann geändert werden mit:',
      '`/welcome-nachricht`',
      '',
      'Danach kannst du mit `/setup-welcome` die aktuelle Welcome-Nachricht erneut senden.'
    ].join('\n')
  );

  await ticketInfoChannel.send(
    [
      '# 🎫 Ticket Info',
      '',
      'Die Ticket-Nachricht kann geändert werden mit:',
      '`/ticket-nachricht`',
      '',
      'Danach kannst du mit `/ticket-panel` das Panel erneut senden.',
      '',
      'Das Ticket-System erstellt private Support-Tickets.'
    ].join('\n')
  );

  await whitelistInfoChannel.send(
    [
      '# 📋 Whitelist Info',
      '',
      'Die Whitelist-Nachricht kann geändert werden mit:',
      '`/whitelist-nachricht`',
      '',
      'Danach kannst du mit `/whitelist-panel` das Panel erneut senden.',
      '',
      'Das Whitelist-System erstellt Bewerbungs-Channels für DayZ.'
    ].join('\n')
  );

  await validatorInfoChannel.send(
    [
      '# 🧪 Validator Info',
      '',
      'Mit `/validate` kannst du JSON-, XML- und DayZ-Dateien prüfen.',
      '',
      'Der öffentliche Channel `json-xml-validator` ist direkt einsatzbereit.'
    ].join('\n')
  );

  return {
    stepBotCategory,
    verificationCategory,
    welcomeCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory
  };
}