import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags
} from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

const UPDATE_SERVER_VERSION = 'v1.2';

export default {
  data: new SlashCommandBuilder()
    .setName('update-server')
    .setDescription('Aktualisiert den Server und ergänzt nur fehlende Elemente.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({
        content: '❌ Du brauchst Administrator-Rechte.',
        flags: MessageFlags.Ephemeral
      });
    }

    await interaction.reply({
      content: `🔄 Server wird überprüft und aktualisiert... (${UPDATE_SERVER_VERSION})`,
      flags: MessageFlags.Ephemeral
    });

    try {
      await runAutoSetup(interaction.guild, { mode: 'update' });

      await interaction.editReply({
        content: [
          `✅ **Update abgeschlossen!** (${UPDATE_SERVER_VERSION})`,
          '',
          'Es wurden nur fehlende Elemente ergänzt.',
          '👉 Bestehende Kanäle wurden nicht verändert.'
        ].join('\n')
      });
    } catch (error) {
      console.error('Update-Server Fehler:', error);

      await interaction.editReply({
        content: `❌ Fehler beim Update. Schau in die Konsole. (${UPDATE_SERVER_VERSION})`
      });
    }
  }
};