import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { getGuildConfig } from './config.js';

const DEFAULT_VERIFY_MESSAGE = [
  'Bitte bestätige zuerst die Regeln.',
  '',
  'Sobald du die Regeln bestätigt hast, kannst du dich hier verifizieren.',
  '',
  '**Nach erfolgreicher Verifizierung:**',
  '• wird die Rolle **Unverify** entfernt',
  '• wird die Rolle **Verify** hinzugefügt',
  '• werden alle freigeschalteten Kanäle sichtbar'
].join('\n');

export function buildVerifyEmbed(guildId = null) {
  let description = DEFAULT_VERIFY_MESSAGE;

  if (guildId) {
    const config = getGuildConfig(guildId);
    if (config?.verifyPanelMessage) {
      description = config.verifyPanelMessage;
    }
  }

  return new EmbedBuilder()
    .setTitle('🔐 Server Verifizierung')
    .setDescription(description)
    .setColor(0x22c55e)
    .setFooter({ text: 'Step Mod!Z BOT • Verify System' })
    .setTimestamp();
}

export function buildVerifyRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_verify')
      .setLabel('✅ Verifizieren')
      .setStyle(ButtonStyle.Success)
  );
}