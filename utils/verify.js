import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { getGuildConfig } from './config.js';

const DEFAULT_VERIFY_MESSAGE = [
  'Klicke auf den Button unten, um dich zu verifizieren.',
  '',
  'Nach erfolgreicher Verifizierung bekommst du Zugriff auf die freigeschalteten Bereiche.'
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
    .setTitle('🔐 Verifizierung')
    .setDescription(description)
    .setColor(0x22c55e)
    .setFooter({ text: 'Step Mod!Z BOT • Verify System' })
    .setTimestamp();
}

export function buildVerifyRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_verify')
      .setLabel('Verifizieren')
      .setStyle(ButtonStyle.Success)
  );
}

export function getDefaultVerifyMessage() {
  return DEFAULT_VERIFY_MESSAGE;
}