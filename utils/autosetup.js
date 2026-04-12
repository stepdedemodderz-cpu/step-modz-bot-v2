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

      const currentConfig = getGuildConfig(guild.id) || {};
      setGuildConfig(guild.id, {
        ...currentConfig,
        serverStatusChannelId: statusResult.channel.id
      });

      if (statusResult.created) {
        created.push('📡 server-status Kanal');

        await statusResult.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('🧟 Server Status')
              .setDescription(
                '⚙️ Server Status System wurde installiert.\n\n' +
                'Nutze:\n' +
                '`/server-status-setup manual`\n' +
                'oder\n' +
                '`/server-status-setup nitrado`'
              )
              .setColor(0x22c55e)
              .setFooter({ text: 'Step Mod!Z BOT • Server Status' })
              .setTimestamp()
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
            '# 🖥️ DayZ Server Verbindung',
            '',
            'Mit diesem System kannst du deinen DayZ Server direkt mit dem Bot verbinden.',
            '',
            'Du hast **2 Möglichkeiten**:',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '🔹 **1. Empfohlen (Nitrado Verbindung)**',
            '',
            'Nutze:',
            '`/server-status-setup nitrado token:DEIN_TOKEN service_id:DEINE_SERVICE_ID`',
            '',
            'Du benötigst:',
            '• Nitrado Token',
            '• Service ID',
            '',
            '## 🔑 Token erstellen',
            '',
            '1. Gehe auf Nitrado',
            '2. Öffne dein Profil → Developer / API',
            '3. Erstelle einen neuen Token',
            '4. **Setze NUR den Haken bei "service"**',
            '5. Namen eingeben',
            '6. Token erstellen',
            '7. Token kopieren',
            '',
            '👉 Danach im Discord einfügen',
            '',
            '## 🆔 Service ID finden',
            '',
            '1. Nitrado öffnen',
            '2. „Meine Dienste“',
            '3. Deinen DayZ Server auswählen',
            '4. Service ID dort ablesen',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '🔹 **2. Manuell (ohne Token)**',
            '',
            'Nutze:',
            '`/server-status-setup manual ip:DEINE_IP port:DEIN_PORT`',
            '',
            'Du brauchst:',
            '• Server IP',
            '• Port',
            '',
            '⚠️ Für direkte Verbindungen wird meistens der Game Port verwendet.',
            '⚠️ Für Steam / Favoriten wird oft der Query Port verwendet.',
            '',
            '💡 Empfehlung:',
            'Nutze Nitrado → einfacher + zuverlässiger',
            '',
            '⚠️ Token wird nur für DayZ Tools genutzt, nicht für den ganzen Bot.'
          ].join('\n')
        );
      }

      return created;
    }
  },
  {
    id: 'killfeed-v1',
    label: 'Killfeed System',
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
        '💀 Killfeed',
        ownerOnlyOverwrites(ownerId, botId, everyoneId),
        ['Killfeed']
      );

      if (categoryResult.created) {
        created.push('💀 Killfeed Kategorie');
      }

      const category = categoryResult.channel;

      const feedResult = await ensureTextChannel(
        guild,
        '💀 killfeed',
        category.id,
        ownerOnlyOverwrites(ownerId, botId, everyoneId),
        ['killfeed']
      );

      const currentConfig = getGuildConfig(guild.id) || {};
      setGuildConfig(guild.id, {
        ...currentConfig,
        killfeedChannelId: feedResult.channel.id
      });

      if (feedResult.created) {
        created.push('💀 killfeed Kanal');

        await feedResult.channel.send({
          embeds: [
            new EmbedBuilder()
              .setTitle('💀 Killfeed System')
              .setDescription(
                [
                  'Das Killfeed System wurde vorbereitet.',
                  '',
                  'Nutze jetzt:',
                  '`/killfeed-setup`',
                  '',
                  'oder direkt:',
                  '`/killfeed-setup token:DEIN_TOKEN service_id:DEINE_SERVICE_ID`'
                ].join('\n')
              )
              .setColor(0x22c55e)
              .setFooter({ text: 'Step Mod!Z BOT • Killfeed' })
              .setTimestamp()
          ]
        });
      }

      const infoResult = await ensureTextChannel(
        guild,
        'killfeed-info',
        category.id,
        ownerOnlyOverwrites(ownerId, botId, everyoneId),
        ['killfeed-info']
      );

      if (infoResult.created) {
        created.push('killfeed-info Kanal');

        await infoResult.channel.send(
  [
    '# 💀 Killfeed Info',
    '',
    'Dieses System zeigt dir **DayZ Kills automatisch im Discord** an.',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '🔧 **Einrichtung**',
    '',
    '1. Erstelle einen Nitrado Token',
    '2. Nutze den Command:',
    '`/killfeed-setup token:DEIN_TOKEN`',
    '',
    'Fertig ✅',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '🔑 **Token erstellen (Nitrado)**',
    '',
    '1. Nitrado öffnen',
    '2. Profil → Developer / API',
    '3. Neuen Token erstellen',
    '4. **Nur "service" anhaken**',
    '5. Namen eingeben',
    '6. Token erstellen',
    '7. Token kopieren',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '⚙️ **Wichtig**',
    '',
    '• Der Bot erkennt deinen Server automatisch',
    '• Es wird KEINE Service ID benötigt',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '📡 **Voraussetzung**',
    '',
    'DayZ Admin Logs müssen aktiv sein:',
    '• Server stoppen',
    '• Logs aktivieren',
    '• Server starten',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '💀 **Was wird angezeigt?**',
    '',
    '• Spieler tötet Spieler',
    '• Waffe',
    '• Distanz',
    '• weitere Infos folgen',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━',
    '🚀 Killfeed startet automatisch nach Setup'
  ].join('\n')
);
      }

      return created;
    }
  }
];

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

