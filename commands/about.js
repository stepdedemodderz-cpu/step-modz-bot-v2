import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Zeigt Informationen über den Step Mod!Z BOT'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🔥 Step Mod!Z BOT')
      .setDescription(
        [
          '**Dein All-in-One Discord Bot für DayZ & Communities**',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '⚡ **Einrichtung**',
          '→ 🔥 Automatisch (1 Klick)',
          '→ ⚙️ Manuell (volle Kontrolle)',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '🔐 **Verify System**',
          '🎫 **Ticket System (Premium)**',
          '📋 **Whitelist System**',
          '🧪 **JSON/XML Validator**',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '⚡ **Step Bot Schnell Einrichtung nutzen!**',
          '',
          '💎 Modern • Schnell • Automatisch',
          '',
          '🚀 Weitere Tools & Features folgen'
        ].join('\n')
      )
      .setImage('https://cdn.discordapp.com/attachments/1485785120270061751/1486064187053441096/25882009-b8b1-4350-bdaa-9652c0bfead3.png')
      .setColor(0xff0000)
      .setFooter({ text: 'Step Mod!Z BOT' })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: false
    });
  }
};