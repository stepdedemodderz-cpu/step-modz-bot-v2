import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} from 'discord.js';
import { getGuildConfig, setGuildConfig } from './config.js';
import { buildTicketPanelRow } from './tickets.js';
import { buildWhitelistPanelRow } from './whitelist.js';
import { buildVerifyEmbed, buildVerifyRow } from './verify.js';
import { buildRulesIntroEmbed, buildRulesButtons } from './rules.js';

const NAMES = {
  stepBotCategory: '🤖 𝕊𝕥𝕖𝕡 𝕄𝕠𝕕ℤ 𝔹𝕆𝕋',
  stepBotChannel: '🤖 𝕊𝕥𝕖𝕡𝕄𝕠𝕕ℤ𝔹𝕆𝕋',

  verificationCategory: '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕔𝕒𝕥𝕚𝕠𝕟',
  verifiedChannel: '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕖𝕕',
  verificationSetupChannel: 'verification-setup',

  welcomeCategory: '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖',
  welcomeChannel: '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖',
  welcomeInfoChannel: 'welcome-info',

  ticketCategory: '🎫 𝕋𝕚𝕔𝕜𝕖𝕥',
  ticketChannel: '🎫 𝕋𝕚𝕔𝕜𝕖𝕥',
  ticketInfoChannel: 'ticket-info',

  whitelistCategory: '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥',
  whitelistChannel: '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥',
  whitelistInfoChannel: 'whitelist-info',

  validatorCategory: '🧬 𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣',
  validatorChannel: '🧬 𝕁𝕤𝕠𝕟-𝕏𝕞𝕝-𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣',
  validatorInfoChannel: 'validator-info'
};

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
    await category.edit({ name, permissionOverwrites: overwrites }).catch(() => null);
  }

  return category;
}

