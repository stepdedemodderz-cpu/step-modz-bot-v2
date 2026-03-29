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

const NAMES = {
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

const SETUP_KEYS = {
  verificationCategory: 'verification.category',
  verifiedChannel: 'verification.verified_channel',
  verificationSetupChannel: 'verification.setup_channel',

  welcomeCategory: 'welcome.category',
  welcomeChannel: 'welcome.channel',
  welcomeInfoChannel: 'welcome.info_channel',

  ticketCategory: 'ticket.category',
  ticketChannel: 'ticket.channel',
  ticketInfoChannel: 'ticket.info_channel',

  whitelistCategory: 'whitelist.category',
  whitelistChannel: 'whitelist.channel',
  whitelistInfoChannel: 'whitelist.info_channel',

  validatorCategory: 'validator.category',
  validatorChannel: 'validator.channel',
  validatorInfoChannel: 'validator.info_channel'
};

const BASELINE_SETUP_KEYS = Object.values(SETUP_KEYS);

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

function channelNameMatches(channel, name, aliases = []) {
  return channel.name === name || aliases.includes(channel.name);
}

function getCreatedSetupKeys(config = {}) {
  return new Set(Array.isArray(config.createdSetupKeys) ? config.createdSetupKeys : []);
}

function seedBaselineIfNeeded(config, mode) {
  if (mode !== 'update') {
    return Array.isArray(config.createdSetupKeys) ? config.createdSetupKeys : [];
  }

  if (Array.isArray(config.createdSetupKeys)) {
    return config.createdSetupKeys;
  }

  return [...BASELINE_SETUP_KEYS];
}

function findCategory(guild, name, aliases = []) {
  return guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildCategory &&
      channelNameMatches(c, name, aliases)
  ) || null;
}

function findTextChannel(guild, name, aliases = [], parentId = null) {
  let channel = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      channelNameMatches(c, name, aliases) &&
      (parentId ? c.parentId === parentId : true)
  );

  if (!channel) {
    channel = guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildText &&
        channelNameMatches(c, name, aliases)
    );
  }

  return channel || null;
}

async function ensureCategory(guild, config, setupKey, name, overwrites, aliases = [], options = {}) {
  const { mode = 'full', updatePermissionsIfFound = false } = options;
  const createdKeys = getCreatedSetupKeys(config);

  const existing = findCategory(guild, name, aliases);

  if (mode === 'update' && createdKeys.has(setupKey)) {
    return { channel: existing, created: false };
  }

  if (existing) {
    createdKeys.add(setupKey);
    config.createdSetupKeys = Array.from(createdKeys);

    if (mode === 'full' && updatePermissionsIfFound) {
      await existing.permissionOverwrites.set(overwrites).catch(() => null);
    }

    return { channel: existing, created: false };
  }

  const category = await guild.channels.create({
    name,
    type: ChannelType.GuildCategory,
    permissionOverwrites: overwrites
  });

  createdKeys.add(setupKey);
  config.createdSetupKeys = Array.from(createdKeys);

  return { channel: category, created: true };
}

async function ensureTextChannel(guild, config, setupKey, name, parentId, overwrites, aliases = [], options = {}) {
  const {
    mode = 'full',
    moveToParentIfFound = false,
    updatePermissionsIfFound = false
  } = options;

  const createdKeys = getCreatedSetupKeys(config);
  const existing = findTextChannel(guild, name, aliases, parentId);

  if (mode === 'update' && createdKeys.has(setupKey)) {
    return { channel: existing, created: false, moved: false };
  }

  if (existing) {
    createdKeys.add(setupKey);
    config.createdSetupKeys = Array.from(createdKeys);

    let moved = false;

    if (mode === 'full' && moveToParentIfFound && existing.parentId !== parentId) {
      await existing.setParent(parentId).catch(() => null);
      moved = true;
    }

    if (mode === 'full' && updatePermissionsIfFound) {
      await existing.permissionOverwrites.set(overwrites).catch(() => null);
    }

    return { channel: existing, created: false, moved };
  }

  const channel = await guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: parentId,
    permissionOverwrites: overwrites
  });

  createdKeys.add(setupKey);
  config.createdSetupKeys = Array.from(createdKeys);

  return { channel, created: true, moved: false };
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

