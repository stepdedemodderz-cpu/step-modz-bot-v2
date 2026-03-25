import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { buildVerifyEmbed, buildVerifyRow } from '../utils/verify.js';
import { getGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('verify-panel')
    .setDescription('Sendet das Verify Panel in den aktuellen Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.verifyRoleId) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Verify Setup fehlt')
        .setDescription(
          [
            'Für diesen Server wurde noch keine Verify Rolle gesetzt.',
            '',
            'Nutze zuerst **`/setup`** und setze dort optional die Verify Rolle.',
            '',
            'Danach kannst du das Verify Panel senden.'
          ].join('\n')
        )
        .setFooter({ text: 'Step Mod!Z BOT • Verify Hilfe' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      return;
    }

    await interaction.channel.send({
      embeds: [buildVerifyEmbed(interaction.guild.id)],
      components: [buildVerifyRow()]
    });

    await interaction.reply({
      content: '✅ Das Verify Panel wurde erfolgreich gesendet.',
      ephemeral: true
    });
  }
};