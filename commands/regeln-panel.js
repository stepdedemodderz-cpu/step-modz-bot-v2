import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('regeln-panel')
    .setDescription('Sendet ein Regel-Panel in den aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📜 Server Regeln')
      .setDescription(
        [
          'Bitte lies dir die wichtigsten Regeln durch.',
          '',
          '**Beispiel Regeln:**',
          '• Respektvoller Umgang',
          '• Kein Spam',
          '• Keine Beleidigungen',
          '• Kein Cheating / Exploiting',
          '• Halte dich an die Server-Regeln',
          '',
          'Mit dem Button unten kannst du bestätigen, dass du die Regeln gelesen hast.'
        ].join('\n')
      )
      .setColor(0x5865f2)
      .setFooter({ text: 'Step Mod!Z BOT • Regel Panel' })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('stepmodz_rules_accept')
        .setLabel('Regeln akzeptieren')
        .setStyle(ButtonStyle.Success)
    );

    await interaction.channel.send({
      embeds: [embed],
      components: [row]
    });

    await interaction.reply({
      content: '✅ Regel-Panel wurde gesendet.',
      ephemeral: true
    });
  }
};