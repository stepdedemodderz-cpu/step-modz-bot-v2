import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Zeigt an, ob Step Mod!Z BOT online ist.'),

  async execute(interaction) {
    await interaction.reply({
      content: '🏓 Step Mod!Z BOT ist online.',
      ephemeral: true
    });
  }
};
