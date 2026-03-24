import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getGuildConfig } from '../utils/config.js';
import { t } from '../utils/i18n.js';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Zeigt eine Übersicht über alle Funktionen und die Einrichtung'),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);
    const language = config.language || 'de';

    const embed = new EmbedBuilder()
      .setTitle(t(language, 'infoTitle'))
      .setColor(0x22c55e)
      .setImage('https://cdn.discordapp.com/attachments/1468693516942180372/1485943376179237026/25882009-b8b1-4350-bdaa-9652c0bfead3.png?ex=69c3b41c&is=69c2629c&hm=06fb2176062774d470971c3fdd5c9d03b262e02e860c1b491e669c424dc96547&')
      .setDescription(t(language, 'infoDescription'))
      .addFields(
        {
          name: t(language, 'infoQuickstartTitle'),
          value: t(language, 'infoQuickstartValue'),
          inline: false
        },
        {
          name: t(language, 'infoVerifyTitle'),
          value: t(language, 'infoVerifyValue'),
          inline: false
        },
        {
          name: t(language, 'infoWelcomeTitle'),
          value: t(language, 'infoWelcomeValue'),
          inline: false
        },
        {
          name: t(language, 'infoTicketTitle'),
          value: t(language, 'infoTicketValue'),
          inline: false
        },
        {
          name: t(language, 'infoWhitelistTitle'),
          value: t(language, 'infoWhitelistValue'),
          inline: false
        },
        {
          name: t(language, 'infoValidatorTitle'),
          value: t(language, 'infoValidatorValue'),
          inline: false
        },
        {
          name: t(language, 'infoCommandsTitle'),
          value: t(language, 'infoCommandsValue'),
          inline: false
        }
      )
      .setFooter({ text: t(language, 'checkedBy') })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};