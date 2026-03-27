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
  'Danach kannst du auf den Button unten klicken, um dich zu verifizieren und alle freigeschalteten Kanäle zu sehen.'
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