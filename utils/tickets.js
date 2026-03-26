import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  PermissionsBitField
} from 'discord.js';
import { getGuildConfig } from './config.js';

export function buildTicketPanelRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_open_ticket')
      .setLabel('🎫 Ticket öffnen')
      .setStyle(ButtonStyle.Primary)
  );
}

function buildCloseTicketRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_close_ticket')
      .setLabel('🔒 Ticket schließen')
      .setStyle(ButtonStyle.Danger)
  );
}

function sanitizeChannelName(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9äöüß_-]/gi, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 80);
}

export async function createTicketChannel(interaction) {
  const config = getGuildConfig(interaction.guild.id) || {};

  if (!config.ticketCategoryId) {
    throw new Error('TICKET_CATEGORY_MISSING');
  }

  const ticketCategory = interaction.guild.channels.cache.get(config.ticketCategoryId);
  if (!ticketCategory) {
    throw new Error('TICKET_CATEGORY_INVALID');
  }

  const existing = interaction.guild.channels.cache.find(
    (c) =>
      c.parentId === ticketCategory.id &&
      c.type === ChannelType.GuildText &&
      c.topic === `ticket-owner:${interaction.user.id}`
  );

  if (existing) {
    return { exists: true, channel: existing.toString() };
  }

  const permissionOverwrites = [
    {
      id: interaction.guild.roles.everyone.id,
      deny: [PermissionsBitField.Flags.ViewChannel]
    },
    {
      id: interaction.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: interaction.guild.ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: interaction.guild.client.user.id,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageMessages
      ]
    }
  ];

  if (config.ticketSupportRoleId) {
    permissionOverwrites.push({
      id: config.ticketSupportRoleId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    });
  }

  const channelName = sanitizeChannelName(`ticket-${interaction.user.username}`);

  const channel = await interaction.guild.channels.create({
    name: channelName,
    type: ChannelType.GuildText,
    parent: ticketCategory.id,
    topic: `ticket-owner:${interaction.user.id}`,
    permissionOverwrites
  });

  const embed = new EmbedBuilder()
    .setTitle('🎫 Support Ticket')
    .setDescription(
      [
        `Hallo ${interaction.user},`,
        '',
        'dein Ticket wurde erstellt.',
        'Beschreibe bitte dein Anliegen so genau wie möglich.'
      ].join('\n')
    )
    .setColor(0x22c55e)
    .setFooter({ text: 'Step Mod!Z BOT • Ticket' })
    .setTimestamp();

  await channel.send({
    content: config.ticketSupportRoleId ? `<@&${config.ticketSupportRoleId}>` : null,
    embeds: [embed],
    components: [buildCloseTicketRow()]
  });

  return { exists: false, channel: channel.toString() };
}