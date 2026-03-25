import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('verify-nachricht')
    .setDescription('Speichert die Verify-Nachricht für das Verify Panel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Deine neue Verify-Nachricht')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const text = interaction.options.getString('text', true);

    setGuildConfig(interaction.guild.id, {
      ...config,
      verifyPanelMessage: text
    });

    await interaction.reply({
      content: '✅ Verify-Nachricht gespeichert. Nutze jetzt `/verify-panel`, um das neue Verify Panel zu senden.',
      ephemeral: true
    });
  }
};