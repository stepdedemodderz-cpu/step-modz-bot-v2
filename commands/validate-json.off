import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { t } from '../utils/i18n.js';
import {
  isAllowedSize,
  downloadAttachmentContent,
  validateJson
} from '../utils/validator.js';

export default {
  data: new SlashCommandBuilder()
    .setName('validate-json')
    .setDescription('Prüft eine JSON-Datei auf Fehler.')
    .addAttachmentOption((option) =>
      option
        .setName('datei')
        .setDescription('Die JSON-Datei, die geprüft werden soll')
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

    if (!attachment.name?.toLowerCase().endsWith('.json')) {
      await interaction.reply({
        content: `❌ ${t(language, 'invalidFileTypeJson')}`,
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
      const result = validateJson(content);

      if (result.valid) {
        const embed = new EmbedBuilder()
          .setTitle(t(language, 'validationSuccessTitle'))
          .addFields(
            { name: t(language, 'fileName'), value: attachment.name, inline: false },
            { name: t(language, 'fileType'), value: 'JSON', inline: true },
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
          { name: t(language, 'fileType'), value: 'JSON', inline: true },
          { name: t(language, 'status'), value: t(language, 'invalid'), inline: true },
          { name: t(language, 'errorMessage'), value: result.error.message || t(language, 'unknownError'), inline: false },
          { name: t(language, 'lineColumn'), value: lineColumn, inline: true },
          { name: t(language, 'position'), value: position, inline: true },
          { name: t(language, 'hint'), value: t(language, 'jsonHint'), inline: false }
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