import { SlashCommandBuilder, MessageFlags, PermissionFlagsBits } from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

const data = new SlashCommandBuilder()
  .setName('update-server')
  .setDescription('Aktualisiert den Server und ergänzt nur fehlende Elemente.')
  .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

async function execute(interaction) {
  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
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
    await runAutoSetup(interaction.guild, { mode: 'update' });

    await interaction.editReply({
      content: '✅ Update abgeschlossen. Es wurden nur fehlende Elemente ergänzt.'
    });
  } catch (error) {
    console.error('Update-Server Fehler:', error);

    await interaction.editReply({
      content: '❌ Fehler beim Update. Schau in die Konsole.'
    });
  }
}

export default {
  data,
  execute
};