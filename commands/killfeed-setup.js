import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('killfeed-setup')
    .setDescription('Richte das DayZ Killfeed System ein')
    .addStringOption(option =>
      option.setName('token')
        .setDescription('Optional: Nitrado Token')
        .setRequired(false)
    )
    .addStringOption(option =>
      option.setName('service_id')
        .setDescription('Optional: Nitrado Service ID')
        .setRequired(false)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const token = interaction.options.getString('token') || config.nitradoToken || null;
    const serviceId = interaction.options.getString('service_id') || config.nitradoServiceId || null;

    const killfeedChannel = interaction.guild.channels.cache.find(
      (c) => c.name === '💀 killfeed' || c.name === 'killfeed'
    );

    if (!token || !serviceId) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Killfeed Verbindung fehlt')
        .setDescription(
          [
            'Für Killfeed wird eine Nitrado Verbindung benötigt.',
            '',
            'Nutze zuerst:',
            '`/server-status-setup nitrado token:DEIN_TOKEN service_id:DEINE_SERVICE_ID`',
            '',
            'Oder führe `/killfeed-setup` direkt mit Token und Service ID aus.'
          ].join('\n')
        )
        .setColor(0xef4444)
        .setFooter({ text: 'Step Mod!Z BOT • Killfeed Setup' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      return;
    }

    setGuildConfig(interaction.guild.id, {
      ...config,
      nitradoToken: token,
      nitradoServiceId: serviceId,
      killfeedEnabled: true,
      killfeedChannelId: killfeedChannel?.id || config.killfeedChannelId || null
    });

    const embed = new EmbedBuilder()
      .setTitle('💀 Killfeed vorbereitet')
      .setDescription(
        [
          '✅ Killfeed wurde für diesen Server vorbereitet.',
          '',
          `🆔 **Service ID:** \`${serviceId}\``,
          '',
          'Gespeichert wurden:',
          '• Nitrado Token',
          '• Service ID',
          '• Killfeed Aktivierung',
          '',
          'Der Kanal ist jetzt vorbereitet für die nächsten DayZ Killfeed-Schritte.'
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