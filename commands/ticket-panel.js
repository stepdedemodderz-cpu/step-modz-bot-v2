import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
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
      const embed = new EmbedBuilder()
        .setTitle('❌ Ticket Setup fehlt')
        .setDescription(
          [
            'Für diesen Server wurde noch keine Ticket-Kategorie gesetzt.',
            '',
            'Nutze **`/setup`** und wähle:',
            '• eine **Ticket Kategorie**',
            '• optional eine **Ticket Support Rolle**',
            '',
            'Danach kannst du das Ticket Panel senden.'
          ].join('\n')
        )
        .setFooter({ text: 'Step Mod!Z BOT • Ticket Hilfe' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      return;
    }

    await interaction.channel.send({
      embeds: [buildTicketPanelEmbed()],
      components: [buildTicketPanelRow()]
    });

    await interaction.reply({
      content: '✅ Das Ticket-Panel wurde erfolgreich in diesem Channel gesendet.',
      ephemeral: true
    });
  }
};