async function refreshChannels(guild) {
  await guild.channels.fetch().catch(() => null);
}

async function ensureCategory(guild, name, overwrites, aliases = []) {
  await refreshChannels(guild);

  const category =
    guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildCategory &&
        (c.name === name || aliases.includes(c.name))
    ) || null;

  if (category) {
    return { channel: category, created: false };
  }

  const created = await guild.channels.create({
    name,
    type: ChannelType.GuildCategory,
    permissionOverwrites: overwrites
  });

  return { channel: created, created: true };
}

async function ensureTextChannel(guild, name, parentId, overwrites, aliases = []) {
  await refreshChannels(guild);

  const existingInParent =
    guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildText &&
        (c.name === name || aliases.includes(c.name)) &&
        c.parentId === parentId
    ) || null;

  if (existingInParent) {
    return { channel: existingInParent, created: false };
  }

  const existingAnywhere =
    guild.channels.cache.find(
      (c) =>
        c.type === ChannelType.GuildText &&
        (c.name === name || aliases.includes(c.name))
    ) || null;

  if (existingAnywhere) {
    return { channel: existingAnywhere, created: false };
  }

  const created = await guild.channels.create({
    name,
    type: ChannelType.GuildText,
    parent: parentId,
    permissionOverwrites: overwrites
  });

  return { channel: created, created: true };
}

async function ensureRole(guild, name, color = null) {
  let role = guild.roles.cache.find((r) => r.name === name);

  if (!role) {
    role = await guild.roles.create({
      name,
      color: color || undefined,
      reason: 'Step Mod!Z BOT Schnell Einrichtung'
    });
    return { role, created: true };
  }

  return { role, created: false };
}

async function clearBotMessages(channel, botUserId) {
  const messages = await channel.messages.fetch({ limit: 25 }).catch(() => null);
  if (!messages) return;

  const botMessages = messages.filter((m) => m.author.id === botUserId);
  for (const [, msg] of botMessages) {
    await msg.delete().catch(() => null);
  }
}

async function postVerificationPanels(verifiedChannel, guildId, botId) {
  await clearBotMessages(verifiedChannel, botId);

  await verifiedChannel.send({
    embeds: [buildRulesIntroEmbed()],
    components: buildLanguageButtons()
  });

  await verifiedChannel.send({
    embeds: [buildVerifyEmbed(guildId)],
    components: [buildVerifyRow()]
  });
}

