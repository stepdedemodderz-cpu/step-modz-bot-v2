import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { buildWhitelistPanelEmbed, buildWhitelistPanelRow } from '../utils/whitelist.js';
import { getGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('whitelist-panel')
    .setDescription('Sendet das Whitelist Panel in den aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.whitelistCategoryId) {
      await interaction.reply({
        content: '❌ Bitte zuerst /setup ausführen und eine Whitelist-Kategorie setzen.',
        ephemeral: true
      });
      return;
    }

    await interaction.channel.send({
      embeds: [buildWhitelistPanelEmbed()],
      components: [buildWhitelistPanelRow()]
    });

    await interaction.reply({
      content: '✅ Whitelist Panel wurde gesendet.',
      ephemeral: true
    });
  }
};
