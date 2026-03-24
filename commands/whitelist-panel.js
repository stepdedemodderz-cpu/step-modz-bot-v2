import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
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
      const embed = new EmbedBuilder()
        .setTitle('❌ Whitelist Setup fehlt')
        .setDescription(
          [
            'Für diesen Server wurde noch keine Whitelist-Kategorie gesetzt.',
            '',
            'Nutze **`/setup`** und wähle:',
            '• eine **Whitelist Kategorie**',
            '• optional eine **Whitelist Review Rolle**',
            '• optional eine **Whitelist Approved Rolle**',
            '',
            'Danach kannst du das Whitelist Panel senden.'
          ].join('\n')
        )
        .setFooter({ text: 'Step Mod!Z BOT • Whitelist Hilfe' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      return;
    }

    await interaction.channel.send({
      embeds: [buildWhitelistPanelEmbed()],
      components: [buildWhitelistPanelRow()]
    });

    await interaction.reply({
      content: '✅ Das Whitelist-Panel wurde erfolgreich in diesem Channel gesendet.',
      ephemeral: true
    });
  }
};