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
        description: 'Create the full base structure automatically'
      },
      {
        label: 'Update BOT/TOOLS',
        value: 'update_tools',
        description: 'Install new tools only'
      },
      {
        label: 'Setup',
        value: 'setup',
        description: 'How manual setup works'
      },
      {
        label: 'Verify System',
        value: 'verify',
        description: 'Verification and role system'
      },
      {
        label: 'Ticket System',
        value: 'tickets',
        description: 'Private support tickets'
      },
      {
        label: 'Whitelist System',
        value: 'whitelist',
        description: 'Applications directly in Discord'
      },
      {
        label: 'Validator',
        value: 'validator',
        description: 'Check JSON, XML and DayZ files'
      },
      {
        label: 'Settings',
        value: 'settings',
        description: 'Show saved bot settings'
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
      description: 'Erstellt die komplette Grundstruktur automatisch'
    },
    {
      label: 'Aktualisieren BOT/TOOLS',
      value: 'update_tools',
      description: '🆕 Neue Tools übernehmen'
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
      description: 'Whitelist-Bewerbungen direkt im Discord'
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
          'Wähle unten einfach eine Kategorie aus.\n\n' +
          'Der Bot zeigt dir dann die passende Erklärung und Übersicht an.'
      },
      quicksetup: {
        title: '⚡ Step BOT Schnell Einrichtung',
        description:
          'Mit dieser Funktion richtet der Bot die komplette Grundstruktur automatisch ein.\n\n' +
          '**Dabei werden eingerichtet:**\n' +
          '• Verification\n' +
          '• Welcome\n' +
          '• Ticket\n' +
          '• Whitelist\n' +
          '• Validator\n\n' +
          'Diese Funktion ist für die erste komplette Einrichtung gedacht.'
      },

      // 🔥 DEIN NEUER TEXT
      update_tools: {
        title: '🆕 Aktualisieren BOT / TOOLS',
        description:
          '🆕 **Neue Tools übernehmen**\n\n' +
          'Mit dieser Funktion installiert der Bot nur wirklich neue Tools,\n' +
          'die durch spätere Updates neu hinzugekommen sind.\n\n' +
          'Gebe den Befehl `/update-server` ein,\n' +
          'um den Bot zu aktualisieren und neue Tools hinzuzufügen.\n\n' +
          'Wenn es keine neuen Tools gibt, bekommst du die Meldung:\n' +
          '**„✅ Du hast das neueste Update.“**'
      },

      setup: {
        title: '⚙️ Setup',
        description:
          'Hier wird erklärt, wie du den Bot manuell einrichtest und einzelne Systeme selbst anpasst.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Das Verify-System sorgt dafür, dass User erst nach Regelbestätigung und Verifizierung Zugriff auf geschützte Serverbereiche erhalten.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Mit dem Ticket-System können Mitglieder private Support-Tickets erstellen und Hilfe direkt im Discord erhalten.'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Das Whitelist-System ermöglicht Bewerbungen direkt im Discord und ist ideal für DayZ-Server und Projekte.'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Mit dem Validator können JSON-, XML- und DayZ-Dateien direkt im Discord geprüft werden.'
      },
      settings: {
        title: '🛠️ Settings',
        description:
          'Hier siehst du gespeicherte Bot-Einstellungen und wichtige Konfigurationsdaten.'
      }
    },

    en: {
      dropdown_info: {
        title: '📂 Dropdown Menu',
        description:
          'Simply choose a category below.\n\n' +
          'The bot will then show you the matching explanation and overview.'
      },
      quicksetup: {
        title: '⚡ Step BOT Quick Setup',
        description:
          'This function automatically creates the full base structure.\n\n' +
          '**It sets up:**\n' +
          '• Verification\n' +
          '• Welcome\n' +
          '• Ticket\n' +
          '• Whitelist\n' +
          '• Validator\n\n' +
          'This is meant for the first complete setup.'
      },
      update_tools: {
        title: '🆕 Update BOT / TOOLS',
        description:
          '🆕 **Install new tools**\n\n' +
          'This function installs only real new tools added by later updates.\n\n' +
          'Use the command `/update-server` to update the bot and install new tools.\n\n' +
          'If there are no new tools, you will get:\n' +
          '**“✅ You already have the latest update.”**'
      },
      setup: {
        title: '⚙️ Setup',
        description:
          'Explains how to manually configure the bot and adjust systems yourself.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'The verify system ensures users only get access to protected server areas after confirming the rules and verifying.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'The ticket system allows members to create private support tickets directly in Discord.'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'The whitelist system allows applications directly in Discord and is ideal for DayZ servers and projects.'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'The validator checks JSON, XML and DayZ files directly inside Discord.'
      },
      settings: {
        title: '🛠️ Settings',
        description:
          'Shows saved bot settings and important configuration data.'
      }
    }
  };

  const lang = map[language] || map.de;
  const item = lang[topic] || lang.setup;

  return new EmbedBuilder()
    .setTitle(item.title)
    .setDescription(item.description)
    .setColor(0x5865f2)
    .setFooter({ text: 'Step Mod!Z BOT' })
    .setTimestamp();
}