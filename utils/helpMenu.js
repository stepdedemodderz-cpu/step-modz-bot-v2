import { EmbedBuilder } from 'discord.js';

export function getHelpMenuOptions(language = 'de') {
  if (language === 'en') {
    return [
      {
        label: 'Step BOT Quick Setup',
        value: 'quicksetup',
        description: 'Automatically create the full base structure'
      },
      {
        label: 'Setup',
        value: 'setup',
        description: 'How manual setup works'
      },
      {
        label: 'Verify System',
        value: 'verify',
        description: 'Verification and roles'
      },
      {
        label: 'Ticket System',
        value: 'tickets',
        description: 'Private support tickets'
      },
      {
        label: 'Whitelist System',
        value: 'whitelist',
        description: 'DayZ whitelist applications'
      },
      {
        label: 'Validator',
        value: 'validator',
        description: 'JSON, XML and DayZ file checks'
      },
      {
        label: 'Settings',
        value: 'settings',
        description: 'Show saved settings'
      }
    ];
  }

  return [
    {
      label: 'Step BOT Schnell Einrichtung',
      value: 'quicksetup',
      description: 'Erstellt automatisch die komplette Grundstruktur'
    },
    {
      label: 'Setup',
      value: 'setup',
      description: 'Wie das manuelle Setup funktioniert'
    },
    {
      label: 'Verify System',
      value: 'verify',
      description: 'Verifizierung und Rollen'
    },
    {
      label: 'Ticket System',
      value: 'tickets',
      description: 'Private Support-Tickets'
    },
    {
      label: 'Whitelist System',
      value: 'whitelist',
      description: 'DayZ Whitelist-Bewerbungen'
    },
    {
      label: 'Validator',
      value: 'validator',
      description: 'JSON, XML und DayZ-Dateien prüfen'
    },
    {
      label: 'Settings',
      value: 'settings',
      description: 'Gespeicherte Einstellungen anzeigen'
    }
  ];
}

export function buildHelpEmbed(language = 'de', topic = 'setup') {
  const map = {
    de: {
      quicksetup: {
        title: '⚡ Step BOT Schnell Einrichtung',
        description:
          'Mit dieser Option richtet der Bot die komplette Grundstruktur automatisch ein.\n\n' +
          '**Automatisch erstellt werden:**\n' +
          '• Welcome\n' +
          '• Roles\n' +
          '• Ticket\n' +
          '• Whitelist\n' +
          '• Validator\n\n' +
          '**Danach musst du fast nichts mehr selbst machen.**'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          '`/setup` speichert nur Einstellungen.\n\n' +
          '**Es erstellt keine Channels oder Kategorien automatisch.**\n\n' +
          'Wenn du die komplette Struktur automatisch erstellen willst, nutze **Step BOT Schnell Einrichtung**.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Verify ist optional.\n\n' +
          '**Manuelle Einrichtung:**\n' +
          '1. Verify Rolle mit `/setup` speichern\n' +
          '2. Danach `/verify-panel` senden'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Erstellt private Support-Tickets.\n\n' +
          '**Manuelle Einrichtung:**\n' +
          '1. Ticket Kategorie mit `/setup` speichern oder Schnell Einrichtung nutzen\n' +
          '2. Danach `/ticket-panel` senden\n' +
          '3. Eigene Nachricht mit `/ticket-nachricht` speichern'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Erstellt Bewerbungs-Channels für DayZ.\n\n' +
          '**Manuelle Einrichtung:**\n' +
          '1. Whitelist Kategorie mit `/setup` speichern oder Schnell Einrichtung nutzen\n' +
          '2. Danach `/whitelist-panel` senden\n' +
          '3. Eigene Nachricht mit `/whitelist-nachricht` speichern'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Mit `/validate` prüfst du JSON-, XML- und DayZ-Dateien.\n\n' +
          'Der Bot erkennt den Typ automatisch und zeigt Fehler oder Hinweise an.'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Mit `/settings` siehst du alle aktuell gespeicherten Einstellungen deines Servers.'
      }
    },
    en: {
      quicksetup: {
        title: '⚡ Step BOT Quick Setup',
        description:
          'This option automatically creates the full base structure for you.'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          '`/setup` only saves settings. It does not create channels or categories automatically.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Verify is optional. Save a verify role and then send `/verify-panel`.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Creates private support tickets. Use `/ticket-panel` and optionally `/ticket-nachricht`.'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Creates DayZ whitelist applications. Use `/whitelist-panel` and optionally `/whitelist-nachricht`.'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Use `/validate` to check JSON, XML and DayZ files.'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Use `/settings` to show your saved server settings.'
      }
    }
  };

  const lang = map[language] ? language : 'de';
  const entry = map[lang][topic] || map[lang].setup;

  return new EmbedBuilder()
    .setTitle(entry.title)
    .setDescription(entry.description)
    .setColor(0x22c55e)
    .setFooter({ text: 'Step Mod!Z BOT' })
    .setTimestamp();
}