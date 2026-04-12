import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { getFirstDayZService } from '../utils/nitrado.js';
import { updateServerStatusMessage } from '../utils/serverStatus.js';

function findChannel(guild, names) {
  return guild.channels.cache.find(c =>
    names.some(name => c.name.toLowerCase().includes(name))
  );
}

export default {
  data: new SlashCommandBuilder()
    .setName('killfeed-setup')
    .setDescription('Aktiviert ALLE DayZ Systeme mit einem Token')
    .addStringOption(option =>
      option.setName('token')
        .setDescription('Nitrado Token')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const token = interaction.options.getString('token', true);

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    // 🔍 CHANNELS ROBUST FINDEN
    const killfeedChannel = findChannel(interaction.guild, ['killfeed']);
    const activityChannel = findChannel(interaction.guild, ['server-activity']);
    const statusChannel = findChannel(interaction.guild, ['server-status']);

    if (!killfeedChannel) {
      return interaction.editReply({
        content: '❌ Killfeed Kanal fehlt → nutze zuerst /update-server'
      });
    }

    try {
      const service = await getFirstDayZService(token);

      if (!service?.id) {
        return interaction.editReply({
          content: '❌ Kein DayZ Server gefunden'
        });
      }

      // 🔥 ALLES AUF EINMAL SPEICHERN
      setGuildConfig(interaction.guild.id, {
        ...config,
        nitradoToken: token,
        nitradoServiceId: String(service.id),

        killfeedEnabled: true,
        killfeedChannelId: killfeedChannel.id,

        serverActivityChannelId: activityChannel?.id || null,
        serverStatusChannelId: statusChannel?.id || null
      });

      // 🔥 STATUS AUTOMATISCH STARTEN
      if (statusChannel) {
        await updateServerStatusMessage(interaction.guild).catch(() => null);
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ Alles aktiviert')
        .setDescription([
          `🎮 Service: ${service.id}`,
          `💀 Killfeed: ${killfeedChannel}`,
          activityChannel ? `📡 Activity: ${activityChannel}` : '⚠️ Activity Kanal fehlt',
          statusChannel ? `🧟 Status: ${statusChannel}` : '⚠️ Status Kanal fehlt',
          '',
          '👉 EIN TOKEN für ALLES aktiviert'
        ].join('\n'))
        .setColor(0x22c55e);

      await interaction.editReply({ embeds: [embed] });

    } catch (err) {
      console.error(err);

      await interaction.editReply({
        content: '❌ Fehler beim Setup'
      });
    }
  }
};