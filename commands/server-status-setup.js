import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server-status-setup')
    .setDescription('Hinweis zum neuen DayZ Token Setup'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('ℹ️ Server Status Setup geändert')
      .setDescription(
        [
          'Der Server Status wird nicht mehr separat eingerichtet.',
          '',
          'Nutze ab jetzt nur noch:',
          '`/killfeed-setup token:DEIN_TOKEN`',
          '',
          'Damit werden automatisch aktiviert:',
          '• 💀 Killfeed',
          '• 📡 Server Activity',
          '• 🧟 Server Status',
          '',
          'Es wird nur **ein einziger Nitrado Token** für alles benötigt.'
        ].join('\n')
      )
      .setColor(0x22c55e)
      .setFooter({ text: 'Step Mod!Z BOT • DayZ Setup' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
};