async function postVerificationPanels(verifiedChannel, guildId, mode, botId) {
  if (mode === 'full') {
    await clearBotMessages(verifiedChannel, botId);
  }

  await verifiedChannel.send({
    embeds: [buildRulesIntroEmbed()],
    components: buildLanguageButtons()
  });

  await verifiedChannel.send({
    embeds: [buildVerifyEmbed(guildId)],
    components: [buildVerifyRow()]
  });
}

async function postWelcomePanel(channel, message) {
  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle('👋 Welcome')
        .setDescription(message)
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Welcome' })
        .setTimestamp()
    ]
  });
}

async function postTicketPanel(channel, message) {
  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle('🎫 Support Tickets')
        .setDescription(message)
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Ticket Panel' })
        .setTimestamp()
    ],
    components: [buildTicketPanelRow()]
  });
}

async function postWhitelistPanel(channel, message) {
  await channel.send({
    embeds: [
      new EmbedBuilder()
        .setTitle('📋 Whitelist Bewerbung')
        .setDescription(message)
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Whitelist Panel' })
        .setTimestamp()
    ],
    components: [buildWhitelistPanelRow()]
  });
}

async function postValidatorPanel(channel) {
  await channel.send({
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
}

export async function runAutoSetup(guild, options = {}) {
  const mode = options.mode === 'update' ? 'update' : 'full';
  const currentConfig = getGuildConfig(guild.id) || {};
  const workingConfig = {
    ...currentConfig,
    createdSetupKeys: seedBaselineIfNeeded(currentConfig, mode)
  };

  const owner = await guild.fetchOwner();
  const ownerId = owner.id;
  const botId = guild.members.me?.id || guild.client.user.id;
  const everyoneId = guild.roles.everyone.id;

  const rulesAcceptedRole =
    (workingConfig.rulesAcceptedRoleId && guild.roles.cache.get(workingConfig.rulesAcceptedRoleId)) ||
    await ensureRole(guild, 'RulesAccepted');

  const verifyRole =
    (workingConfig.verifyRoleId && guild.roles.cache.get(workingConfig.verifyRoleId)) ||
    await ensureRole(guild, 'Verify');

  const unverifyRole =
    (workingConfig.unverifiedRoleId && guild.roles.cache.get(workingConfig.unverifiedRoleId)) ||
    await ensureRole(guild, 'Unverify');

  const verifiedPerms = verifiedOnlyOverwrites(ownerId, botId, everyoneId, verifyRole.id);

  const categoryOptions = {
    mode,
    updatePermissionsIfFound: mode === 'full'
  };

  const channelOptions = {
    mode,
    moveToParentIfFound: mode === 'full',
    updatePermissionsIfFound: mode === 'full'
  };

  const verificationCategoryResult = await ensureCategory(
    guild,
    workingConfig,
    SETUP_KEYS.verificationCategory,
    NAMES.verificationCategory,
    publicVerificationOverwrites(botId, everyoneId),
    ['Verification', '✅ Verification', '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕔𝕒𝕥𝕚𝕠𝕟'],
    categoryOptions
  );
  const verificationCategory = verificationCategoryResult.channel;

  const verifiedResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.verifiedChannel,
    NAMES.verifiedChannel,
    verificationCategory?.id || null,
    publicVerificationOverwrites(botId, everyoneId),
    ['verified', '✅ Verified', '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕖𝕕'],
    channelOptions
  );
  const verifiedChannel = verifiedResult.channel;

  const verificationSetupResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.verificationSetupChannel,
    NAMES.verificationSetupChannel,
    verificationCategory?.id || null,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['verification-setup'],
    channelOptions
  );
  const verificationSetupChannel = verificationSetupResult.channel;

  const welcomeCategoryResult = await ensureCategory(
    guild,
    workingConfig,
    SETUP_KEYS.welcomeCategory,
    NAMES.welcomeCategory,
    verifiedPerms,
    ['Welcome', '👋🏻 Welcome', '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖'],
    categoryOptions
  );
  const welcomeCategory = welcomeCategoryResult.channel;

  const welcomeResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.welcomeChannel,
    NAMES.welcomeChannel,
    welcomeCategory?.id || null,
    verifiedPerms,
    ['welcome', '👋🏻 Welcome', '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖'],
    channelOptions
  );
  const welcomeChannel = welcomeResult.channel;

  const welcomeInfoResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.welcomeInfoChannel,
    NAMES.welcomeInfoChannel,
    welcomeCategory?.id || null,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['welcome-info'],
    channelOptions
  );
  const welcomeInfoChannel = welcomeInfoResult.channel;

  const ticketCategoryResult = await ensureCategory(
    guild,
    workingConfig,
    SETUP_KEYS.ticketCategory,
    NAMES.ticketCategory,
    verifiedPerms,
    ['Ticket', '🎫 Ticket', '🎫 𝕋𝕚𝕔𝕜𝕖𝕥'],
    categoryOptions
  );
  const ticketCategory = ticketCategoryResult.channel;

  const ticketResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.ticketChannel,
    NAMES.ticketChannel,
    ticketCategory?.id || null,
    verifiedPerms,
    ['ticket', '🎫 Ticket', '🎫 𝕋𝕚𝕔𝕜𝕖𝕥'],
    channelOptions
  );
  const ticketChannel = ticketResult.channel;

  const ticketInfoResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.ticketInfoChannel,
    NAMES.ticketInfoChannel,
    ticketCategory?.id || null,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['ticket-info'],
    channelOptions
  );
  const ticketInfoChannel = ticketInfoResult.channel;

  const whitelistCategoryResult = await ensureCategory(
    guild,
    workingConfig,
    SETUP_KEYS.whitelistCategory,
    NAMES.whitelistCategory,
    verifiedPerms,
    ['Whitelist', '🛡️ Whitelist', '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥'],
    categoryOptions
  );
  const whitelistCategory = whitelistCategoryResult.channel;

  const whitelistResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.whitelistChannel,
    NAMES.whitelistChannel,
    whitelistCategory?.id || null,
    verifiedPerms,
    ['whitelist', '🛡️ Whitelist', '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥'],
    channelOptions
  );
  const whitelistChannel = whitelistResult.channel;

  const whitelistInfoResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.whitelistInfoChannel,
    NAMES.whitelistInfoChannel,
    whitelistCategory?.id || null,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['whitelist-info'],
    channelOptions
  );
  const whitelistInfoChannel = whitelistInfoResult.channel;

  const validatorCategoryResult = await ensureCategory(
    guild,
    workingConfig,
    SETUP_KEYS.validatorCategory,
    NAMES.validatorCategory,
    verifiedPerms,
    ['Validator', '🧬 Validator', '🧬 𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣'],
    categoryOptions
  );
  const validatorCategory = validatorCategoryResult.channel;

  const validatorResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.validatorChannel,
    NAMES.validatorChannel,
    validatorCategory?.id || null,
    verifiedPerms,
    ['json-xml-validator', '🧬 Json-Xml-Validator', '🧬 𝕁𝕤𝕠𝕟-𝕏𝕞𝕝-𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣'],
    channelOptions
  );
  const validatorChannel = validatorResult.channel;

  const validatorInfoResult = await ensureTextChannel(
    guild,
    workingConfig,
    SETUP_KEYS.validatorInfoChannel,
    NAMES.validatorInfoChannel,
    validatorCategory?.id || null,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['validator-info'],
    channelOptions
  );
  const validatorInfoChannel = validatorInfoResult.channel;

  const newConfig = {
    ...workingConfig,
    rulesAcceptedRoleId: rulesAcceptedRole.id,
    verifyRoleId: verifyRole.id,
    unverifiedRoleId: unverifyRole.id,
    welcomeChannelId: workingConfig.welcomeChannelId || welcomeChannel?.id || null,
    ticketCategoryId: workingConfig.ticketCategoryId || ticketCategory?.id || null,
    whitelistCategoryId: workingConfig.whitelistCategoryId || whitelistCategory?.id || null,
    ticketPanelMessage: workingConfig.ticketPanelMessage || DEFAULT_TICKET_MESSAGE,
    whitelistPanelMessage: workingConfig.whitelistPanelMessage || DEFAULT_WHITELIST_MESSAGE,
    welcomeMessage: workingConfig.welcomeMessage || DEFAULT_WELCOME_MESSAGE,
    validatorChannelId: workingConfig.validatorChannelId || validatorChannel?.id || null,
    createdSetupKeys: workingConfig.createdSetupKeys || [...BASELINE_SETUP_KEYS]
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

  if (mode === 'full') {
    if (verifiedChannel) {
      await postVerificationPanels(verifiedChannel, guild.id, 'full', botId);
    }

    if (welcomeChannel) {
      await clearBotMessages(welcomeChannel, botId);
      await postWelcomePanel(welcomeChannel, newConfig.welcomeMessage);
    }

    if (ticketChannel) {
      await clearBotMessages(ticketChannel, botId);
      await postTicketPanel(ticketChannel, newConfig.ticketPanelMessage);
    }

    if (whitelistChannel) {
      await clearBotMessages(whitelistChannel, botId);
      await postWhitelistPanel(whitelistChannel, newConfig.whitelistPanelMessage);
    }

    if (validatorChannel) {
      await clearBotMessages(validatorChannel, botId);
      await postValidatorPanel(validatorChannel);
    }

    if (verificationSetupChannel) {
      await clearBotMessages(verificationSetupChannel, botId);
      await verificationSetupChannel.send(
        [
          '# 🔐 Verification Setup',
          '',
          '• Verify, Unverify und RulesAccepted wurden automatisch erstellt.',
          '• Eigene Server-Kategorien und Kanäle bitte privat setzen und die Rolle Verify hinzufügen.',
          '',
          'Der Bot macht automatisch:',
          '• RulesAccepted hinzufügen nach Regelbestätigung ✅',
          '• Unverify entfernen ✅',
          '• Verify hinzufügen ✅',
          '• RulesAccepted wieder entfernen ✅'
        ].join('\n')
      );
    }

    if (welcomeInfoChannel) {
      await clearBotMessages(welcomeInfoChannel, botId);
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
    }

    if (ticketInfoChannel) {
      await clearBotMessages(ticketInfoChannel, botId);
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
    }

    if (whitelistInfoChannel) {
      await clearBotMessages(whitelistInfoChannel, botId);
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
    }

    if (validatorInfoChannel) {
      await clearBotMessages(validatorInfoChannel, botId);
      await validatorInfoChannel.send(
        [
          '# 🧪 Validator Info',
          '',
          'Mit `/validate` kannst du JSON-, XML- und DayZ-Dateien prüfen.',
          '',
          'Der öffentliche Channel ist direkt einsatzbereit.'
        ].join('\n')
      );
    }
  }

  if (mode === 'update') {
    if (verifiedResult.created && verifiedChannel) {
      await postVerificationPanels(verifiedChannel, guild.id, 'update', botId);
    }

    if (welcomeResult.created && welcomeChannel) {
      await postWelcomePanel(welcomeChannel, newConfig.welcomeMessage);
    }

    if (ticketResult.created && ticketChannel) {
      await postTicketPanel(ticketChannel, newConfig.ticketPanelMessage);
    }

    if (whitelistResult.created && whitelistChannel) {
      await postWhitelistPanel(whitelistChannel, newConfig.whitelistPanelMessage);
    }

    if (validatorResult.created && validatorChannel) {
      await postValidatorPanel(validatorChannel);
    }

    if (verificationSetupResult.created && verificationSetupChannel) {
      await verificationSetupChannel.send(
        [
          '# 🔐 Verification Setup',
          '',
          '• Verify, Unverify und RulesAccepted wurden automatisch erstellt.',
          '• Eigene Server-Kategorien und Kanäle bitte privat setzen und die Rolle Verify hinzufügen.'
        ].join('\n')
      );
    }

    if (welcomeInfoResult.created && welcomeInfoChannel) {
      await welcomeInfoChannel.send(
        [
          '# 👋 Welcome Info',
          '',
          'Die Welcome-Nachricht kann geändert werden mit:',
          '`/welcome-nachricht`'
        ].join('\n')
      );
    }

    if (ticketInfoResult.created && ticketInfoChannel) {
      await ticketInfoChannel.send(
        [
          '# 🎫 Ticket Info',
          '',
          'Die Ticket-Nachricht kann geändert werden mit:',
          '`/ticket-nachricht`'
        ].join('\n')
      );
    }

    if (whitelistInfoResult.created && whitelistInfoChannel) {
      await whitelistInfoChannel.send(
        [
          '# 📋 Whitelist Info',
          '',
          'Die Whitelist-Nachricht kann geändert werden mit:',
          '`/whitelist-nachricht`'
        ].join('\n')
      );
    }

    if (validatorInfoResult.created && validatorInfoChannel) {
      await validatorInfoChannel.send(
        [
          '# 🧪 Validator Info',
          '',
          'Mit `/validate` kannst du JSON-, XML- und DayZ-Dateien prüfen.'
        ].join('\n')
      );
    }
  }

  return {
    verificationCategory,
    welcomeCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory
  };
}