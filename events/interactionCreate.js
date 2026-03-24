import { Events, EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { t } from '../utils/i18n.js';

export default {
  name: Events.InteractionCreate,
  once: false,

  async execute(interaction, client) {
    try {
      if (interaction.isChatInputCommand()) {
        console.log(`Befehl erhalten: ${interaction.commandName}`);
        const command = client.commands.get(interaction.commandName);

        if (!command) {
          await interaction.reply({
            content: `❌ Command nicht gefunden: ${interaction.commandName}`,
            ephemeral: true
          });
          return;
        }

        await command.execute(interaction, client);
        return;
      }

      if (interaction.isButton()) {
        const config = getGuildConfig(interaction.guild.id);
        let language = config.language || 'de';

        if (interaction.customId === 'stepmodz_lang_de') {
          setGuildConfig(interaction.guild.id, { language: 'de' });
          await interaction.reply({
            content: t('de', 'languageSetGerman'),
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_lang_en') {
          setGuildConfig(interaction.guild.id, { language: 'en' });
          await interaction.reply({
            content: t('en', 'languageSetEnglish'),
            ephemeral: true
          });
          return;
        }

        language = getGuildConfig(interaction.guild.id).language || language;

        if (interaction.customId === 'stepmodz_open_info') {
          await interaction.reply({
            content: t(language, 'infoButtonReply'),
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_setup_help') {
          const embed = new EmbedBuilder()
            .setTitle(t(language, 'setupHelpTitle'))
            .setDescription(t(language, 'setupHelpDescription'))
            .setColor(0x22c55e)
            .setFooter({ text: t(language, 'checkedBy') })
            .setTimestamp();

          await interaction.reply({
            embeds: [embed],
            ephemeral: true
          });
          return;
        }

        if (interaction.customId === 'stepmodz_validator_help') {
          await interaction.reply({
            content: t(language, 'validatorHelp'),
            ephemeral: true
          });
          return;
        }

        return;
      }
    } catch (error) {
      console.error('InteractionCreate Fehler:', error);

      try {
        if (interaction.replied || interaction.deferred) {
          await interaction.followUp({
            content: '❌ Fehler beim Ausführen des Commands.',
            ephemeral: true
          });
        } else {
          await interaction.reply({
            content: '❌ Fehler beim Ausführen des Commands.',
            ephemeral: true
          });
        }
      } catch (replyError) {
        console.error('Fehler beim Antworten auf Interaction:', replyError);
      }
    }
  }
};