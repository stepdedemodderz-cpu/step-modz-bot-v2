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

  // Rollen automatisch erstellen
  const verifyRole =
    (currentConfig.verifyRoleId && guild.roles.cache.get(currentConfig.verifyRoleId)) ||
    await ensureRole(guild, 'Verify');

  const unverifyRole =
    (currentConfig.unverifiedRoleId && guild.roles.cache.get(currentConfig.unverifiedRoleId)) ||
    await ensureRole(guild, 'Unverify');

  // Welcome
  const welcomeCategory = await ensureCategory(guild, 'Welcome');
  const welcomeChannel = await ensureTextChannel(guild, 'welcome', welcomeCategory.id);

  // Verification
  const verificationCategory = await ensureCategory(guild, 'Verification');
  const verificationChannel = await ensureTextChannel(guild, 'verified', verificationCategory.id);

  // Ticket
  const ticketCategory = await ensureCategory(guild, 'Ticket');
  const ticketChannel = await ensureTextChannel(guild, 'ticket', ticketCategory.id);

  // Whitelist
  const whitelistCategory = await ensureCategory(guild, 'Whitelist');
  const whitelistChannel = await ensureTextChannel(guild, 'whitelist', whitelistCategory.id);

  // Validator
  const validatorCategory = await ensureCategory(guild, 'Validator');
  const validatorChannel = await ensureTextChannel(guild, 'json-validator', validatorCategory.id);

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

  await welcomeChannel.send({
    embeds: [
      infoEmbed(
        '👋 Welcome',
        [
          'Hier steht nur das Wichtigste.',
          '',
          'Die aktuelle Welcome-Nachricht kann geändert werden mit:',
          '`/welcome-nachricht`',
          '',
          'Danach kannst du mit `/setup-welcome` die aktuelle Welcome-Nachricht erneut senden.'
        ].join('\n'),
        'Step Mod!Z BOT • Welcome'
      ),
      new EmbedBuilder()
        .setTitle('Aktuelle Welcome-Nachricht')
        .setDescription(newConfig.welcomeMessage)
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Welcome Vorschau' })
        .setTimestamp()
    ]
  });

  await verificationChannel.send({
    embeds: [
      infoEmbed(
        '🔐 Verification',
        [
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
          'Kategorie und / oder Kanal bearbeiten',
          '• Setze das Häkchen auf private Kategorie / Kanal',
          '• Füge nun allen Kategorien und Kanälen die Rolle Verify hinzu',
          '',
          'WICHTIG:',
          '• Diesem Kanal die Rolle Unverify hinzufügen',
          '',
          'Nach Klick auf Verifizieren werden alle Kategorien und Kanäle angezeigt.',
          '',
          'Der Bot macht automatisch:',
          '• Unverify entfernen',
          '• Verify hinzufügen'
        ].join('\n'),
        'Step Mod!Z BOT • Verification'
      ),
      buildVerifyEmbed(guild.id)
    ],
    components: [buildVerifyRow()]
  });

  await ticketChannel.send({
    embeds: [
      infoEmbed(
        '🎫 Ticket',
        [
          'Hier steht nur das Wichtigste.',
          '',
          'Die Ticket-Nachricht kann geändert werden mit:',
          '`/ticket-nachricht`',
          '',
          'Danach kannst du mit `/ticket-panel` das Panel erneut senden.',
          '',
          'Das Ticket-System erstellt private Support-Tickets.'
        ].join('\n'),
        'Step Mod!Z BOT • Ticket'
      ),
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
      infoEmbed(
        '📋 Whitelist',
        [
          'Hier steht nur das Wichtigste.',
          '',
          'Die Whitelist-Nachricht kann geändert werden mit:',
          '`/whitelist-nachricht`',
          '',
          'Danach kannst du mit `/whitelist-panel` das Panel erneut senden.',
          '',
          'Das Whitelist-System erstellt Bewerbungs-Channels für DayZ.'
        ].join('\n'),
        'Step Mod!Z BOT • Whitelist'
      ),
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
      infoEmbed(
        '🧪 Validator',
        [
          'Hier steht nur das Wichtigste.',
          '',
          'Nutze `/validate` und lade eine JSON- oder XML-Datei hoch.',
          'Der Bot erkennt den Typ automatisch und zeigt Fehler oder Hinweise an.'
        ].join('\n'),
        'Step Mod!Z BOT • Validator'
      )
    ]
  });

  return {
    welcomeCategory,
    verificationCategory,
    ticketCategory,
    whitelistCategory,
    validatorCategory
  };
}