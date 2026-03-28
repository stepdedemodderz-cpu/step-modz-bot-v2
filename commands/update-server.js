import { SlashCommandBuilder } from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

export default {
  data: new SlashCommandBuilder()
    .setName('update-server')
    .setDescription('Installiert nur neue Tools und fehlende Bot-Bereiche nach.'),

  async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        content: '❌ Nur der Server-Besitzer darf das.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    await runAutoSetup(interaction.guild, { mode: 'update' });

    await interaction.editReply({
      content: '✅ Server wurde aktualisiert. Nur fehlende neue Tools wurden ergänzt.'
    });
  }
};