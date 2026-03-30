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
        label: 'Install New Tools',
        value: 'update_tools',
        description: 'Only add new missing tools and areas'
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
      label: 'Neue Tools übernehmen',
      value: 'update_tools',
      description: 'Installiert nur neue fehlende Tools und Bereiche'
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
      update_tools: {
        title: '🆕 Neue Tools übernehmen',
        description:
          'Mit dieser Option installiert der Bot **nur neue fehlende Tools und Bereiche**, die nach einem späteren Bot-Update hinzugekommen sind.\n\n' +
          '**Wichtig:**\n' +
          '• Bereits vorhandene Kanäle werden nicht neu eingerichtet\n' +
          '• Bereits vorhandene Kategorien werden nicht neu gesendet\n' +
          '• Nur wirklich neue fehlende Bot-Bereiche werden ergänzt\n\n' +
          'Wenn keine neuen Tools vorhanden sind, bekommst du eine Meldung, dass der Bot bereits auf dem neuesten Stand ist.'
      },
      setup: {
        title: '⚙️ Setup',
        description:
          'Hier wird erklärt, wie du den Bot manuell einrichtest und einzelne Systeme selbst konfigurierst.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Das Verify-System sorgt dafür, dass User erst nach Regelbestätigung und Verifizierung Zugriff auf die geschützten Serverbereiche erhalten.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Mit dem Ticket-System können Mitglieder private Support-Tickets per Button öffnen und Hilfe vom Team erhalten.'
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
          'The bot will then show you the matching explanation.'
      },
      quicksetup: {
        title: '⚡ Step BOT Quick Setup',
        description:
          'This option automatically creates the full base structure.\n\n' +
          '**Automatically created:**\n' +
          '• Welcome\n' +
          '• Verification\n' +
          '• Ticket\n' +
          '• Whitelist\n' +
          '• Validator\n\n' +
          'Only the server owner can use this.'
      },
      update_tools: {
        title: '🆕 Install New Tools',
        description:
          'This option installs **only new missing tools and areas** that were added in later bot updates.\n\n' +
          '**Important:**\n' +
          '• Existing channels are not rebuilt\n' +
          '• Existing categories are not reposted\n' +
          '• Only truly missing new bot areas will be added\n\n' +
          'If no new tools exist, the bot will tell you that everything is already up to date.'
      },
      setup: {
        title: '⚙️ Setup',
        description:
          'Explains how to manually configure the bot and set up systems yourself.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'The verify system makes sure users only get access to protected areas after confirming the rules and verifying.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'The ticket system allows members to open private support tickets via button.'
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