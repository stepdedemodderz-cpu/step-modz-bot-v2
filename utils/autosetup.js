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

async function ensureCategory(guild, name, overwrites, aliases = []) {
  let category = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildCategory &&
      (c.name === name || aliases.includes(c.name))
  );

  if (!category) {
    category = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: overwrites
    });
    return { channel: category, created: true };
  }

  return { channel: category, created: false };
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
    return { channel, created: true };
  }

  return { channel, created: false };
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

export async function runAutoSetup(guild, options = {}) {
  const mode = options.mode || 'full';
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

  const verificationCategoryResult = await ensureCategory(
    guild,
    NAMES.verificationCategory,
    publicVerificationOverwrites(botId, everyoneId),
    ['Verification', '✅ Verification', '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕔𝕒𝕥𝕚𝕠𝕟']
  );
  const verificationCategory = verificationCategoryResult.channel;

  const verifiedResult = await ensureTextChannel(
    guild,
    NAMES.verifiedChannel,
    verificationCategory.id,
    publicVerificationOverwrites(botId, everyoneId),
    ['verified', '✅ Verified', '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕖𝕕']
  );
  const verifiedChannel = verifiedResult.channel;

  const verificationSetupResult = await ensureTextChannel(
    guild,
    NAMES.verificationSetupChannel,
    verificationCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['verification-setup']
  );
  const verificationSetupChannel = verificationSetupResult.channel;

  const welcomeCategoryResult = await ensureCategory(
    guild,
    NAMES.welcomeCategory,
    verifiedPerms,
    ['Welcome', '👋🏻 Welcome', '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖']
  );
  const welcomeCategory = welcomeCategoryResult.channel;

  const welcomeResult = await ensureTextChannel(
    guild,
    NAMES.welcomeChannel,
    welcomeCategory.id,
    verifiedPerms,
    ['welcome', '👋🏻 Welcome', '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖']
  );
  const welcomeChannel = welcomeResult.channel;

  const welcomeInfoResult = await ensureTextChannel(
    guild,
    NAMES.welcomeInfoChannel,
    welcomeCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['welcome-info']
  );
  const welcomeInfoChannel = welcomeInfoResult.channel;

  const ticketCategoryResult = await ensureCategory(
    guild,
    NAMES.ticketCategory,
    verifiedPerms,
    ['Ticket', '🎫 Ticket', '🎫 𝕋𝕚𝕔𝕜𝕖𝕥']
  );
  const ticketCategory = ticketCategoryResult.channel;

  const ticketResult = await ensureTextChannel(
    guild,
    NAMES.ticketChannel,
    ticketCategory.id,
    verifiedPerms,
    ['ticket', '🎫 Ticket', '🎫 𝕋𝕚𝕔𝕜𝕖𝕥']
  );
  const ticketChannel = ticketResult.channel;

  const ticketInfoResult = await ensureTextChannel(
    guild,
    NAMES.ticketInfoChannel,
    ticketCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['ticket-info']
  );
  const ticketInfoChannel = ticketInfoResult.channel;

  const whitelistCategoryResult = await ensureCategory(
    guild,
    NAMES.whitelistCategory,
    verifiedPerms,
    ['Whitelist', '🛡️ Whitelist', '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥']
  );
  const whitelistCategory = whitelistCategoryResult.channel;

  const whitelistResult = await ensureTextChannel(
    guild,
    NAMES.whitelistChannel,
    whitelistCategory.id,
    verifiedPerms,
    ['whitelist', '🛡️ Whitelist', '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥']
  );
  const whitelistChannel = whitelistResult.channel;

  const whitelistInfoResult = await ensureTextChannel(
    guild,
    NAMES.whitelistInfoChannel,
    whitelistCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['whitelist-info']
  );
  const whitelistInfoChannel = whitelistInfoResult.channel;

  const validatorCategoryResult = await ensureCategory(
    guild,
    NAMES.validatorCategory,
    verifiedPerms,
    ['Validator', '🧬 Validator', '🧬 𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣']
  );
  const validatorCategory = validatorCategoryResult.channel;

  const validatorResult = await ensureTextChannel(
    guild,
    NAMES.validatorChannel,
    validatorCategory.id,
    verifiedPerms,
    ['json-xml-validator', '🧬 Json-Xml-Validator', '🧬 𝕁𝕤𝕠𝕟-𝕏𝕞𝕝-𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣']
  );
  const validatorChannel = validatorResult.channel;

  const validatorInfoResult = await ensureTextChannel(
    guild,
    NAMES.validatorInfoChannel,
    validatorCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['validator-info']
  );
  const validatorInfoChannel = validatorInfoResult.channel;

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

  if (mode === 'full') {
    await postVerificationPanels(verifiedChannel, guild.id, 'full', botId);

    await clearBotMessages(welcomeChannel, botId);
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

    await clearBotMessages(ticketChannel, botId);
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

    await clearBotMessages(whitelistChannel, botId);
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

    await clearBotMessages(validatorChannel, botId);
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

  if (mode === 'update') {
    if (verifiedResult.created) {
      await postVerificationPanels(verifiedChannel, guild.id, 'update', botId);
    }

    if (welcomeResult.created) {
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
    }

    if (ticketResult.created) {
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
    }

    if (whitelistResult.created) {
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
    }

    if (validatorResult.created) {
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
    }

    if (verificationSetupResult.created) {
      await verificationSetupChannel.send(
        [
          '# 🔐 Verification Setup',
          '',
          '• Verify, Unverify und RulesAccepted wurden automatisch erstellt.',
          '• Eigene Server-Kategorien und Kanäle bitte privat setzen und die Rolle Verify hinzufügen.'
        ].join('\n')
      );
    }

    if (welcomeInfoResult.created) {
      await welcomeInfoChannel.send(
        [
          '# 👋 Welcome Info',
          '',
          'Die Welcome-Nachricht kann geändert werden mit:',
          '`/welcome-nachricht`'
        ].join('\n')
      );
    }

    if (ticketInfoResult.created) {
      await ticketInfoChannel.send(
        [
          '# 🎫 Ticket Info',
          '',
          'Die Ticket-Nachricht kann geändert werden mit:',
          '`/ticket-nachricht`'
        ].join('\n')
      );
    }

    if (whitelistInfoResult.created) {
      await whitelistInfoChannel.send(
        [
          '# 📋 Whitelist Info',
          '',
          'Die Whitelist-Nachricht kann geändert werden mit:',
          '`/whitelist-nachricht`'
        ].join('\n')
      );
    }

    if (validatorInfoResult.created) {
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