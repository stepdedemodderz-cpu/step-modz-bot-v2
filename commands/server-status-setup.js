import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server-status-setup')
    .setDescription('Richte deinen DayZ Server Status ein')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('Server IP')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('port')
        .setDescription('Server Port')
        .setRequired(true)
    ),

  async execute(interaction) {
    const ip = interaction.options.getString('ip');
    const port = interaction.options.getString('port');

    const config = getGuildConfig(interaction.guild.id) || {};

    setGuildConfig(interaction.guild.id, {
      ...config,
      serverIP: ip,
      serverPort: port
    });

    const embed = new EmbedBuilder()
      .setTitle('🧟 Server verbunden')
      .setDescription(
        `Server wurde gespeichert:\n\n` +
        `🌐 IP: ${ip}\n` +
        `🔌 Port: ${port}\n\n` +
        `➡️ Status System ist jetzt aktiv`
      )
      .setColor(0x22c55e)
      .setFooter({ text: 'Step Mod!Z BOT' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};