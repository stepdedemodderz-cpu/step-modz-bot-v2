import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { buildVerifyEmbed, buildVerifyRow } from '../utils/verify.js';
import { getGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('verify-panel')
    .setDescription('Sendet das Verify Panel in den aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.verifyRoleId) {
      await interaction.reply({
        content: '❌ Bitte zuerst /setup ausführen und eine Verify-Rolle setzen.',
        ephemeral: true
      });
      return;
    }

    await interaction.channel.send({
      embeds: [buildVerifyEmbed()],
      components: [buildVerifyRow()]
    });

    await interaction.reply({
      content: '✅ Verify Panel wurde gesendet.',
      ephemeral: true
    });
  }
};
