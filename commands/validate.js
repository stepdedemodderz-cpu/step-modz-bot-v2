import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { t } from '../utils/i18n.js';
import {
  isAllowedSize,
  downloadAttachmentContent,
  validateJson,
  validateXml,
  validateByExtension
} from '../utils/validator.js';

export default {
  data: new SlashCommandBuilder()
    .setName('validate')
    .setDescription('Prüft eine JSON- oder XML-Datei auf Fehler.')
    .addAttachmentOption((option) =>
      option
        .setName('datei')
        .setDescription('Die Datei, die geprüft werden soll')
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName('typ')
        .setDescription('Dateityp oder automatische Erkennung')
        .setRequired(true)
        .addChoices(
          { name: 'Auto', value: 'auto' },
          { name: 'JSON', value: 'json' },
          { name: 'XML', value: 'xml' }
        )
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
    const mode = interaction.options.getString('typ', true);
    const attachment = interaction.options.getAttachment('datei', true);

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

      let result;
      let typeLabel = 'Unknown';

      if (mode === 'json') {
        if (!attachment.name?.toLowerCase().endsWith('.json')) {
          await interaction.editReply({
            content: `❌ ${t(language, 'invalidFileTypeJson')}`
          });
          return;
        }
        result = validateJson(content);
        typeLabel = 'JSON';
      } else if (mode === 'xml') {
        if (!attachment.name?.toLowerCase().endsWith('.xml')) {
          await interaction.editReply({
            content: `❌ ${t(language, 'invalidFileTypeXml')}`
          });
          return;
        }
        result = validateXml(content);
        typeLabel = 'XML';
      } else {
        result = validateByExtension(attachment.name, content);

        if (result.type === 'unknown') {
          await interaction.editReply({
            content: `❌ ${t(language, 'unsupportedExtension')}`
          });
          return;
        }

        typeLabel =
          result.type === 'json'
            ? t(language, 'dayzJsonLabel')
            : t(language, 'dayzXmlLabel');
      }

      if (result.valid) {
        const embed = new EmbedBuilder()
          .setTitle(t(language, 'validationSuccessTitle'))
          .addFields(
            { name: t(language, 'fileName'), value: attachment.name, inline: false },
            { name: t(language, 'fileType'), value: typeLabel, inline: true },
            { name: t(language, 'status'), value: t(language, 'valid'), inline: true }
          )
          .setColor(0x22c55e)
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

      const hint =
        result.type === 'json'
          ? t(language, 'jsonHint')
          : result.type === 'xml'
            ? t(language, 'xmlHint')
            : t(language, 'dayzHint');

      const embed = new EmbedBuilder()
        .setTitle(t(language, 'validationFailedTitle'))
        .addFields(
          { name: t(language, 'fileName'), value: attachment.name, inline: false },
          { name: t(language, 'fileType'), value: typeLabel, inline: true },
          { name: t(language, 'status'), value: t(language, 'invalid'), inline: true },
          { name: t(language, 'errorMessage'), value: result.error.message || t(language, 'unknownError'), inline: false },
          { name: t(language, 'lineColumn'), value: lineColumn, inline: true },
          { name: t(language, 'position'), value: position, inline: true },
          { name: t(language, 'hint'), value: hint, inline: false }
        )
        .setColor(0xef4444)
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