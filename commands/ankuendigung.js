import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ankuendigung')
    .setDescription('Sendet eine schöne Ankündigung als Embed.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addStringOption((option) =>
      option
        .setName('titel')
        .setDescription('Titel der Ankündigung')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('text')
        .setDescription('Text der Ankündigung')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('footer')
        .setDescription('Optionaler Footer Text')
        .setRequired(false)
    ),

  async execute(interaction) {
    const title = interaction.options.getString('titel', true);
    const text = interaction.options.getString('text', true);
    const footer = interaction.options.getString('footer') || 'Step Mod!Z BOT • Ankündigung';

    const embed = new EmbedBuilder()
      .setTitle(`📢 ${title}`)
      .setDescription(text)
      .setColor(0x5865f2)
      .setFooter({ text: footer })
      .setTimestamp();

    await interaction.channel.send({
      embeds: [embed]
    });

    await interaction.reply({
      content: '✅ Ankündigung wurde gesendet.',
      ephemeral: true
    });
  }
};