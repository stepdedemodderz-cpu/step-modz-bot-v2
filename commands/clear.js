import {
  SlashCommandBuilder,
  PermissionFlagsBits
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('clear')
    .setDescription('Löscht mehrere Nachrichten im aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addIntegerOption((option) =>
      option
        .setName('anzahl')
        .setDescription('Wie viele Nachrichten gelöscht werden sollen (1-100)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(100)
    ),

  async execute(interaction) {
    const amount = interaction.options.getInteger('anzahl', true);

    try {
      const deleted = await interaction.channel.bulkDelete(amount, true);

      await interaction.reply({
        content: `✅ ${deleted.size} Nachrichten wurden gelöscht.`,
        ephemeral: true
      });
    } catch (error) {
      console.error('CLEAR ERROR:', error);

      await interaction.reply({
        content: '❌ Fehler beim Löschen der Nachrichten.',
        ephemeral: true
      });
    }
  }
};