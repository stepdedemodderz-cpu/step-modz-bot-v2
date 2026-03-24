import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
import { buildTicketPanelEmbed, buildTicketPanelRow } from '../utils/tickets.js';
import { getGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Sendet das Ticket Panel in den aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.ticketCategoryId) {
      await interaction.reply({
        content: '❌ Bitte zuerst /setup ausführen und eine Ticket-Kategorie setzen.',
        ephemeral: true
      });
      return;
    }

    await interaction.channel.send({
      embeds: [buildTicketPanelEmbed()],
      components: [buildTicketPanelRow()]
    });

    await interaction.reply({
      content: '✅ Ticket Panel wurde gesendet.',
      ephemeral: true
    });
  }
};
