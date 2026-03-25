import { EmbedBuilder } from 'discord.js';
import { t } from './i18n.js';

export function buildInfoEmbed(language = 'de') {
  const isEn = language === 'en';

  return new EmbedBuilder()
    .setTitle(
      isEn
        ? '📘 Step Mod!Z BOT – Full Overview'
        : '📘 Step Mod!Z BOT – Komplette Übersicht'
    )
    .setColor(0x22c55e)
    .setDescription(
      isEn
        ? [
            'Welcome to **Step Mod!Z BOT**.',
            '',
            'This bot helps you with server setup, verification, welcome messages, tickets, whitelist applications and DayZ file validation.',
            '',
            '**Important:**',
            '• **Step BOT Quick Setup** in the dropdown automatically creates the main structure',
            '• **/setup** only saves settings manually',
            '• The dropdown explains all systems',
            '• The quick setup is the only automatic installer'
          ].join('\n')
        : [
            'Willkommen bei **Step Mod!Z BOT**.',
            '',
            'Dieser Bot hilft dir bei Server-Einrichtung, Verifizierung, Welcome-Nachrichten, Tickets, Whitelist-Bewerbungen und der Prüfung von DayZ-Dateien.',
            '',
            '**Wichtig:**',
            '• **Step BOT Schnell Einrichtung** im Dropdown erstellt die Grundstruktur automatisch',
            '• **/setup** speichert Einstellungen nur manuell',
            '• Das Dropdown erklärt alle Systeme',
            '• Die Schnell Einrichtung ist der einzige automatische Installer'
          ].join('\n')
    )
    .addFields(
      {
        name: isEn ? '⚡ Step BOT Quick Setup' : '⚡ Step BOT Schnell Einrichtung',
        value: isEn
          ? [
              'Automatically creates the full base structure for you.',
              '',
              '**Creates automatically:**',
              '• Welcome',
              '• Roles',
              '• Ticket',
              '• Whitelist',
              '• Validator',
              '',
              'This is the fastest way to prepare the bot.'
            ].join('\n')
          : [
              'Erstellt automatisch die komplette Grundstruktur für dich.',
              '',
              '**Automatisch erstellt werden:**',
              '• Welcome',
              '• Roles',
              '• Ticket',
              '• Whitelist',
              '• Validator',
              '',
              'Das ist der schnellste Weg, den Bot vorzubereiten.'
            ].join('\n'),
        inline: false
      },
      {
        name: isEn ? '🛠️ Manual Setup with /setup' : '🛠️ Manuelles Setup mit /setup',
        value: isEn
          ? [
              '`/setup` is for manual configuration.',
              '',
              '**You can save manually:**',
              '• Verify role',
              '• Unverified role',
              '• Welcome channel',
              '• Ticket category',
              '• Ticket support role',
              '• Whitelist category',
              '• Review role',
              '• Approved role',
              '',
              'It does **not** create channels automatically.'
            ].join('\n')
          : [
              '`/setup` ist für die manuelle Konfiguration gedacht.',
              '',
              '**Du kannst manuell speichern:**',
              '• Verify Rolle',
              '• Unverified Rolle',
              '• Welcome Channel',
              '• Ticket Kategorie',
              '• Ticket Support Rolle',
              '• Whitelist Kategorie',
              '• Review Rolle',
              '• Approved Rolle',
              '',
              'Es erstellt **keine** Channels automatisch.'
            ].join('\n'),
        inline: false
      },
      {
        name: isEn ? '🔐 Verify System' : '🔐 Verify System',
        value: isEn
          ? [
              'Optional system.',
              '',
              '**What it does:**',
              '• Users can verify themselves',
              '• They receive a role afterwards',
              '',
              '**How to activate:**',
              '1. Set a verify role with `/setup`',
              '2. Send the panel with `/verify-panel`'
            ].join('\n')
          : [
              'Optionales System.',
              '',
              '**Was es macht:**',
              '• Nutzer können sich verifizieren',
              '• Danach bekommen sie eine Rolle',
              '',
              '**So aktivierst du es:**',
              '1. Verify Rolle mit `/setup` setzen',
              '2. Panel mit `/verify-panel` senden'
            ].join('\n'),
        inline: false
      },
      {
        name: isEn ? '🎫 Ticket System' : '🎫 Ticket System',
        value: isEn
          ? [
              'Creates private support tickets.',
              '',
              '**What it does:**',
              '• Users open a ticket with a button',
              '• The bot creates a private support channel',
              '',
              '**How to activate:**',
              '1. Use quick setup or save a ticket category',
              '2. Send the panel with `/ticket-panel`',
              '',
              '**Extra:**',
              'You can customize the ticket message with `/ticket-nachricht`'
            ].join('\n')
          : [
              'Erstellt private Support-Tickets.',
              '',
              '**Was es macht:**',
              '• Nutzer öffnen per Button ein Ticket',
              '• Der Bot erstellt einen privaten Support-Channel',
              '',
              '**So aktivierst du es:**',
              '1. Schnell Einrichtung nutzen oder Ticket Kategorie speichern',
              '2. Panel mit `/ticket-panel` senden',
              '',
              '**Extra:**',
              'Du kannst die Ticket-Nachricht mit `/ticket-nachricht` anpassen'
            ].join('\n'),
        inline: false
      },
      {
        name: isEn ? '📋 Whitelist System' : '📋 Whitelist System',
        value: isEn
          ? [
              'Creates DayZ whitelist applications.',
              '',
              '**What it does:**',
              '• Users apply through a panel',
              '• Applications are sent into the whitelist area',
              '',
              '**How to activate:**',
              '1. Use quick setup or save a whitelist category',
              '2. Send the panel with `/whitelist-panel`',
              '',
              '**Extra:**',
              'You can customize the whitelist message with `/whitelist-nachricht`'
            ].join('\n')
          : [
              'Erstellt DayZ Whitelist-Bewerbungen.',
              '',
              '**Was es macht:**',
              '• Nutzer bewerben sich über ein Panel',
              '• Bewerbungen landen im Whitelist-Bereich',
              '',
              '**So aktivierst du es:**',
              '1. Schnell Einrichtung nutzen oder Whitelist Kategorie speichern',
              '2. Panel mit `/whitelist-panel` senden',
              '',
              '**Extra:**',
              'Du kannst die Whitelist-Nachricht mit `/whitelist-nachricht` anpassen'
            ].join('\n'),
        inline: false
      },
      {
        name: isEn ? '👋 Welcome System' : '👋 Welcome System',
        value: isEn
          ? [
              'Sends welcome messages.',
              '',
              '**What it does:**',
              '• The bot can send a welcome message into the saved welcome channel',
              '',
              '**How to activate:**',
              '1. Save a welcome channel with `/setup` or use quick setup',
              '2. Send the message with `/setup-welcome`',
              '',
              '**Extra:**',
              'You can customize the welcome message with `/welcome-nachricht`'
            ].join('\n')
          : [
              'Sendet Welcome-Nachrichten.',
              '',
              '**Was es macht:**',
              '• Der Bot kann eine Begrüßung in den gespeicherten Welcome-Channel senden',
              '',
              '**So aktivierst du es:**',
              '1. Welcome Channel mit `/setup` speichern oder Schnell Einrichtung nutzen',
              '2. Nachricht mit `/setup-welcome` senden',
              '',
              '**Extra:**',
              'Du kannst die Welcome-Nachricht mit `/welcome-nachricht` anpassen'
            ].join('\n'),
        inline: false
      },
      {
        name: isEn ? '🧪 JSON / XML / DayZ Validator' : '🧪 JSON / XML / DayZ Validator',
        value: isEn
          ? [
              'Checks JSON, XML and DayZ files.',
              '',
              '**What it does:**',
              '• Detects syntax errors',
              '• Validates JSON and XML automatically',
              '• Includes DayZ-specific checks',
              '',
              '**How to use:**',
              '• Run `/validate`',
              '• Upload your file',
              '• Review the result'
            ].join('\n')
          : [
              'Prüft JSON-, XML- und DayZ-Dateien.',
              '',
              '**Was es macht:**',
              '• Erkennt Syntaxfehler',
              '• Prüft JSON und XML automatisch',
              '• Enthält DayZ-spezifische Prüfungen',
              '',
              '**So nutzt du es:**',
              '• `/validate` ausführen',
              '• Datei hochladen',
              '• Ergebnis prüfen'
            ].join('\n'),
        inline: false
      },
      {
        name: isEn ? '⚙️ Useful Commands' : '⚙️ Nützliche Befehle',
        value: isEn
          ? [
              '`/info` → full overview',
              '`/setup` → save manual settings',
              '`/settings` → show saved settings',
              '`/verify-panel` → send verify panel',
              '`/ticket-panel` → send ticket panel',
              '`/whitelist-panel` → send whitelist panel',
              '`/setup-welcome` → send welcome message',
              '`/ticket-nachricht` → save custom ticket message',
              '`/whitelist-nachricht` → save custom whitelist message',
              '`/welcome-nachricht` → save custom welcome message',
              '`/validate` → validate files'
            ].join('\n')
          : [
              '`/info` → komplette Übersicht',
              '`/setup` → manuelle Einstellungen speichern',
              '`/settings` → gespeicherte Einstellungen anzeigen',
              '`/verify-panel` → Verify Panel senden',
              '`/ticket-panel` → Ticket Panel senden',
              '`/whitelist-panel` → Whitelist Panel senden',
              '`/setup-welcome` → Welcome Nachricht senden',
              '`/ticket-nachricht` → eigene Ticket Nachricht speichern',
              '`/whitelist-nachricht` → eigene Whitelist Nachricht speichern',
              '`/welcome-nachricht` → eigene Welcome Nachricht speichern',
              '`/validate` → Dateien prüfen'
            ].join('\n'),
        inline: false
      }
    )
    .setFooter({ text: t(language, 'checkedBy') })
    .setTimestamp();
}