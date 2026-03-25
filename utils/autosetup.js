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

function publicVerificationOverwrites(guild) {
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

  const verifyRole =
    (currentConfig.verifyRoleId && guild.roles.cache.get(currentConfig.verifyRoleId)) ||
    await ensureRole(guild, 'Verify');

  const unverifyRole =
    (currentConfig.unverifiedRoleId && guild.roles.cache.get(currentConfig.unverifiedRoleId)) ||
    await ensureRole(guild, 'Unverify');

  const verifiedPerms = verifiedOnlyOverwrites(guild, verifyRole.id);

  // Kategorien + Channels
  const verificationCategory = await ensureCategory(
    guild,
    'Verification',
    publicVerificationOverwrites(guild)
  );
  const verifiedChannel = await ensureTextChannel(
    guild,
    'verified',
    verificationCategory.id,
    publicVerificationOverwrites(guild)
  );
  const verificationSetupChannel = await ensureTextChannel(
    guild,
    'verification-setup',
    verificationCategory.id,
    ownerOnlyOverwrites(guild)
  );

  const stepBotCategory = await ensureCategory(guild, 'Step Mod!Z BOT', verifiedPerms);
  const stepBotChannel = await ensureTextChannel(
    guild,
    'step-modz-bot',
    stepBotCategory.id,
    verifiedPerms
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
    ownerOnlyOverwrites(guild)
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
    ownerOnlyOverwrites(guild)
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
    ownerOnlyOverwrites(guild)
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

  // Bestehende Mitglieder anpassen
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

  // Alte Bot-Nachrichten entfernen
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
    await clearBotMessages(c, guild.client.user.id);
  }

  // Öffentliche Funktions-Channels
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

  // Private Info-Channels nur für Owner
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