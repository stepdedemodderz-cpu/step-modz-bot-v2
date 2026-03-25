import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { getGuildConfig } from '../utils/config.js';

const DEFAULT_WELCOME_MESSAGE = [
  'Willkommen auf dem Server 👋',
  '',
  'Wir wünschen dir viel Spaß.'
].join('\n');

export default {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('Sendet die aktuelle Welcome-Nachricht in den Welcome-Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.welcomeChannelId) {
      await interaction.reply({
        content: '❌ Es wurde noch kein Welcome-Channel gesetzt. Nutze /setup oder Schnell Einrichtung.',
        ephemeral: true
      });
      return;
    }

    const channel = await interaction.guild.channels.fetch(config.welcomeChannelId).catch(() => null);

    if (!channel || !channel.isTextBased()) {
      await interaction.reply({
        content: '❌ Der gespeicherte Welcome-Channel ist ungültig.',
        ephemeral: true
      });
      return;
    }

    await channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('👋 Welcome')
          .setDescription(config.welcomeMessage || DEFAULT_WELCOME_MESSAGE)
          .setColor(0x22c55e)
          .setFooter({ text: 'Step Mod!Z BOT • Welcome' })
          .setTimestamp()
      ]
    });

    await interaction.reply({
      content: `✅ Welcome-Nachricht wurde in ${channel} gesendet.`,
      ephemeral: true
    });
  }
};