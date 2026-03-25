import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('restart-erinnerung')
    .setDescription('Sendet eine Restart- oder Event-Erinnerung als Embed.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('titel')
        .setDescription('Titel der Erinnerung')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Text der Erinnerung')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('zeit')
        .setDescription('Optional: Uhrzeit oder Countdown, z. B. 19:00 Uhr oder 15 Minuten')
        .setRequired(false)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('titel', true);
    const text = interaction.options.getString('text', true);
    const time = interaction.options.getString('zeit');

    const embed = new EmbedBuilder()
      .setTitle(`⏰ ${title}`)
      .setDescription(
        [
          text,
          time ? '' : null,
          time ? `**Zeit:** ${time}` : null
        ].filter(Boolean).join('\n')
      )
      .setColor(0xf59e0b)
      .setFooter({ text: 'Step Mod!Z BOT • Erinnerung' })
      .setTimestamp();

    await interaction.channel.send({
      embeds: [embed]
    });

    await interaction.reply({
      content: '✅ Erinnerung wurde gesendet.',
      ephemeral: true
    });
  }
};