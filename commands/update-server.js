import { SlashCommandBuilder } from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

export default {
  data: new SlashCommandBuilder()
    .setName('update-server')
    .setDescription('Installiert neue Tools & Updates vom Bot'),

  async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      return interaction.reply({
        content: '❌ Nur der Server Besitzer darf das.',
        ephemeral: true
      });
    }

    await interaction.deferReply({ ephemeral: true });

    await runAutoSetup(interaction.guild);

    await interaction.editReply({
      content: '✅ Server wurde aktualisiert und neue Tools installiert.'
    });
  }
};