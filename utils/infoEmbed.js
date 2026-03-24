import { EmbedBuilder } from 'discord.js';
import { t } from './i18n.js';

export function buildInfoEmbed(language = 'de') {
  return new EmbedBuilder()
    .setTitle(t(language, 'infoTitle'))
    .setColor(0x22c55e)
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
}