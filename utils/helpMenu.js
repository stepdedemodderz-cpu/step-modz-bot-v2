import { EmbedBuilder } from 'discord.js';

export function getHelpMenuOptions(language = 'de') {
  if (language === 'en') {
    return [
      {
        label: 'Dropdown Menu',
        value: 'dropdown_info',
        description: 'Choose a category below'
      },
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
      label: 'Dropdown Menü',
      value: 'dropdown_info',
      description: 'Wähle darunter eine Kategorie aus'
    },
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
      dropdown_info: {
        title: '📂 Dropdown Menü',
        description:
          'Wähle einfach unten eine Kategorie aus.\n\n' +
          'Dann zeigt dir der Bot die passende Erklärung an.'
      },
      quicksetup: {
        title: '⚡ Step BOT Schnell Einrichtung',
        description:
          'Mit dieser Option richtet der Bot die komplette Grundstruktur automatisch ein.\n\n' +
          '**Automatisch erstellt werden:**\n' +
          '• Welcome\n' +
          '• Verification\n' +
          '• Ticket\n' +
          '• Whitelist\n' +
          '• Validator\n\n' +
          'Diese Funktion darf nur der Server-Besitzer nutzen.'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          '`/setup` speichert nur Einstellungen.\n\n' +
          'Es erstellt keine Kategorien oder Channels automatisch.\n\n' +
          'Die automatische Einrichtung läuft nur über **Step BOT Schnell Einrichtung**.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Das Verify System arbeitet mit zwei Rollen:\n' +
          '• Verify\n' +
          '• Unverify\n\n' +
          'Beim Join bekommt ein Nutzer automatisch **Unverify**.\n' +
          'Beim Klick auf den Verify-Button wird **Unverify entfernt** und **Verify hinzugefügt**.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Erstellt private Support-Tickets.\n\n' +
          'Die Ticket-Nachricht kann mit `/ticket-nachricht` angepasst werden.\n' +
          'Danach kannst du mit `/ticket-panel` das Panel erneut senden.'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Erstellt Whitelist-Bewerbungen für DayZ.\n\n' +
          'Die Whitelist-Nachricht kann mit `/whitelist-nachricht` angepasst werden.\n' +
          'Danach kannst du mit `/whitelist-panel` das Panel erneut senden.'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Mit `/validate` prüfst du JSON-, XML- und DayZ-Dateien.\n\n' +
          'Diesen Bereich dürfen alle User lesen und benutzen.'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Mit `/settings` siehst du die aktuell gespeicherten Einstellungen.'
      }
    },
    en: {
      dropdown_info: {
        title: '📂 Dropdown Menu',
        description:
          'Choose a category below and the bot will show the matching explanation.'
      },
      quicksetup: {
        title: '⚡ Step BOT Quick Setup',
        description:
          'This option automatically creates the full base structure.'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          '`/setup` only saves settings and does not create channels automatically.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Users get **Unverify** on join and it switches to **Verify** when they click the button.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Creates private support tickets.'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Creates DayZ whitelist applications.'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Use `/validate` to check JSON, XML and DayZ files.'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Shows your saved settings.'
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