import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { getFirstDayZService } from '../utils/nitrado.js';

export default {
  data: new SlashCommandBuilder()
    .setName('killfeed-setup')
    .setDescription('Richte das DayZ Killfeed System ein')
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('Nitrado Token')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const token = interaction.options.getString('token', true);

    await interaction.deferReply({ ephemeral: true });

    const killfeedChannel = interaction.guild.channels.cache.find(
      (c) => c.name === '💀 killfeed' || c.name === 'killfeed'
    );

    try {
      const service = await getFirstDayZService(token);

      if (!service) {
        const embed = new EmbedBuilder()
          .setTitle('❌ Kein DayZ Server gefunden')
          .setDescription(
            [
              'Mit diesem Token konnte kein DayZ-Service gefunden werden.',
              '',
              'Prüfe bitte:',
              '• ob der Token gültig ist',
              '• ob bei Nitrado beim Token **service** aktiviert ist',
              '• ob auf dem Account ein DayZ Server vorhanden ist'
            ].join('\n')
          )
          .setColor(0xef4444)
          .setFooter({ text: 'Step Mod!Z BOT • Killfeed Setup' })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      setGuildConfig(interaction.guild.id, {
        ...config,
        nitradoToken: token,
        nitradoServiceId: String(service.id),
        killfeedEnabled: true,
        killfeedChannelId: killfeedChannel?.id || config.killfeedChannelId || null
      });

      const embed = new EmbedBuilder()
        .setTitle('💀 Killfeed aktiviert')
        .setDescription(
          [
            '✅ Killfeed wurde erfolgreich aktiviert.',
            '',
            `🎮 **Erkannter Service:** \`${service.id}\``,
            '',
            'Gespeichert wurden:',
            '• Nitrado Token',
            '• erkannte DayZ Service ID',
            '• Killfeed Aktivierung',
            '',
            'Der Bot nutzt automatisch den ersten gefundenen DayZ Server.'
          ].join('\n')
        )
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • Killfeed Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('KILLFEED_SETUP_ERROR:', error);

      const embed = new EmbedBuilder()
        .setTitle('❌ Killfeed Setup fehlgeschlagen')
        .setDescription(
          [
            'Die Verbindung zu Nitrado konnte nicht aufgebaut werden.',
            '',
            'Prüfe bitte:',
            '• ob der Token korrekt ist',
            '• ob der Token die Berechtigung **service** hat',
            '• ob Nitrado gerade erreichbar ist'
          ].join('\n')
        )
        .setColor(0xef4444)
        .setFooter({ text: 'Step Mod!Z BOT • Killfeed Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  }
};