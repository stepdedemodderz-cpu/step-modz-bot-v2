import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { updateServerStatusMessage } from '../utils/serverStatus.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server-status-setup')
    .setDescription('Richte deinen DayZ Server Status ein')
    .addSubcommand(sub =>
      sub
        .setName('manual')
        .setDescription('Richte den Status manuell mit IP und Port ein')
        .addStringOption(option =>
          option.setName('ip')
            .setDescription('Server IP')
            .setRequired(true)
        )
        .addIntegerOption(option =>
          option.setName('port')
            .setDescription('Server Port')
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName('nitrado')
        .setDescription('Speichere Nitrado Token + Service ID für DayZ Tools')
        .addStringOption(option =>
          option.setName('token')
            .setDescription('Nitrado Token')
            .setRequired(true)
        )
        .addStringOption(option =>
          option.setName('service_id')
            .setDescription('Nitrado Service ID')
            .setRequired(true)
        )
    ),

  async execute(interaction) {
    const sub = interaction.options.getSubcommand();
    const config = getGuildConfig(interaction.guild.id) || {};

    const statusChannel = interaction.guild.channels.cache.find(
      (c) => c.name === '📡 server-status' || c.name === 'server-status'
    );

    // 🔹 MANUAL MODE
    if (sub === 'manual') {
      const ip = interaction.options.getString('ip');
      const port = interaction.options.getInteger('port');

      setGuildConfig(interaction.guild.id, {
        ...config,
        dayzConnectionMode: 'manual',
        serverIP: ip,
        serverPort: port,
        serverStatusChannelId: statusChannel?.id || config.serverStatusChannelId || null
      });

      // 🔥 WICHTIG: KEIN result mehr!
      await updateServerStatusMessage(interaction.guild).catch(() => null);

      const embed = new EmbedBuilder()
        .setTitle('🧟 Server Status eingerichtet')
        .setDescription(
          [
            `🌐 **IP:** \`${ip}\``,
            `🔌 **Port:** \`${port}\``,
            '',
            '✅ Status wird jetzt automatisch aktualisiert.'
          ].join('\n')
        )
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • DayZ Setup' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      });

      return;
    }

    // 🔹 NITRADO MODE
    if (sub === 'nitrado') {
      const token = interaction.options.getString('token');
      const serviceId = interaction.options.getString('service_id');

      setGuildConfig(interaction.guild.id, {
        ...config,
        dayzConnectionMode: 'nitrado',
        nitradoToken: token,
        nitradoServiceId: serviceId,
        serverStatusChannelId: statusChannel?.id || config.serverStatusChannelId || null
      });

      const embed = new EmbedBuilder()
        .setTitle('🧷 Nitrado Verbindung gespeichert')
        .setDescription(
          [
            '✅ Nitrado Token und Service ID wurden gespeichert.',
            '',
            `🆔 **Service ID:** \`${serviceId}\``,
            '',
            'Diese Verbindung wird für DayZ Tools genutzt:',
            '• Killfeed',
            '• Server Tools',
            '• weitere Features'
          ].join('\n')
        )
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Nitrado Verbindung' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        flags: MessageFlags.Ephemeral
      });
    }
  }
};