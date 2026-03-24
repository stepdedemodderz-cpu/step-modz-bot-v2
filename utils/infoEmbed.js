import { EmbedBuilder } from 'discord.js';
import { t } from './i18n.js';

export function buildInfoEmbed(language = 'de') {
  const isEn = language === 'en';

  return new EmbedBuilder()
    .setTitle(
      isEn
        ? '📘 Step Mod!Z BOT – Overview & Setup'
        : '📘 Step Mod!Z BOT – Übersicht & Einrichtung'
    )
    .setColor(0x22c55e)
    .setDescription(
      isEn
        ? 'Welcome to **Step Mod!Z BOT**.\n\nThis bot helps you with verification, welcome system, tickets, whitelist and DayZ file validation.'
        : 'Willkommen bei **Step Mod!Z BOT**.\n\nDieser Bot hilft dir bei Verifizierung, Welcome-System, Tickets, Whitelist und DayZ-Datei-Validierung.'
    )
    .addFields(
      {
        name: isEn ? '⚡ Automatic setup via dropdown' : '⚡ Automatische Einrichtung über Dropdown',
        value: isEn
          ? 'Use the dropdown in the main bot channel and choose **Step BOT Quick Setup**. This is the only option that automatically creates the full base structure.'
          : 'Nutze das Dropdown im Haupt-Channel des Bots und wähle **Step BOT Schnell Einrichtung**. Nur diese Option erstellt die komplette Grundstruktur automatisch.',
        inline: false
      },
      {
        name: isEn ? '🛠️ Manual setup with /setup' : '🛠️ Manuelles Setup mit /setup',
        value: isEn
          ? '`/setup` only saves settings like roles and categories. It does not create channels or categories automatically.'
          : '`/setup` speichert nur Einstellungen wie Rollen und Kategorien. Es erstellt keine Channels oder Kategorien automatisch.',
        inline: false
      },
      {
        name: isEn ? '🎫 Ticket System' : '🎫 Ticket System',
        value: isEn
          ? 'Use `/ticket-panel` after the structure is ready.'
          : 'Nutze `/ticket-panel`, sobald die Struktur vorbereitet ist.',
        inline: false
      },
      {
        name: isEn ? '📋 Whitelist System' : '📋 Whitelist System',
        value: isEn
          ? 'Use `/whitelist-panel` after the structure is ready.'
          : 'Nutze `/whitelist-panel`, sobald die Struktur vorbereitet ist.',
        inline: false
      },
      {
        name: isEn ? '🔐 Verify System' : '🔐 Verify System',
        value: isEn
          ? 'Verify is optional. If needed, set a verify role and use `/verify-panel`.'
          : 'Verify ist optional. Wenn du es nutzen willst, setze eine Verify Rolle und nutze `/verify-panel`.',
        inline: false
      },
      {
        name: isEn ? '🧪 Validator' : '🧪 Validator',
        value: isEn
          ? 'Use `/validate` to check JSON, XML and DayZ files automatically.'
          : 'Nutze `/validate`, um JSON-, XML- und DayZ-Dateien automatisch zu prüfen.',
        inline: false
      }
    )
    .setFooter({ text: t(language, 'checkedBy') })
    .setTimestamp();
}