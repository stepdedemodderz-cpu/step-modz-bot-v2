import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { buildTicketPanelRow } from '../utils/tickets.js';
import { getGuildConfig } from '../utils/config.js';

const DEFAULT_TICKET_MESSAGE = [
  'Benötigst du Hilfe von einem Admin oder Moderator?',
  '',
  'Klicke auf den Button unten, um ein privates Ticket zu öffnen.'
].join('\n');

export default {
  data: new SlashCommandBuilder()
    .setName('ticket-panel')
    .setDescription('Sendet das Ticket Panel in den aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.ticketCategoryId) {
      await interaction.reply({
        content: '❌ Es wurde noch keine Ticket-Kategorie gesetzt. Nutze /setup oder Schnell Einrichtung.',
        ephemeral: true
      });
      return;
    }

    const text = config.ticketPanelMessage || DEFAULT_TICKET_MESSAGE;

    await interaction.channel.send({
      embeds: [
        new EmbedBuilder()
          .setTitle('🎫 Support Tickets')
          .setDescription(text)
          .setColor(0x22c55e)
          .setFooter({ text: 'Step Mod!Z BOT • Ticket Panel' })
          .setTimestamp()
      ],
      components: [buildTicketPanelRow()]
    });

    await interaction.reply({
      content: '✅ Das Ticket-Panel wurde erfolgreich gesendet.',
      ephemeral: true
    });
  }
};