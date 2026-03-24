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
        description: 'What the verify system does and how to enable it'
      },
      {
        label: 'Ticket System',
        value: 'tickets',
        description: 'What the ticket system does and how to enable it'
      },
      {
        label: 'Whitelist System',
        value: 'whitelist',
        description: 'What the whitelist system does and how to enable it'
      },
      {
        label: 'Validator',
        value: 'validator',
        description: 'What the validator does and how to use it'
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
      description: 'Erklärt das Verify System und wie man es aktiviert'
    },
    {
      label: 'Ticket System',
      value: 'tickets',
      description: 'Erklärt das Ticket System und wie man es aktiviert'
    },
    {
      label: 'Whitelist System',
      value: 'whitelist',
      description: 'Erklärt das Whitelist System und wie man es aktiviert'
    },
    {
      label: 'Validator',
      value: 'validator',
      description: 'Erklärt den JSON / XML / DayZ Validator'
    },
    {
      label: 'Settings',
      value: 'settings',
      description: 'Zeigt die gespeicherten Bot-Einstellungen'
    }
  ];
}

export function buildHelpEmbed(language = 'de', topic = 'setup') {
  const map = {
    de: {
      quicksetup: {
        title: '⚡ Step BOT Schnell Einrichtung',
        description:
          'Mit dieser Funktion richtet der Bot die komplette Grundstruktur automatisch für dich ein.\n\n' +
          '**Was automatisch erstellt wird:**\n' +
          '- Welcome\n' +
          '- Roles\n' +
          '- Ticket\n' +
          '- Whitelist\n' +
          '- Validator\n' +
          '- passende Info-Channels\n\n' +
          '**Was danach noch gemacht werden kann:**\n' +
          '- `/ticket-panel`\n' +
          '- `/whitelist-panel`\n' +
          '- `/verify-panel`\n' +
          '- `/setup-welcome`\n\n' +
          '**Wichtig:**\n' +
          'Nur diese Dropdown-Option erstellt automatisch alles.'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          'Mit `/setup` speicherst du Einstellungen wie Rollen und Kategorien.\n\n' +
          '**Wichtig:**\n' +
          '`/setup` erstellt **keine** Channels oder Kategorien automatisch.\n\n' +
          '**Wenn du alles automatisch erstellen willst:**\n' +
          'Nutze im Dropdown **Step BOT Schnell Einrichtung**.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'Das Verify System ist optional.\n\n' +
          '**Wenn du es nutzen möchtest:**\n' +
          '1. Optional in `/setup` eine Verify Rolle setzen\n' +
          '2. Danach `/verify-panel` benutzen\n' +
          '3. Nutzer klicken auf den Verify Button'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'Das Ticket System erstellt private Support-Tickets.\n\n' +
          '**Wenn du es nutzen möchtest:**\n' +
          '1. Entweder Ticket Kategorie manuell in `/setup` setzen\n' +
          '2. Oder **Step BOT Schnell Einrichtung** nutzen\n' +
          '3. Danach `/ticket-panel` benutzen'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'Das Whitelist System erstellt Bewerbungs-Channels für DayZ.\n\n' +
          '**Wenn du es nutzen möchtest:**\n' +
          '1. Entweder Whitelist Kategorie manuell in `/setup` setzen\n' +
          '2. Oder **Step BOT Schnell Einrichtung** nutzen\n' +
          '3. Danach `/whitelist-panel` benutzen'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Mit `/validate` kannst du JSON-, XML- und DayZ-Dateien prüfen.\n\n' +
          '**Benutzung:**\n' +
          '1. `/validate` nutzen\n' +
          '2. Datei hochladen\n' +
          '3. Bot erkennt den Typ automatisch\n' +
          '4. Ergebnis lesen'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Mit `/settings` kannst du prüfen, welche Rollen, Kategorien und Channels aktuell gespeichert sind.'
      }
    },
    en: {
      quicksetup: {
        title: '⚡ Step BOT Quick Setup',
        description:
          'This option lets the bot automatically create the full base structure.\n\n' +
          '**Automatically created:**\n' +
          '- Welcome\n' +
          '- Roles\n' +
          '- Ticket\n' +
          '- Whitelist\n' +
          '- Validator\n' +
          '- matching info channels\n\n' +
          '**After that you can still use:**\n' +
          '- `/ticket-panel`\n' +
          '- `/whitelist-panel`\n' +
          '- `/verify-panel`\n' +
          '- `/setup-welcome`\n\n' +
          '**Important:**\n' +
          'Only this dropdown option creates everything automatically.'
      },
      setup: {
        title: '🛠️ Setup',
        description:
          'Use `/setup` to save settings like roles and categories.\n\n' +
          '**Important:**\n' +
          '`/setup` does **not** create channels or categories automatically.\n\n' +
          '**If you want everything created automatically:**\n' +
          'Use **Step BOT Quick Setup** in the dropdown.'
      },
      verify: {
        title: '🔐 Verify System',
        description:
          'The verify system is optional.\n\n' +
          'If you want to use it:\n' +
          '1. Optionally set a verify role in `/setup`\n' +
          '2. Then use `/verify-panel`\n' +
          '3. Users click the verify button'
      },
      tickets: {
        title: '🎫 Ticket System',
        description:
          'The ticket system creates private support tickets.\n\n' +
          'If you want to use it:\n' +
          '1. Either set a ticket category manually in `/setup`\n' +
          '2. Or use **Step BOT Quick Setup**\n' +
          '3. Then use `/ticket-panel`'
      },
      whitelist: {
        title: '📋 Whitelist System',
        description:
          'The whitelist system creates application channels for DayZ.\n\n' +
          'If you want to use it:\n' +
          '1. Either set a whitelist category manually in `/setup`\n' +
          '2. Or use **Step BOT Quick Setup**\n' +
          '3. Then use `/whitelist-panel`'
      },
      validator: {
        title: '🧪 Validator',
        description:
          'Use `/validate` to check JSON, XML and DayZ files.'
      },
      settings: {
        title: '⚙️ Settings',
        description:
          'Use `/settings` to review which roles, categories and channels are currently saved.'
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