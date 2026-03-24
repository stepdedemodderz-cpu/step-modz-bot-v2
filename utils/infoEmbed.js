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
        ? 'Welcome to **Step Mod!Z BOT**.\n\nThis bot helps you with verification, welcome system, tickets, whitelist and DayZ file validation.'
        : 'Willkommen bei **Step Mod!Z BOT**.\n\nDieser Bot hilft dir bei Verifizierung, Welcome-System, Tickets, Whitelist und DayZ-Datei-Validierung.'
    )
    .addFields(
      {
        name: isEn ? '⚡ Quick Setup via Dropdown' : '⚡ Schnell Einrichtung über Dropdown',
        value: isEn
          ? 'Use the dropdown in the main bot channel and choose **Step BOT Quick Setup**. The bot will automatically create the main categories and info channels for you.'
          : 'Nutze das Dropdown im Haupt-Channel des Bots und wähle **Step BOT Schnell Einrichtung**. Der Bot erstellt dann automatisch die wichtigsten Kategorien und Info-Channels für dich.',
        inline: false
      },
      {
        name: isEn ? '🛠️ Manual Setup' : '🛠️ Manuelles Setup',
        value: isEn
          ? 'You can still use **/setup** if you want to configure roles and channels manually.'
          : 'Du kannst weiterhin **/setup** nutzen, wenn du Rollen und Channels manuell setzen möchtest.',
        inline: false
      },
      {
        name: isEn ? '🎫 Ticket System' : '🎫 Ticket System',
        value: isEn
          ? 'Use **/ticket-panel** after setup to send the ticket button panel.'
          : 'Nutze nach dem Setup **/ticket-panel**, um das Ticket-Panel zu senden.',
        inline: false
      },
      {
        name: isEn ? '📋 Whitelist System' : '📋 Whitelist System',
        value: isEn
          ? 'Use **/whitelist-panel** after setup to send the whitelist panel.'
          : 'Nutze nach dem Setup **/whitelist-panel**, um das Whitelist-Panel zu senden.',
        inline: false
      },
      {
        name: isEn ? '🔐 Verify System' : '🔐 Verify System',
        value: isEn
          ? 'Verify is optional. If needed, set a verify role and use **/verify-panel**.'
          : 'Verify ist optional. Wenn du es nutzen willst, setze eine Verify Rolle und nutze **/verify-panel**.',
        inline: false
      },
      {
        name: isEn ? '🧪 Validator' : '🧪 Validator',
        value: isEn
          ? 'Use **/validate** to check JSON, XML and DayZ files automatically.'
          : 'Nutze **/validate**, um JSON-, XML- und DayZ-Dateien automatisch zu prüfen.',
        inline: false
      }
    )
    .setFooter({ text: t(language, 'checkedBy') })
    .setTimestamp();
}