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
        ? 'Welcome to **Step Mod!Z BOT**.'
        : 'Willkommen bei **Step Mod!Z BOT**.'
    )
    .addFields(
      {
        name: isEn ? '⚡ Automatic setup' : '⚡ Automatische Einrichtung',
        value: isEn
          ? 'Use the dropdown and choose **Step BOT Quick Setup**.'
          : 'Nutze das Dropdown und wähle **Step BOT Schnell Einrichtung**.',
        inline: false
      },
      {
        name: isEn ? '🛠️ Commands' : '🛠️ Befehle',
        value: isEn
          ? 'All bot commands are owner-only, except `/validate` in `json-xml-validator`.'
          : 'Alle Bot-Befehle sind nur für den Server-Besitzer, außer `/validate` im Channel `json-xml-validator`.',
        inline: false
      },
      {
        name: isEn ? '🧪 Validator' : '🧪 Validator',
        value: isEn
          ? 'The validator is public for all users.'
          : 'Der Validator ist für alle User öffentlich nutzbar.',
        inline: false
      }
    )
    .setFooter({ text: t(language, 'checkedBy') })
    .setTimestamp();
}