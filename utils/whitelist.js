import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType,
  EmbedBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { getGuildConfig } from './config.js';

function sanitizeName(value) {
  return value.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 20);
}

export function buildWhitelistPanelEmbed() {
  return new EmbedBuilder()
    .setTitle('📋 DayZ Whitelist Bewerbung')
    .setDescription(
      [
        'Du möchtest dich für die Whitelist bewerben?',
        '',
        'Klicke auf den Button unten und fülle deine Bewerbung aus.'
      ].join('\n')
    )
    .setFooter({ text: 'Step Mod!Z BOT • Whitelist System' })
    .setTimestamp();
}

export function buildWhitelistPanelRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_open_whitelist')
      .setLabel('Whitelist bewerben')
      .setEmoji('📋')
      .setStyle(ButtonStyle.Success)
  );
}

export function buildWhitelistReviewRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_whitelist_accept')
      .setLabel('Annehmen')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success),
    new ButtonBuilder()
      .setCustomId('stepmodz_whitelist_deny')
      .setLabel('Ablehnen')
      .setEmoji('❌')
      .setStyle(ButtonStyle.Danger)
  );
}

export function buildWhitelistModal() {
  const modal = new ModalBuilder()
    .setCustomId('stepmodz_whitelist_modal')
    .setTitle('DayZ Whitelist Bewerbung');

  const gamertag = new TextInputBuilder()
    .setCustomId('gamertag')
    .setLabel('Xbox Gamertag / PSN Name')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(40);

  const age = new TextInputBuilder()
    .setCustomId('age')
    .setLabel('Wie alt bist du?')
    .setStyle(TextInputStyle.Short)
    .setRequired(true)
    .setMaxLength(3);

  const experience = new TextInputBuilder()
    .setCustomId('experience')
    .setLabel('Wie viel DayZ Erfahrung hast du?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(400);

  const reason = new TextInputBuilder()
    .setCustomId('reason')
    .setLabel('Warum möchtest du auf die Whitelist?')
    .setStyle(TextInputStyle.Paragraph)
    .setRequired(true)
    .setMaxLength(500);

  modal.addComponents(
    new ActionRowBuilder().addComponents(gamertag),
    new ActionRowBuilder().addComponents(age),
    new ActionRowBuilder().addComponents(experience),
    new ActionRowBuilder().addComponents(reason)
  );

  return modal;
}

export async function createWhitelistChannel(interaction, data) {
  const config = getGuildConfig(interaction.guild.id);

  if (!config?.whitelistCategoryId) {
    throw new Error('Für diesen Server wurde keine Whitelist-Kategorie gesetzt.');
  }

  const cleanName = sanitizeName(interaction.user.username);
  const channelName = `whitelist-${cleanName}`;

  const existing = interaction.guild.channels.cache.find(
    (channel) => channel.name === channelName
  );

  if (existing) {
    return existing;
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

  if (config.whitelistReviewRoleId) {
    permissionOverwrites.push({
      id: config.whitelistReviewRoleId,
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
    parent: config.whitelistCategoryId,
    permissionOverwrites
  });

  const embed = new EmbedBuilder()
    .setTitle('📋 Neue Whitelist Bewerbung')
    .setDescription(
      [
        `**User:** ${interaction.user.tag}`,
        `**User ID:** ${interaction.user.id}`,
        `**Gamertag / PSN:** ${data.gamertag}`,
        `**Alter:** ${data.age}`,
        '',
        `**DayZ Erfahrung:**\n${data.experience}`,
        '',
        `**Grund:**\n${data.reason}`
      ].join('\n')
    )
    .setTimestamp();

  await channel.send({
    content: config.whitelistReviewRoleId
      ? `<@&${config.whitelistReviewRoleId}>`
      : undefined,
    embeds: [embed],
    components: [buildWhitelistReviewRow()]
  });

  return channel;
}

export async function handleWhitelistDecision(interaction, accepted) {
  const config = getGuildConfig(interaction.guild.id);

  if (!interaction.channel || !interaction.channel.name.startsWith('whitelist-')) {
    throw new Error('Dieser Button funktioniert nur in einem Whitelist-Channel.');
  }

  const applicantId = interaction.channel.permissionOverwrites.cache.find(
    (overwrite) => overwrite.type === 1
  )?.id;

  if (!applicantId) {
    throw new Error('Bewerber konnte nicht gefunden werden.');
  }

  const member = await interaction.guild.members.fetch(applicantId).catch(() => null);

  if (!member) {
    throw new Error('Der Bewerber ist nicht mehr auf dem Server.');
  }

  if (accepted && config?.whitelistApprovedRoleId) {
    if (!member.roles.cache.has(config.whitelistApprovedRoleId)) {
      await member.roles.add(
        config.whitelistApprovedRoleId,
        'Whitelist Bewerbung angenommen'
      );
    }
  }

  const resultEmbed = new EmbedBuilder()
    .setTitle(accepted ? '✅ Whitelist angenommen' : '❌ Whitelist abgelehnt')
    .setDescription(
      [
        `**User:** ${member.user.tag}`,
        `**Bearbeitet von:** ${interaction.user.tag}`,
        `**Status:** ${accepted ? 'Angenommen' : 'Abgelehnt'}`
      ].join('\n')
    )
    .setTimestamp();

  await interaction.channel.send({ embeds: [resultEmbed] });

  await member.send(
    accepted
      ? `✅ Deine Whitelist-Bewerbung auf **${interaction.guild.name}** wurde angenommen.`
      : `❌ Deine Whitelist-Bewerbung auf **${interaction.guild.name}** wurde abgelehnt.`
  ).catch(() => null);
}
