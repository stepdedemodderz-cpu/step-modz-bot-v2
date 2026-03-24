import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';
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
      await interaction.reply({
        content: '❌ Bitte zuerst /setup ausführen und einen Welcome-Channel setzen.',
        ephemeral: true
      });
      return;
    }

    const channel = await interaction.guild.channels
      .fetch(config.welcomeChannelId)
      .catch(() => null);

    if (!channel || !channel.isTextBased()) {
      await interaction.reply({
        content: '❌ Der gespeicherte Welcome-Channel ist ungültig.',
        ephemeral: true
      });
      return;
    }

    await channel.send({
      embeds: [buildWelcomeEmbed(interaction.guild.name)]
    });

    await interaction.reply({
      content: `✅ Welcome Nachricht wurde in ${channel} gesendet.`,
      ephemeral: true
    });
  }
};
