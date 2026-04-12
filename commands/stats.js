import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getTop } from '../utils/stats.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stats')
    .setDescription('Zeigt die Top Spieler (Kills)'),

  async execute(interaction) {
    const guildId = interaction.guild.id;
    const top = getTop(guildId);

    if (!top.length) {
      return interaction.reply({
        content: '❌ Noch keine Stats vorhanden',
        ephemeral: true
      });
    }

    const list = top.map((player, index) => {
      const name = player[0];
      const stats = player[1];

      return `**${index + 1}. ${name}**\n💀 Kills: ${stats.kills} | ☠️ Tode: ${stats.deaths}`;
    });

    const embed = new EmbedBuilder()
      .setTitle('🏆 Top Spieler')
      .setDescription(list.join('\n\n'))
      .setColor(0x22c55e)
      .setFooter({ text: 'Step Mod!Z BOT • Stats' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed]
    });
  }
};