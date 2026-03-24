import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits
} from 'discord.js';
import { getGuildConfig } from './config.js';

function sanitizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
}

export function buildTicketPanelEmbed() {
  return new EmbedBuilder()
    .setTitle('🎫 Support Tickets')
    .setDescription(
      [
        'Benötigst du Hilfe von einem Admin oder Moderator?',
        '',
        'Klicke auf den Button unten, um ein privates Ticket zu öffnen.'
      ].join('\n')
    )
    .setFooter({ text: 'Step Mod!Z BOT • Ticket System' })
    .setTimestamp();
}

export function buildTicketPanelRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_open_ticket')
      .setLabel('Ticket öffnen')
      .setEmoji('🎫')
      .setStyle(ButtonStyle.Primary)
  );
}

export function buildCloseTicketRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_close_ticket')
      .setLabel('Ticket schließen')
      .setEmoji('🔒')
      .setStyle(ButtonStyle.Danger)
  );
}

export async function createTicketChannel(interaction) {
  const config = getGuildConfig(interaction.guild.id);

  if (!config?.ticketCategoryId) {
    throw new Error('Für diesen Server wurde keine Ticket-Kategorie gesetzt.');
  }

  const cleanName = sanitizeName(interaction.user.username);
  const channelName = `ticket-${cleanName}`;

  const existing = interaction.guild.channels.cache.find(
    (channel) => channel.name === channelName
  );

  if (existing) {
    return { exists: true, channel: existing };
  }

  const permissionOverwrites = [
    {
      id: interaction.guild.roles.everyone.id,
      deny: [PermissionFlagsBits.ViewChannel]
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    }
  ];

  if (config.ticketSupportRoleId) {
    permissionOverwrites.push({
      id: config.ticketSupportRoleId,
      allow: [
        PermissionFlagsBits.ViewChannel,
        PermissionFlagsBits.SendMessages,
        PermissionFlagsBits.ReadMessageHistory
      ]
    });
  }

  const channel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: config.ticketCategoryId,
    permissionOverwrites
  });

  const embed = new EmbedBuilder()
    .setTitle('🎫 Ticket erstellt')
    .setDescription(
      [
        `${interaction.user}, dein Ticket wurde erstellt.`,
        '',
        'Bitte beschreibe dein Anliegen so genau wie möglich.'
      ].join('\n')
    )
    .setTimestamp();

  await channel.send({
    content: config.ticketSupportRoleId ? `<@&${config.ticketSupportRoleId}>` : undefined,
    embeds: [embed],
    components: [buildCloseTicketRow()]
  });

  return { exists: false, channel };
}
