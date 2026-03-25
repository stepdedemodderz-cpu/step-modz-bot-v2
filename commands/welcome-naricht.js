import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('welcome-nachricht')
    .setDescription('Speichert die Welcome-Nachricht.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Deine neue Welcome-Nachricht')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const text = interaction.options.getString('text', true);

    setGuildConfig(interaction.guild.id, {
      ...config,
      welcomeMessage: text
    });

    await interaction.reply({
      content: '✅ Welcome-Nachricht gespeichert. Nutze jetzt `/setup-welcome`, um sie zu senden.',
      ephemeral: true
    });
  }
};