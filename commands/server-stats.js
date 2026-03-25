import {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('server-stats')
    .setDescription('Zeigt wichtige Server-Statistiken an.'),

  async execute(interaction) {
    const guild = interaction.guild;

    const totalMembers = guild.memberCount;
    const textChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildText).size;
    const voiceChannels = guild.channels.cache.filter(c => c.type === ChannelType.GuildVoice).size;
    const categories = guild.channels.cache.filter(c => c.type === ChannelType.GuildCategory).size;
    const roles = guild.roles.cache.size;
    const emojis = guild.emojis.cache.size;

    const embed = new EmbedBuilder()
      .setTitle('📊 Server Statistiken')
      .setColor(0x22c55e)
      .addFields(
        { name: '👥 Mitglieder', value: String(totalMembers), inline: true },
        { name: '💬 Text-Channels', value: String(textChannels), inline: true },
        { name: '🔊 Voice-Channels', value: String(voiceChannels), inline: true },
        { name: '📂 Kategorien', value: String(categories), inline: true },
        { name: '🛡️ Rollen', value: String(roles), inline: true },
        { name: '😀 Emojis', value: String(emojis), inline: true }
      )
      .setFooter({ text: 'Step Mod!Z BOT • Server Stats' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};