async function runFullSetup(guild, currentConfig) {
  const owner = await guild.fetchOwner();
  const ownerId = owner.id;
  const botId = guild.members.me?.id || guild.client.user.id;
  const everyoneId = guild.roles.everyone.id;

  const rulesAcceptedRoleResult =
    (currentConfig.rulesAcceptedRoleId && guild.roles.cache.get(currentConfig.rulesAcceptedRoleId))
      ? { role: guild.roles.cache.get(currentConfig.rulesAcceptedRoleId), created: false }
      : await ensureRole(guild, 'RulesAccepted');

  const verifyRoleResult =
    (currentConfig.verifyRoleId && guild.roles.cache.get(currentConfig.verifyRoleId))
      ? { role: guild.roles.cache.get(currentConfig.verifyRoleId), created: false }
      : await ensureRole(guild, 'Verify');

  const unverifyRoleResult =
    (currentConfig.unverifiedRoleId && guild.roles.cache.get(currentConfig.unverifiedRoleId))
      ? { role: guild.roles.cache.get(currentConfig.unverifiedRoleId), created: false }
      : await ensureRole(guild, 'Unverify');

  const rulesAcceptedRole = rulesAcceptedRoleResult.role;
  const verifyRole = verifyRoleResult.role;
  const unverifyRole = unverifyRoleResult.role;

  const verifiedPerms = verifiedOnlyOverwrites(ownerId, botId, everyoneId, verifyRole.id);

  const verificationCategory = (await ensureCategory(
    guild,
    NAMES.verificationCategory,
    publicVerificationOverwrites(botId, everyoneId),
    ['Verification', '✅ Verification', '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕔𝕒𝕥𝕚𝕠𝕟']
  )).channel;

  const verifiedChannel = (await ensureTextChannel(
    guild,
    NAMES.verifiedChannel,
    verificationCategory.id,
    publicVerificationOverwrites(botId, everyoneId),
    ['verified', '✅ Verified', '✅ 𝕍𝕖𝕣𝕚𝕗𝕚𝕖𝕕']
  )).channel;

  const verificationSetupChannel = (await ensureTextChannel(
    guild,
    NAMES.verificationSetupChannel,
    verificationCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['verification-setup']
  )).channel;

  const welcomeCategory = (await ensureCategory(
    guild,
    NAMES.welcomeCategory,
    verifiedPerms,
    ['Welcome', '👋🏻 Welcome', '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖']
  )).channel;

  const welcomeChannel = (await ensureTextChannel(
    guild,
    NAMES.welcomeChannel,
    welcomeCategory.id,
    verifiedPerms,
    ['welcome', '👋🏻 Welcome', '👋🏻 𝕎𝕖𝕝𝕔𝕠𝕞𝕖']
  )).channel;

  const welcomeInfoChannel = (await ensureTextChannel(
    guild,
    NAMES.welcomeInfoChannel,
    welcomeCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['welcome-info']
  )).channel;

  const ticketCategory = (await ensureCategory(
    guild,
    NAMES.ticketCategory,
    verifiedPerms,
    ['Ticket', '🎫 Ticket', '🎫 𝕋𝕚𝕔𝕜𝕖𝕥']
  )).channel;

  const ticketChannel = (await ensureTextChannel(
    guild,
    NAMES.ticketChannel,
    ticketCategory.id,
    verifiedPerms,
    ['ticket', '🎫 Ticket', '🎫 𝕋𝕚𝕔𝕜𝕖𝕥']
  )).channel;

  const ticketInfoChannel = (await ensureTextChannel(
    guild,
    NAMES.ticketInfoChannel,
    ticketCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['ticket-info']
  )).channel;

  const whitelistCategory = (await ensureCategory(
    guild,
    NAMES.whitelistCategory,
    verifiedPerms,
    ['Whitelist', '🛡️ Whitelist', '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥']
  )).channel;

  const whitelistChannel = (await ensureTextChannel(
    guild,
    NAMES.whitelistChannel,
    whitelistCategory.id,
    verifiedPerms,
    ['whitelist', '🛡️ Whitelist', '🛡️ 𝕎𝕙𝕚𝕥𝕖𝕝𝕚𝕤𝕥']
  )).channel;

  const whitelistInfoChannel = (await ensureTextChannel(
    guild,
    NAMES.whitelistInfoChannel,
    whitelistCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['whitelist-info']
  )).channel;

  const validatorCategory = (await ensureCategory(
    guild,
    NAMES.validatorCategory,
    verifiedPerms,
    ['Validator', '🧬 Validator', '🧬 𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣']
  )).channel;

  const validatorChannel = (await ensureTextChannel(
    guild,
    NAMES.validatorChannel,
    validatorCategory.id,
    verifiedPerms,
    ['json-xml-validator', '🧬 Json-Xml-Validator', '🧬 𝕁𝕤𝕠𝕟-𝕏𝕞𝕝-𝕍𝕒𝕝𝕚𝕕𝕒𝕥𝕠𝕣']
  )).channel;

  const validatorInfoChannel = (await ensureTextChannel(
    guild,
    NAMES.validatorInfoChannel,
    validatorCategory.id,
    ownerOnlyOverwrites(ownerId, botId, everyoneId),
    ['validator-info']
  )).channel;

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
    validatorChannelId: validatorChannel.id,
    installedToolMigrations: currentConfig.installedToolMigrations || []
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

  await postVerificationPanels(verifiedChannel, guild.id, botId);

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

  return {
    createdAnything: false,
    createdList: [],
    verificationCategory,
    welcomeCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory
  };
}

async function runUpdateOnly(guild, currentConfig) {
  const owner = await guild.fetchOwner();
  const ownerId = owner.id;
  const botId = guild.members.me?.id || guild.client.user.id;
  const everyoneId = guild.roles.everyone.id;

  const installed = Array.isArray(currentConfig.installedToolMigrations)
    ? currentConfig.installedToolMigrations
    : [];

  const createdList = [];
  const newInstalled = [...installed];

  for (const migration of TOOL_MIGRATIONS) {
    if (installed.includes(migration.id)) continue;

    const result = await migration.run({
      guild,
      ownerId,
      botId,
      everyoneId,
      ensureCategory,
      ensureTextChannel,
      ownerOnlyOverwrites,
      publicVerificationOverwrites,
      getGuildConfig,
      setGuildConfig,
      currentConfig
    });

    newInstalled.push(migration.id);

    if (Array.isArray(result) && result.length > 0) {
      createdList.push(...result);
    } else {
      createdList.push(migration.label || migration.id);
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

  return await runFullSetup(guild, currentConfig);
}