async function ensureTextChannel(guild, name, parentId, overwrites, aliases = []) {
  let channel = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      (c.name === name || aliases.includes(c.name)) &&
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
      name,
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

  const rulesAcceptedRole =
    (currentConfig.rulesAcceptedRoleId && guild.roles.cache.get(currentConfig.rulesAcceptedRoleId)) ||
    await ensureRole(guild, 'RulesAccepted');

  const verifyRole =
    (currentConfig.verifyRoleId && guild.roles.cache.get(currentConfig.verifyRoleId)) ||
    await ensureRole(guild, 'Verify');

  const unverifyRole =
    (currentConfig.unverifiedRoleId && guild.roles.cache.get(currentConfig.unverifiedRoleId)) ||
    await ensureRole(guild, 'Unverify');

  const verifiedPerms = verifiedOnlyOverwrites(ownerId, botId, everyoneId, verifyRole.id);

  const verificationCategory = await ensureCategory(
    guild,
    NAMES.verificationCategory,
    publicVerificationOverwrites(botId, everyoneId)
  );
  const verifiedChannel = await ensureTextChannel(
    guild,
    NAMES.verifiedChannel,
    verificationCategory.id,
    publicVerificationOverwrites(botId, everyoneId),
    ['verified', '✅ Verified', '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕖𝕕']
  );
  const verificationSetupChannel = await ensureTextChannel(
    guild,
    NAMES.verificationSetupChannel,
    verificationCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['verification-setup']
  );


  const welcomeCategory = await ensureCategory(guild, NAMES.welcomeCategory, verifiedPerms);
  const welcomeChannel = await ensureTextChannel(
    guild,
    NAMES.welcomeChannel,
    welcomeCategory.id,
    verifiedPerms,
    ['welcome', '👋🏻 Welcome', '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖']
  );
  const welcomeInfoChannel = await ensureTextChannel(
    guild,
    NAMES.welcomeInfoChannel,
    welcomeCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['welcome-info']
  );

  const ticketCategory = await ensureCategory(guild, NAMES.ticketCategory, verifiedPerms);
  const ticketChannel = await ensureTextChannel(
    guild,
    NAMES.ticketChannel,
    ticketCategory.id,
    verifiedPerms,
    ['ticket', '🎫 Ticket', '🎫 𝕋𝕚𝕔𝕜𝕖𝕥']
  );
  const ticketInfoChannel = await ensureTextChannel(
    guild,
    NAMES.ticketInfoChannel,
    ticketCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['ticket-info']
  );

  const whitelistCategory = await ensureCategory(guild, NAMES.whitelistCategory, verifiedPerms);
  const whitelistChannel = await ensureTextChannel(
    guild,
    NAMES.whitelistChannel,
    whitelistCategory.id,
    verifiedPerms,
    ['whitelist', '🛡️ Whitelist', '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥']
  );
  const whitelistInfoChannel = await ensureTextChannel(
    guild,
    NAMES.whitelistInfoChannel,
    whitelistCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['whitelist-info']
  );

  const validatorCategory = await ensureCategory(guild, NAMES.validatorCategory, verifiedPerms);
  const validatorChannel = await ensureTextChannel(
    guild,
    NAMES.validatorChannel,
    validatorCategory.id,
    verifiedPerms,
    ['json-xml-validator', '🧬 Json-Xml-Validator', '🧬 𝕁𝕤𝕠𝕟-𝕏𝕞𝕝-𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣']
  );
  const validatorInfoChannel = await ensureTextChannel(
    guild,
    NAMES.validatorInfoChannel,
    validatorCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['validator-info']
  );

  const newConfig = {
    ...currentConfig,
    rulesAcceptedRoleId: rulesAcceptedRole.id,
    verifyRoleId: verifyRole.id,
    unverifiedRoleId: unverifyRole.id,
    welcomeChannelId: currentConfig.welcomeChannelId || welcomeChannel.id,
    ticketCategoryId: currentConfig.ticketCategoryId || ticketCategory.id,
    whitelistCategoryId: currentConfig.whitelistCategoryId || whitelistCategory.id,
    ticketPanelMessage: currentConfig.ticketPanelMessage || DEFAULT_TICKET_MESSAGE,
    whitelistPanelMessage: currentConfig.whitelistPanelMessage || DEFAULT_WHITELIST_MESSAGE,
    welcomeMessage: currentConfig.welcomeMessage || DEFAULT_WELCOME_MESSAGE,
    validatorChannelId: validatorChannel.id
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
    embeds: [buildRulesIntroEmbed()],
    components: buildRulesButtons()
  });

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
      '• ⚠️ Diesen Kanal so lassen wie er ist, NICHT BEARBEITEN!',
      '',
      '• Verify, Unverify und RulesAccepted wurden automatisch erstellt.',
      '• Eigene Server-Kategorien und Kanäle bitte privat setzen und die Rolle Verify hinzufügen.',
      '• Auch die Step Mod!Z BOT Kategorie und der Kanal sollten privat + Verify gesetzt werden, wenn du sie nur Verifizierten zeigen willst.',
      '',
      'Der Bot macht automatisch:',
      '• RulesAccepted hinzufügen nach Regelbestätigung ✅',
      '• Unverify entfernen ✅',
      '• Verify hinzufügen ✅',
      '• RulesAccepted wieder entfernen ✅'
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
      'Danach kannst du mit `/ticket-panel` das Panel erneut senden.'
    ].join('\n')
  );

  await whitelistInfoChannel.send(
    [
      '# 📋 Whitelist Info',
      '',
      'Die Whitelist-Nachricht kann geändert werden mit:',
      '`/whitelist-nachricht`',
      '',
      'Danach kannst du mit `/whitelist-panel` das Panel erneut senden.'
    ].join('\n')
  );

  await validatorInfoChannel.send(
    [
      '# 🧪 Validator Info',
      '',
      'Mit `/validate` kannst du JSON-, XML- und DayZ-Dateien prüfen.',
      '',
      'Der öffentliche Channel ist direkt einsatzbereit.'
    ].join('\n')
  );

  return {
    verificationCategory,
    welcomeCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory
  };
}