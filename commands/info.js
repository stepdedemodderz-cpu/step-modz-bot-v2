import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('info')
    .setDescription('Zeigt alle Funktionen und Setup-Anleitung'),

  async execute(interaction) {
    const embed = new EmbedBuilder()
      .setTitle('📘 Step Mod!Z BOT – Anleitung')
      .setColor(0x22c55e)
      .setDescription('Hier ist alles, was du wissen musst:')

      .addFields(
        {
          name: '⚙️ Setup',
          value:
`/setup  
➡️ Grundsetup starten

/verify-panel  
➡️ Verifizierung aktivieren

/ticket-panel  
➡️ Support Tickets aktivieren

/setup-welcome  
➡️ Welcome System einstellen`,
        },

        {
          name: '🧪 Validator (NEU 🔥)',
          value:
`/validate  
➡️ JSON oder XML prüfen

✔ Erkennt Fehler  
✔ Zeigt Position  
✔ DayZ Spezialchecks  
✔ Deutsch / Englisch`,
        },

        {
          name: '🛠️ Funktionen',
          value:
`✔ Verify System  
✔ Ticket System  
✔ Welcome System  
✔ Settings speichern  
✔ DayZ File Checker`,
        },

        {
          name: '📦 Installation',
          value:
`1. /setup ausführen  
2. Rollen auswählen  
3. Channel setzen  
4. Panels erstellen  

FERTIG ✅`,
        }
      )

      .setFooter({ text: 'Step Mod!Z BOT by StepDede_ModderZ' });

    await interaction.reply({ embeds: [embed], ephemeral: true });
  }
};