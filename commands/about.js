import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('about')
    .setDescription('Zeigt eine Übersicht über den Step Mod!Z BOT'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('🔥 Step Mod!Z BOT')
      .setDescription(
        [
          '**Dein All-in-One Discord Bot für DayZ & Communities**',
          '',
          'Mit **Step Mod!Z BOT** bekommst du ein modernes System für Verifizierung, Support, Whitelist, Serverstruktur und Tools direkt in Discord.',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '⚡ **Einrichtung**',
          '→ **Automatische Einrichtung**',
          'Der Bot erstellt wichtige Kategorien, Channels und Systeme fast vollständig automatisch.',
          '',
          '→ **Manuelle Einrichtung**',
          'Du kannst alles auch selbst anpassen und gezielt nach deinen Wünschen konfigurieren.',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '🔐 **Verify System**',
          '• Regeln lesen und bestätigen',
          '• Rollen automatisch vergeben',
          '• Zugriff erst nach Verifizierung',
          '',
          '📜 **Regel-System**',
          '• Regeln in Deutsch und Englisch',
          '• Bestätigung per Button',
          '• Direkte Verbindung mit dem Verify-System',
          '',
          '🎫 **Ticket System**',
          '• Ticket per Button öffnen',
          '• Privater Support-Channel',
          '• Ticket übernehmen & schließen',
          '',
          '📋 **Whitelist System**',
          '• Bewerbung direkt im Discord',
          '• Automatische Bewerbungs-Channels',
          '• Annahme / Ablehnung per Button',
          '',
          '🧪 **Json / XML Validator**',
          '• Dateien direkt im Discord prüfen',
          '• Ideal für DayZ XML / JSON Arbeiten',
          '',
          '👋 **Welcome System**',
          '• Begrüßungsnachrichten',
          '• individuell anpassbar',
          '',
          '━━━━━━━━━━━━━━━━━━━━━━━',
          '',
          '💎 **Was dich erwartet**',
          '• modernes Design',
          '• einfache Bedienung',
          '• automatisierte Abläufe',
          '• klare Struktur für deinen Server',
          '',
          '🚀 **Weitere Tools & Features folgen**'
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