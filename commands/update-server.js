import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

export default {
  data: new SlashCommandBuilder()
    .setName('update-server')
    .setDescription('Installiert nur neue fehlende Tools und Bereiche nach.'),

  async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        content: '❌ Nur der Server-Besitzer darf das.',
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    try {
      const result = await runAutoSetup(interaction.guild, { mode: 'update' });

      if (!result.createdAnything) {
        await interaction.editReply({
          content: '✅ Du hast das neueste Update.'
        });
        return;
      }

      await interaction.editReply({
        content:
          '🆕 Neue Tools wurden installiert:\n\n' +
          result.createdList.map((x) => `• ${x}`).join('\n')
      });
    } catch (error) {
      console.error('Update-Server Fehler:', error);

      await interaction.editReply({
        content: '❌ Fehler beim Update. Schau in die Konsole.'
      });
    }
  }
};