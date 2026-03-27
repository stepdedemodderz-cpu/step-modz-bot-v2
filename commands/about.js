import {
  SlashCommandBuilder,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Zeigt eine Übersicht über den Step Mod!Z BOT'),

  async execute(interaction) {

    const inviteUrl = 'https://discord.com/oauth2/authorize?client_id=DEINE_CLIENT_ID&permissions=8&scope=bot%20applications.commands';

    const embed = new EmbedBuilder()
      .setTitle('🔥 Step Mod!Z BOT')
      .setDescription(
        [
          '**Dein All-in-One Discord Bot für DayZ & Communities**',
          '',
          'Mit **Step Mod!Z BOT** bekommst du ein modernes System für Verifizierung, Support, Whitelist und Tools direkt in Discord.',
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
          '📜 **Regel-System (DE / EN)**',
          '🎫 **Ticket System (Premium)**',
          '📋 **Whitelist System**',
          '🧪 **Json / XML Validator**',
          '👋 **Welcome System**',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━',
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

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('🚀 Bot einladen')
        .setStyle(ButtonStyle.Link)
        .setURL(inviteUrl)
    );

    await interaction.reply({
      embeds: [embed],
      components: [row]
    });
  }
};