import { SlashCommandBuilder, MessageFlags } from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

export const data = new SlashCommandBuilder()
  .setName('update-server')
  .setDescription('Aktualisiert den Server (fügt nur fehlende Tools/Kanäle hinzu)');

export async function execute(interaction) {
  // Nur Admins
  if (!interaction.member.permissions.has('Administrator')) {
    return interaction.reply({
      content: '❌ Du brauchst Administrator-Rechte.',
      flags: MessageFlags.Ephemeral
    });
  }

  await interaction.reply({
    content: '🔄 Server wird überprüft und aktualisiert...',
    flags: MessageFlags.Ephemeral
  });

  try {
    const result = await runAutoSetup(interaction.guild, {
      mode: 'update'
    });

    await interaction.editReply({
      content: [
        '✅ **Update abgeschlossen!**',
        '',
        'Es wurden nur fehlende Elemente ergänzt.',
        '',
        '👉 Bestehende Kanäle wurden NICHT verändert.'
      ].join('\n')
    });

  } catch (error) {
    console.error('Update-Server Fehler:', error);

    await interaction.editReply({
      content: '❌ Fehler beim Update. Schau in die Konsole.'
    });
  }
}