import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { updateServerStatusMessage } from '../utils/serverStatus.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server-status-refresh')
    .setDescription('Aktualisiert die Live Status Nachricht sofort'),

  async execute(interaction) {
    const result = await updateServerStatusMessage(interaction.guild);

    const embed = new EmbedBuilder()
      .setTitle('🔄 Server Status Refresh')
      .setDescription(
        result.ok
          ? '✅ Die Status-Nachricht wurde aktualisiert.'
          : '❌ Der Status konnte nicht aktualisiert werden. Prüfe zuerst `/server-status-setup`.'
      )
      .setColor(result.ok ? 0x22c55e : 0xef4444)
      .setFooter({ text: 'Step Mod!Z BOT • Live Status' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};