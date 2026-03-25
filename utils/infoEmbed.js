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
        name: isEn ? '⚡ Quick Setup' : '⚡ Schnell Einrichtung',
        value: isEn
          ? 'Use the dropdown and choose **Step BOT Quick Setup**. This is the only option that automatically creates the structure.'
          : 'Nutze das Dropdown und wähle **Step BOT Schnell Einrichtung**. Nur diese Option erstellt automatisch die Struktur.',
        inline: false
      },
      {
        name: isEn ? '🛠️ /setup' : '🛠️ /setup',
        value: isEn
          ? '`/setup` only saves settings and does not create channels automatically.'
          : '`/setup` speichert nur Einstellungen und erstellt keine Channels automatisch.',
        inline: false
      },
      {
        name: isEn ? '🎫 Ticket / 📋 Whitelist / 👋 Welcome' : '🎫 Ticket / 📋 Whitelist / 👋 Welcome',
        value: isEn
          ? 'After quick setup, the bot prepares the channels for you.'
          : 'Nach der Schnell Einrichtung bereitet der Bot die Channels für dich vor.',
        inline: false
      },
      {
        name: isEn ? '🧪 Validator' : '🧪 Validator',
        value: isEn
          ? 'Use `/validate` to check JSON, XML and DayZ files.'
          : 'Nutze `/validate`, um JSON-, XML- und DayZ-Dateien zu prüfen.',
        inline: false
      }
    )
    .setFooter({ text: t(language, 'checkedBy') })
    .setTimestamp();
}