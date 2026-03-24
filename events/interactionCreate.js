import { Events } from 'discord.js';

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction, client) {
    try {
      if (!interaction.isChatInputCommand()) return;

      console.log(`Command received: ${interaction.commandName}`);

      if (interaction.commandName === 'ping') {
        await interaction.reply({
          content: '🏓 Step Mod!Z BOT ist online.',
          ephemeral: true
        });
        return;
      }

      const command = client.commands.get(interaction.commandName);

      if (!command) {
        await interaction.reply({
          content: `❌ Command nicht gefunden: ${interaction.commandName}`,
          ephemeral: true
        });
        return;
      }

      await command.execute(interaction, client);
    } catch (error) {
      console.error('InteractionCreate Fehler:', error);

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ Fehler beim Ausführen des Commands.',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: '❌ Fehler beim Ausführen des Commands.',
            ephemeral: true
          });
        }
      } catch (replyError) {
        console.error('Fehler beim Antworten auf Interaction:', replyError);
      }
    }
  }
};