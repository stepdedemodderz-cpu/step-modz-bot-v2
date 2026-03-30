import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { updateServerStatusMessage } from '../utils/serverStatus.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server-status-setup')
    .setDescription('Richte deinen DayZ Live Server Status ein')
    .addStringOption(option =>
      option.setName('ip')
        .setDescription('Server IP')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('port')
        .setDescription('Server Port')
        .setRequired(true)
    ),

  async execute(interaction) {
    const ip = interaction.options.getString('ip');
    const port = interaction.options.getInteger('port');

    const config = getGuildConfig(interaction.guild.id) || {};

    const statusChannel = interaction.guild.channels.cache.find(
      (c) => c.name === '📡 server-status' || c.name === 'server-status'
    );

    setGuildConfig(interaction.guild.id, {
      ...config,
      serverIP: ip,
      serverPort: port,
      serverStatusChannelId: statusChannel?.id || config.serverStatusChannelId || null
    });

    const result = await updateServerStatusMessage(interaction.guild);

    const embed = new EmbedBuilder()
      .setTitle('🧟 Live Status eingerichtet')
      .setDescription(
        [
          `🌐 **IP:** \`${ip}\``,
          `🔌 **Port:** \`${port}\``,
          '',
          result.ok
            ? '✅ Die Status-Nachricht wurde erstellt oder aktualisiert.'
            : '⚠️ Daten wurden gespeichert. Die Status-Nachricht konnte noch nicht aktualisiert werden.'
        ].join('\n')
      )
      .setColor(0x22c55e)
      .setFooter({ text: 'Step Mod!Z BOT • Server Status Setup' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};