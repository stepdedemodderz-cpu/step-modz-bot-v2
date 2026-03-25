import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('event-erinnerung')
    .setDescription('Sendet eine Event-Erinnerung als Embed.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('eventname')
        .setDescription('Name des Events')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('beschreibung')
        .setDescription('Beschreibung des Events')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('zeit')
        .setDescription('Wann startet das Event?')
        .setRequired(true)
    ),

  async execute(interaction) {
    const eventName = interaction.options.getString('eventname', true);
    const description = interaction.options.getString('beschreibung', true);
    const time = interaction.options.getString('zeit', true);

    const embed = new EmbedBuilder()
      .setTitle(`🎉 ${eventName}`)
      .setDescription(
        [
          description,
          '',
          `**Zeit:** ${time}`
        ].join('\n')
      )
      .setColor(0x8b5cf6)
      .setFooter({ text: 'Step Mod!Z BOT • Event Erinnerung' })
      .setTimestamp();

    await interaction.channel.send({
      embeds: [embed]
    });

    await interaction.reply({
      content: '✅ Event-Erinnerung wurde gesendet.',
      ephemeral: true
    });
  }
};