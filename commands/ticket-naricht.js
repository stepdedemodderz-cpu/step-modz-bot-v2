import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket-nachricht')
    .setDescription('Speichert die Ticket-Nachricht für das Ticket-Panel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Deine neue Ticket-Nachricht')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const text = interaction.options.getString('text', true);

    setGuildConfig(interaction.guild.id, {
      ...config,
      ticketPanelMessage: text
    });

    await interaction.reply({
      content: '✅ Ticket-Nachricht gespeichert. Nutze jetzt `/ticket-panel`, um das neue Panel zu senden.',
      ephemeral: true
    });
  }
};