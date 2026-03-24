import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder
} from 'discord.js';
import { buildWelcomeEmbed } from '../utils/welcome.js';
import { getGuildConfig } from '../utils/config.js';

export default {
  data: new SlashCommandBuilder()
    .setName('setup-welcome')
    .setDescription('Sendet eine Welcome Nachricht in den gespeicherten Welcome Channel.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id);

    if (!config?.welcomeChannelId) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Welcome Setup fehlt')
        .setDescription(
          [
            'Für diesen Server wurde noch kein Welcome-Channel gesetzt.',
            '',
            'Nutze **`/setup`** und wähle einen **Welcome Channel** aus.',
            '',
            'Danach kann der Bot dort Begrüßungsnachrichten senden.'
          ].join('\n')
        )
        .setFooter({ text: 'Step Mod!Z BOT • Welcome Hilfe' })
        .setTimestamp();

      await interaction.reply({
        embeds: [embed],
        ephemeral: true
      });
      return;
    }

    const channel = await interaction.guild.channels
      .fetch(config.welcomeChannelId)
      .catch(() => null);

    if (!channel || !channel.isTextBased()) {
      await interaction.reply({
        content: '❌ Der gespeicherte Welcome-Channel ist ungültig oder nicht mehr vorhanden.',
        ephemeral: true
      });
      return;
    }

    await channel.send({
      embeds: [buildWelcomeEmbed(interaction.guild.name)]
    });

    await interaction.reply({
      content: `✅ Die Welcome Nachricht wurde erfolgreich in ${channel} gesendet.`,
      ephemeral: true
    });
  }
};