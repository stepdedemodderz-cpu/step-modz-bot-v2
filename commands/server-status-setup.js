import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { getFirstDayZService } from '../utils/nitrado.js';
import { updateServerStatusMessage } from '../utils/serverStatus.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server-status-setup')
    .setDescription('Aktiviert den DayZ Server Status über Nitrado Token')
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('Optional: Nitrado Token')
        .setRequired(false)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const token = interaction.options.getString('token') || config.nitradoToken || null;

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const statusChannel = interaction.guild.channels.cache.find(
      (c) => c.name === '📡 server-status' || c.name === 'server-status'
    );

    if (!statusChannel) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Server Status Kanal fehlt')
        .setDescription(
          [
            'Der Kanal **📡 server-status** wurde nicht gefunden.',
            '',
            'Nutze zuerst:',
            '`/update-server`'
          ].join('\n')
        )
        .setColor(0xef4444)
        .setFooter({ text: 'Step Mod!Z BOT • Server Status Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    if (!token) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Kein Token vorhanden')
        .setDescription(
          [
            'Es wurde kein Nitrado Token gefunden.',
            '',
            'Nutze entweder:',
            '`/killfeed-setup token:DEIN_TOKEN`',
            '',
            'oder:',
            '`/server-status-setup token:DEIN_TOKEN`'
          ].join('\n')
        )
        .setColor(0xef4444)
        .setFooter({ text: 'Step Mod!Z BOT • Server Status Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      const service = await getFirstDayZService(token);

      if (!service?.id) {
        const embed = new EmbedBuilder()
          .setTitle('❌ Kein DayZ Server gefunden')
          .setDescription(
            [
              'Mit diesem Token konnte kein DayZ-Service gefunden werden.',
              '',
              'Prüfe Token und Berechtigung **service**.'
            ].join('\n')
          )
          .setColor(0xef4444)
          .setFooter({ text: 'Step Mod!Z BOT • Server Status Setup' })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      setGuildConfig(interaction.guild.id, {
        ...config,
        dayzConnectionMode: 'nitrado',
        nitradoToken: token,
        nitradoServiceId: String(service.id),
        serverStatusChannelId: statusChannel.id
      });

      const result = await updateServerStatusMessage(interaction.guild).catch(() => ({ ok: false }));

      const embed = new EmbedBuilder()
        .setTitle('🧟 Server Status aktiviert')
        .setDescription(
          [
            `🎮 **Erkannter Service:** \`${service.id}\``,
            `📡 **Status Kanal:** <#${statusChannel.id}>`,
            '',
            result?.ok
              ? '✅ Die Status-Nachricht wurde erstellt oder aktualisiert.'
              : '⚠️ Die Daten wurden gespeichert, aber die Status-Nachricht konnte noch nicht aktualisiert werden.'
          ].join('\n')
        )
        .setColor(result?.ok ? 0x22c55e : 0xf59e0b)
        .setFooter({ text: 'Step Mod!Z BOT • Server Status Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('SERVER_STATUS_SETUP_ERROR:', error);

      const embed = new EmbedBuilder()
        .setTitle('❌ Server Status Setup fehlgeschlagen')
        .setDescription(
          [
            'Die Verbindung zu Nitrado konnte nicht aufgebaut werden.',
            '',
            'Prüfe bitte deinen Token.'
          ].join('\n')
        )
        .setColor(0xef4444)
        .setFooter({ text: 'Step Mod!Z BOT • Server Status Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  }
};