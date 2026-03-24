import { EmbedBuilder } from 'discord.js';

export function getHelpMenuOptions(language = 'de') {
  if (language === 'en') {
    return [
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
      setup: {
        title: '🛠️ Setup Hilfe',
        description:
          'Mit **/setup** richtest du Step Mod!Z BOT für deinen Server ein.\n\n' +
          '**Was du tun musst:**\n' +
          '1. Nutze **/setup**\n' +
          '2. Wähle nur die Rollen und Channels aus, die du wirklich brauchst\n' +
          '3. Verify ist **optional** und kann leer bleiben\n' +
          '4. Danach kannst du die passenden Panels senden\n\n' +
          '**Wichtige Felder:**\n' +
          '- Verify Rolle → optional\n' +
          '- Welcome Channel → für Begrüßungen\n' +
          '- Ticket Kategorie → für Support-Tickets\n' +
          '- Whitelist Kategorie → für Bewerbungen'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Das Verify System ist **optional**.\n\n' +
          '**Was macht es?**\n' +
          'Nutzer können sich verifizieren und bekommen danach eine Rolle.\n\n' +
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
          '1. In **/setup** eine Ticket Kategorie setzen\n' +
          '2. Optional eine Support Rolle setzen\n' +
          '3. Danach **/ticket-panel** ausführen\n' +
          '4. Nutzer klicken auf den Button und ein Ticket wird erstellt'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Das Whitelist System erstellt Bewerbungs-Channels für DayZ.\n\n' +
          '**Einrichtung:**\n' +
          '1. In **/setup** eine Whitelist Kategorie setzen\n' +
          '2. Optional eine Review Rolle setzen\n' +
          '3. Optional eine Approved Rolle setzen\n' +
          '4. Danach **/whitelist-panel** ausführen\n' +
          '5. Nutzer können sich dann direkt bewerben'
      },
      validator: {
        title: '🧪 Validator Hilfe',
        description:
          'Mit **/validate** kannst du JSON-, XML- und DayZ-Dateien prüfen.\n\n' +
          '**Was macht es?**\n' +
          '- erkennt Syntaxfehler\n' +
          '- prüft JSON und XML automatisch\n' +
          '- erkennt DayZ Sonderfehler in `types.xml` und `events.xml`\n\n' +
          '**Benutzung:**\n' +
          '1. Nutze **/validate**\n' +
          '2. Lade eine Datei hoch\n' +
          '3. Wähle optional die Sprache\n' +
          '4. Der Bot zeigt Fehler oder Hinweise an'
      },
      settings: {
        title: '⚙️ Settings Hilfe',
        description:
          'Mit **/settings** kannst du die aktuell gespeicherten Einstellungen deines Servers sehen.\n\n' +
          '**Benutzung:**\n' +
          '1. Nutze **/settings**\n' +
          '2. Der Bot zeigt dir alle gesetzten Rollen, Kategorien und Channels\n' +
          '3. So kannst du schnell prüfen, ob dein Setup korrekt gespeichert wurde'
      }
    },
    en: {
      setup: {
        title: '🛠️ Setup Help',
        description:
          'Use **/setup** to configure Step Mod!Z BOT for your server.\n\n' +
          '**What to do:**\n' +
          '1. Run **/setup**\n' +
          '2. Only choose the roles and channels you really need\n' +
          '3. Verify is **optional** and can be left empty\n' +
          '4. Then send the matching panels\n\n' +
          '**Important fields:**\n' +
          '- Verify role → optional\n' +
          '- Welcome channel → for greetings\n' +
          '- Ticket category → for support tickets\n' +
          '- Whitelist category → for applications'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'The verify system is **optional**.\n\n' +
          '**What does it do?**\n' +
          'Users can verify themselves and receive a role afterwards.\n\n' +
          '**Setup:**\n' +
          '1. Optionally set a verify role in **/setup**\n' +
          '2. Then use **/verify-panel**\n' +
          '3. The bot sends a panel with a verification button'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'The ticket system allows users to open private support tickets.\n\n' +
          '**Setup:**\n' +
          '1. Set a ticket category in **/setup**\n' +
          '2. Optionally set a support role\n' +
          '3. Then run **/ticket-panel**\n' +
          '4. Users click the button and a ticket is created'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'The whitelist system creates application channels for DayZ.\n\n' +
          '**Setup:**\n' +
          '1. Set a whitelist category in **/setup**\n' +
          '2. Optionally set a review role\n' +
          '3. Optionally set an approved role\n' +
          '4. Then run **/whitelist-panel**\n' +
          '5. Users can apply directly'
      },
      validator: {
        title: '🧪 Validator Help',
        description:
          'Use **/validate** to check JSON, XML and DayZ files.\n\n' +
          '**What does it do?**\n' +
          '- detects syntax errors\n' +
          '- validates JSON and XML automatically\n' +
          '- detects DayZ-specific issues in `types.xml` and `events.xml`\n\n' +
          '**Usage:**\n' +
          '1. Run **/validate**\n' +
          '2. Upload a file\n' +
          '3. Optionally choose a language\n' +
          '4. The bot shows errors or warnings'
      },
      settings: {
        title: '⚙️ Settings Help',
        description:
          'Use **/settings** to view the currently saved server configuration.\n\n' +
          '**Usage:**\n' +
          '1. Run **/settings**\n' +
          '2. The bot shows all saved roles, categories and channels\n' +
          '3. This helps you verify whether your setup is correct'
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