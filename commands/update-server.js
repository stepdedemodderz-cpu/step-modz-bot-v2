import { SlashCommandBuilder } from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

export default {
  data: new SlashCommandBuilder()
    .setName('update-server')
    .setDescription('Installiert nur neue fehlende Tools und Bereiche nach.'),

  async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        content: '❌ Nur der Server-Besitzer darf das.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const result = await runAutoSetup(interaction.guild, { mode: 'update' });

    if (!result.createdAnything) {
      await interaction.editReply({
        content: '✅ Bot hat bereits das neueste Update. Es wurden keine neuen Tools gefunden.'
      });
      return;
    }

    await interaction.editReply({
      content:
        `✅ Server wurde aktualisiert.\n` +
        `Es wurden nur neue fehlende Tools ergänzt.\n\n` +
        `Neu erstellt: ${result.createdList.join(', ')}`
    });
  }
};