import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('killfeed-setup')
    .setDescription('Richte das DayZ Killfeed System ein')
    .addStringOption(option =>
      option.setName('token')
        .setDescription('Nitrado Token')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const token = interaction.options.getString('token');

    const killfeedChannel = interaction.guild.channels.cache.find(
      (c) => c.name === '💀 killfeed' || c.name === 'killfeed'
    );

    setGuildConfig(interaction.guild.id, {
      ...config,
      nitradoToken: token,
      killfeedEnabled: true,
      killfeedChannelId: killfeedChannel?.id || config.killfeedChannelId || null
    });

    const embed = new EmbedBuilder()
      .setTitle('💀 Killfeed aktiviert')
      .setDescription(
        [
          '✅ Killfeed wurde erfolgreich aktiviert.',
          '',
          'Gespeichert wurde:',
          '• Nitrado Token',
          '',
          'Der Bot nutzt automatisch deinen ersten DayZ Server.',
          '',
          '👉 Der Killfeed startet automatisch.'
        ].join('\n')
      )
      .setColor(0x22c55e)
      .setFooter({ text: 'Step Mod!Z BOT • Killfeed Setup' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};