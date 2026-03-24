import { Events } from 'discord.js';
import { verifyMember } from '../utils/verify.js';
import { createTicketChannel } from '../utils/tickets.js';
import {
  buildWhitelistModal,
  createWhitelistChannel,
  handleWhitelistDecision
} from '../utils/whitelist.js';

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        const command = client.commands.get(interaction.commandName);
        if (!command) return;

        await command.execute(interaction, client);
        return;
      }

      if (interaction.isButton()) {
        if (interaction.customId === 'stepmodz_verify_button') {
          if (!interaction.guild) {
            await interaction.reply({
              content: '❌ Diese Verifizierung funktioniert nur auf einem Server.',
              ephemeral: true
            });
            return;
          }

          const member = await interaction.guild.members.fetch(interaction.user.id);
          const result = await verifyMember(member);

          await interaction.reply({
            content: result.alreadyVerified
              ? '✅ Du bist bereits verifiziert.'
              : '✅ Du wurdest erfolgreich verifiziert. Willkommen auf dem Server!',
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_open_ticket') {
          const result = await createTicketChannel(interaction);

          await interaction.reply({
            content: result.exists
              ? `ℹ️ Du hast bereits ein Ticket: ${result.channel}`
              : `✅ Dein Ticket wurde erstellt: ${result.channel}`,
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_close_ticket') {
          await interaction.reply({
            content: '🔒 Ticket wird geschlossen...',
            ephemeral: true
          });

          setTimeout(async () => {
            await interaction.channel.delete().catch(() => null);
          }, 3000);

          return;
        }

        if (interaction.customId === 'stepmodz_open_whitelist') {
          await interaction.showModal(buildWhitelistModal());
          return;
        }

        if (interaction.customId === 'stepmodz_whitelist_accept') {
          await handleWhitelistDecision(interaction, true);
          await interaction.reply({
            content: '✅ Bewerbung angenommen.',
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_whitelist_deny') {
          await handleWhitelistDecision(interaction, false);
          await interaction.reply({
            content: '❌ Bewerbung abgelehnt.',
            ephemeral: true
          });
          return;
        }
      }

      if (interaction.isModalSubmit()) {
        if (interaction.customId !== 'stepmodz_whitelist_modal') return;

        const data = {
          gamertag: interaction.fields.getTextInputValue('gamertag'),
          age: interaction.fields.getTextInputValue('age'),
          experience: interaction.fields.getTextInputValue('experience'),
          reason: interaction.fields.getTextInputValue('reason')
        };

        const channel = await createWhitelistChannel(interaction, data);

        await interaction.reply({
          content: `✅ Deine Whitelist-Bewerbung wurde gesendet: ${channel}`,
          ephemeral: true
        });
      }
    } catch (error) {
      console.error('Fehler bei InteractionCreate:', error);

      const message = {
        content: '❌ Es ist ein Fehler aufgetreten. Prüfe Rollen, Kategorien, Rechte und das Setup.',
        ephemeral: true
      };

      if (interaction.deferred || interaction.replied) {
        await interaction.followUp(message).catch(() => null);
      } else {
        await interaction.reply(message).catch(() => null);
      }
    }
  }
};
