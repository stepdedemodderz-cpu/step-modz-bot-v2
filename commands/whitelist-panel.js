import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { buildWhitelistPanelRow } from '../utils/whitelist.js';
import { getGuildConfig } from '../utils/config.js';

const DEFAULT_WHITELIST_MESSAGE = [
  'Du möchtest dich für die Whitelist bewerben?',
  '',
  'Klicke auf den Button unten und fülle das Formular aus.'
].join('\n');

export default {
  data: new SlashCommandBuilder()
    .setName('whitelist-panel')
    .setDescription('Sendet das Whitelist Panel in den aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.whitelistCategoryId) {
      await interaction.reply({
        content: '❌ Es wurde noch keine Whitelist-Kategorie gesetzt. Nutze /setup oder Schnell Einrichtung.',
        ephemeral: true
      });
      return;
    }

    const text = config.whitelistPanelMessage || DEFAULT_WHITELIST_MESSAGE;

    await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('📋 Whitelist Bewerbung')
          .setDescription(text)
          .setColor(0x22c55e)
          .setFooter({ text: 'Step Mod!Z BOT • Whitelist Panel' })
          .setTimestamp()
      ],
      components: [buildWhitelistPanelRow()]
    });

    await interaction.reply({
      content: '✅ Das Whitelist-Panel wurde erfolgreich gesendet.',
      ephemeral: true
    });
  }
};