import { EmbedBuilder } from 'discord.js';

export function getHelpMenuOptions(language = 'de') {
  if (language === 'en') {
    return [
      {
        label: 'Step BOT Quick Setup',
        value: 'quicksetup',
        description: 'Let the bot automatically set up everything'
      },
      {
        label: 'Setup',
        value: 'setup',
        description: 'How to configure the bot for your server'
      },
      {
        label: 'Verify System',
        value: 'verify',
        description: 'How verification works and how to set it up'
      },
      {
        label: 'Ticket System',
        value: 'tickets',
        description: 'Create and manage support tickets'
      },
      {
        label: 'Whitelist System',
        value: 'whitelist',
        description: 'How DayZ whitelist applications work'
      },
      {
        label: 'Validator',
        value: 'validator',
        description: 'Validate JSON, XML and DayZ files'
      },
      {
        label: 'Settings',
        value: 'settings',
        description: 'Show and review the saved bot settings'
      }
    ];
  }

  return [
    {
      label: 'Step BOT Schnell Einrichtung',
      value: 'quicksetup',
      description: 'Lass den Bot alles automatisch einrichten'
    },
    {
      label: 'Setup',
      value: 'setup',
      description: 'Wie du den Bot für deinen Server einrichtest'
    },
    {
      label: 'Verify System',
      value: 'verify',
      description: 'Wie Verifizierung funktioniert und eingerichtet wird'
    },
    {
      label: 'Ticket System',
      value: 'tickets',
      description: 'Support-Tickets erstellen und verwalten'
    },
    {
      label: 'Whitelist System',
      value: 'whitelist',
      description: 'Wie DayZ Whitelist-Bewerbungen funktionieren'
    },
    {
      label: 'Validator',
      value: 'validator',
      description: 'JSON, XML und DayZ-Dateien prüfen'
    },
    {
      label: 'Settings',
      value: 'settings',
      description: 'Gespeicherte Bot-Einstellungen anzeigen'
    }
  ];
}

export function buildHelpEmbed(language = 'de', topic = 'setup') {
  const map = {
    de: {
      quicksetup: {
        title: '⚡ Step BOT Schnell Einrichtung',
        description:
          'Mit dieser Funktion kann der Bot die Grundstruktur automatisch einrichten.\n\n' +
          '**Was automatisch erstellt wird:**\n' +
          '- Kategorie **Welcome**\n' +
          '- Kategorie **Roles**\n' +
          '- Kategorie **Ticket**\n' +
          '- Kategorie **Whitelist**\n' +
          '- Kategorie **Validator**\n' +
          '- passende Info-Channels\n\n' +
          '**Was du danach noch machen kannst:**\n' +
          '- `/ticket-panel`\n' +
          '- `/whitelist-panel`\n' +
          '- `/verify-panel`\n' +
          '- `/setup-welcome`\n\n' +
          'Wenn du im Dropdown diese Option auswählst, richtet der Bot alles direkt automatisch ein.'
      },
      setup: {
        title: '🛠️ Setup Hilfe',
        description:
          'Mit **/setup** richtest du Step Mod!Z BOT für deinen Server manuell ein.\n\n' +
          '**Was du tun musst:**\n' +
          '1. Nutze **/setup**\n' +
          '2. Wähle nur die Rollen und Channels aus, die du wirklich brauchst\n' +
          '3. Verify ist **optional** und kann leer bleiben\n' +
          '4. Danach kannst du die passenden Panels senden'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Das Verify System ist **optional**.\n\n' +
          '**Einrichtung:**\n' +
          '1. Optional in **/setup** eine Verify Rolle setzen\n' +
          '2. Danach **/verify-panel** nutzen\n' +
          '3. Der Bot sendet ein Panel mit Button zum Verifizieren'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Mit dem Ticket System können Nutzer private Support-Tickets öffnen.\n\n' +
          '**Einrichtung:**\n' +
          '1. In **/setup** eine Ticket Kategorie setzen oder Schnell Einrichtung nutzen\n' +
          '2. Optional eine Support Rolle setzen\n' +
          '3. Danach **/ticket-panel** ausführen'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Das Whitelist System erstellt Bewerbungs-Channels für DayZ.\n\n' +
          '**Einrichtung:**\n' +
          '1. In **/setup** eine Whitelist Kategorie setzen oder Schnell Einrichtung nutzen\n' +
          '2. Optional eine Review Rolle setzen\n' +
          '3. Optional eine Approved Rolle setzen\n' +
          '4. Danach **/whitelist-panel** ausführen'
      },
      validator: {
        title: '🧪 Validator Hilfe',
        description:
          'Mit **/validate** kannst du JSON-, XML- und DayZ-Dateien prüfen.\n\n' +
          '**Benutzung:**\n' +
          '1. Nutze **/validate**\n' +
          '2. Lade eine Datei hoch\n' +
          '3. Wähle optional die Sprache\n' +
          '4. Der Bot zeigt Fehler oder Hinweise an'
      },
      settings: {
        title: '⚙️ Settings Hilfe',
        description:
          'Mit **/settings** kannst du die aktuell gespeicherten Einstellungen deines Servers sehen.'
      }
    },
    en: {
      quicksetup: {
        title: '⚡ Step BOT Quick Setup',
        description:
          'This option lets the bot automatically prepare the full base structure.\n\n' +
          '**Automatically created:**\n' +
          '- **Welcome** category\n' +
          '- **Roles** category\n' +
          '- **Ticket** category\n' +
          '- **Whitelist** category\n' +
          '- **Validator** category\n' +
          '- matching info channels\n\n' +
          '**After that you can still use:**\n' +
          '- `/ticket-panel`\n' +
          '- `/whitelist-panel`\n' +
          '- `/verify-panel`\n' +
          '- `/setup-welcome`\n\n' +
          'If you select this dropdown option, the bot will set everything up automatically.'
      },
      setup: {
        title: '🛠️ Setup Help',
        description:
          'Use **/setup** to configure Step Mod!Z BOT manually for your server.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'The verify system is **optional**.\n\n' +
          '**Setup:**\n' +
          '1. Optionally set a verify role in **/setup**\n' +
          '2. Then use **/verify-panel**\n' +
          '3. The bot sends a panel with a verification button'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'The ticket system allows users to open private support tickets.'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'The whitelist system creates application channels for DayZ.'
      },
      validator: {
        title: '🧪 Validator Help',
        description:
          'Use **/validate** to check JSON, XML and DayZ files.'
      },
      settings: {
        title: '⚙️ Settings Help',
        description:
          'Use **/settings** to view the currently saved server configuration.'
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