import { SlashCommandBuilder } from 'discord.js';
import { getGuildConfig } from '../utils/config.js';
import { buildInfoEmbed } from '../utils/infoEmbed.js';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Zeigt eine Übersicht über alle Funktionen und die Einrichtung'),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);
    const language = config.language || 'de';

    await interaction.reply({
      embeds: [buildInfoEmbed(language)],
      ephemeral: true
    });
  }
};