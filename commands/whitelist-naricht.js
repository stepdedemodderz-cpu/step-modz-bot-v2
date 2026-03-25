import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('whitelist-nachricht')
    .setDescription('Speichert die Whitelist-Nachricht für das Whitelist-Panel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Deine neue Whitelist-Nachricht')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const text = interaction.options.getString('text', true);

    setGuildConfig(interaction.guild.id, {
      ...config,
      whitelistPanelMessage: text
    });

    await interaction.reply({
      content: '✅ Whitelist-Nachricht gespeichert. Nutze jetzt `/whitelist-panel`, um das neue Panel zu senden.',
      ephemeral: true
    });
  }
};