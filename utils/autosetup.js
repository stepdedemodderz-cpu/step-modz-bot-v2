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

function publicOverwrites(guild) {
  return [
    {
      id: guild.roles.everyone.id,
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

async function ensureCategory(guild, name, isPublic = false) {
  let category = guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name === name
  );

  if (!category) {
    category = await guild.channels.create({
      name,
      type: ChannelType.GuildCategory,
      permissionOverwrites: isPublic ? publicOverwrites(guild) : ownerOnlyOverwrites(guild)
    });
  }

  return category;
}

async function ensureTextChannel(guild, name, parentId, isPublic = false) {
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
      permissionOverwrites: isPublic ? publicOverwrites(guild) : ownerOnlyOverwrites(guild)
    });
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

  const welcomeCategory = await ensureCategory(guild, 'Welcome', false);
  const welcomeChannel = await ensureTextChannel(guild, 'welcome', welcomeCategory.id, false);

  const verificationCategory = await ensureCategory(guild, 'Verification', false);
  const verificationChannel = await ensureTextChannel(guild, 'verified', verificationCategory.id, false);

  const ticketCategory = await ensureCategory(guild, 'Ticket', false);
  const ticketChannel = await ensureTextChannel(guild, 'ticket', ticketCategory.id, false);

  const whitelistCategory = await ensureCategory(guild, 'Whitelist', false);
  const whitelistChannel = await ensureTextChannel(guild, 'whitelist', whitelistCategory.id, false);

  const validatorCategory = await ensureCategory(guild, 'Validator', true);
  const validatorChannel = await ensureTextChannel(guild, 'json-xml-validator', validatorCategory.id, true);

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
    content: [
      '# 🔐 Verification',
      '',
      'Wie funktioniert es? Was musst du machen?',
      '',
      'Erstelle in deinen Servereinstellungen zuerst zwei neue Rollen:',
      '• Verify',
      '• Unverify',
      '(Farblich auswählen wenn gewünscht)',
      '',
      'Danach jede Kategorie und jeden Kanal bearbeiten.',
      'Rechtsklick auf alle Kategorien und Kanäle links in der Leiste.',
      '',
      'Kategorie und oder Kanäle bearbeiten',
      '• Setze das Häkchen auf Private Kategorie/Kanal',
      '• Füge nun allen Kategorien und Kanälen die Rolle Verify hinzu',
      '',
      'WICHTIG:',
      '• Diesem Kanal die Rolle Unverify hinzufügen.',
      '',
      'Nach Klick auf Verifizieren werden alle Kategorien und Kanäle angezeigt.',
      '',
      'Der Bot macht automatisch:',
      '• Unverify entfernen',
      '• Verify hinzufügen'
    ].join('\n'),
    embeds: [buildVerifyEmbed(guild.id)],
    components: [buildVerifyRow()]
  });

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
      'Der Bot erkennt den Typ automatisch und zeigt Fehler oder Hinweise an.',
      '',
      'Dieser Bereich darf von allen Usern gelesen und genutzt werden.'
    ].join('\n')
  );

  return {
    welcomeCategory,
    verificationCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory
  };
}