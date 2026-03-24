import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { t } from '../utils/i18n.js';
import {
  isAllowedSize,
  downloadAttachmentContent,
  validateByExtension
} from '../utils/validator.js';

export default {
  data: new SlashCommandBuilder()
    .setName('validate-dayz')
    .setDescription('Prüft eine DayZ JSON- oder XML-Datei auf Fehler.')
    .addAttachmentOption((option) =>
      option
        .setName('datei')
        .setDescription('Die DayZ Datei, die geprüft werden soll')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('sprache')
        .setDescription('Sprache der Ausgabe')
        .setRequired(false)
        .addChoices(
          { name: 'Deutsch', value: 'de' },
          { name: 'English', value: 'en' }
        )
    ),

  async execute(interaction) {
    const language = interaction.options.getString('sprache') || 'de';
    const attachment = interaction.options.getAttachment('datei', true);

    const lowerName = attachment.name?.toLowerCase() || '';

    if (!lowerName.endsWith('.json') && !lowerName.endsWith('.xml')) {
      await interaction.reply({
        content: `❌ ${t(language, 'invalidFileTypeDayz')}`,
        ephemeral: true
      });
      return;
    }

    if (!isAllowedSize(attachment.size)) {
      await interaction.reply({
        content: `❌ ${t(language, 'fileTooLarge')}`,
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    try {
      const content = await downloadAttachmentContent(attachment.url);
      const result = validateByExtension(attachment.name, content);

      if (result.type === 'unknown') {
        await interaction.editReply({
          content: `❌ ${t(language, 'unsupportedExtension')}`
        });
        return;
      }

      const typeLabel = result.type === 'json'
        ? t(language, 'dayzJsonLabel')
        : t(language, 'dayzXmlLabel');

      if (result.valid) {
        const embed = new EmbedBuilder()
          .setTitle(t(language, 'validationSuccessTitle'))
          .addFields(
            { name: t(language, 'fileName'), value: attachment.name, inline: false },
            { name: t(language, 'fileType'), value: typeLabel, inline: true },
            { name: t(language, 'status'), value: t(language, 'valid'), inline: true }
          )
          .setFooter({ text: t(language, 'checkedBy') })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      const lineColumn =
        result.error.line && result.error.column
          ? `${result.error.line} / ${result.error.column}`
          : '-';

      const position =
        result.error.position !== null && result.error.position !== undefined
          ? String(result.error.position)
          : '-';

      const embed = new EmbedBuilder()
        .setTitle(t(language, 'validationFailedTitle'))
        .addFields(
          { name: t(language, 'fileName'), value: attachment.name, inline: false },
          { name: t(language, 'fileType'), value: typeLabel, inline: true },
          { name: t(language, 'status'), value: t(language, 'invalid'), inline: true },
          { name: t(language, 'errorMessage'), value: result.error.message || t(language, 'unknownError'), inline: false },
          { name: t(language, 'lineColumn'), value: lineColumn, inline: true },
          { name: t(language, 'position'), value: position, inline: true },
          { name: t(language, 'hint'), value: t(language, 'dayzHint'), inline: false }
        )
        .setFooter({ text: t(language, 'checkedBy') })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch {
      await interaction.editReply({
        content: `❌ ${t(language, 'downloadFailed')}`
      });
    }
  }
};