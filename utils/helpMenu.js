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
        description: 'Learn how manual setup works'
      },
      {
        label: 'Verify System',
        value: 'verify',
        description: 'How verify works'
      },
      {
        label: 'Ticket System',
        value: 'tickets',
        description: 'How tickets work'
      },
      {
        label: 'Whitelist System',
        value: 'whitelist',
        description: 'How whitelist works'
      },
      {
        label: 'Validator',
        value: 'validator',
        description: 'How the validator works'
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
      description: 'Erklärt das manuelle Setup'
    },
    {
      label: 'Verify System',
      value: 'verify',
      description: 'Erklärt das Verify System'
    },
    {
      label: 'Ticket System',
      value: 'tickets',
      description: 'Erklärt das Ticket System'
    },
    {
      label: 'Whitelist System',
      value: 'whitelist',
      description: 'Erklärt das Whitelist System'
    },
    {
      label: 'Validator',
      value: 'validator',
      description: 'Erklärt den Validator'
    },
    {
      label: 'Settings',
      value: 'settings',
      description: 'Zeigt gespeicherte Einstellungen'
    }
  ];
}

export function buildHelpEmbed(language = 'de', topic = 'setup') {
  const map = {
    de: {
      quicksetup: {
        title: '⚡ Step BOT Schnell Einrichtung',
        description:
          'Wenn du diese Option auswählst, richtet der Bot fast alles automatisch für dich ein.\n\n' +
          '**Automatisch erstellt werden:**\n' +
          '• Welcome\n' +
          '• Roles\n' +
          '• Ticket\n' +
          '• Whitelist\n' +
          '• Validator\n\n' +
          '**Danach musst du nur noch wenig selbst machen.**'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          '`/setup` speichert nur Einstellungen.\n\n' +
          '**Wichtig:**\n' +
          '• `/setup` erstellt keine Kategorien oder Channels automatisch.\n' +
          '• Für die automatische Einrichtung nutze **Step BOT Schnell Einrichtung**.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Verify ist optional.\n\n' +
          '**So nutzt du es:**\n' +
          '• optional Verify Rolle mit `/setup` setzen\n' +
          '• danach `/verify-panel` nutzen'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Das Ticket System erstellt private Support-Tickets.\n\n' +
          '**So nutzt du es:**\n' +
          '• Schnell Einrichtung nutzen oder Ticket Kategorie manuell setzen\n' +
          '• danach `/ticket-panel` nutzen'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Das Whitelist System erstellt Bewerbungs-Channels.\n\n' +
          '**So nutzt du es:**\n' +
          '• Schnell Einrichtung nutzen oder Kategorie manuell setzen\n' +
          '• danach `/whitelist-panel` nutzen'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Mit `/validate` kannst du JSON-, XML- und DayZ-Dateien prüfen.'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Mit `/settings` siehst du deine aktuell gespeicherten Einstellungen.'
      }
    },
    en: {
      quicksetup: {
        title: '⚡ Step BOT Quick Setup',
        description:
          'This option lets the bot automatically create almost everything for you.'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          '`/setup` only saves settings. It does not create channels or categories automatically.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Verify is optional. Set a verify role if needed and then use `/verify-panel`.'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Use quick setup or set a ticket category manually, then use `/ticket-panel`.'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Use quick setup or set a whitelist category manually, then use `/whitelist-panel`.'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Use `/validate` to check JSON, XML and DayZ files.'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Use `/settings` to review saved settings.'
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