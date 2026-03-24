import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder
} from 'discord.js';
import { getGuildConfig } from './config.js';

export function buildVerifyEmbed() {
  return new EmbedBuilder()
    .setTitle('✅ Verifizierung')
    .setDescription(
      [
        'Willkommen auf dem Server.',
        '',
        'Klicke auf den Button unten, um dich zu verifizieren und Zugriff auf alle Bereiche zu erhalten.'
      ].join('\n')
    )
    .setFooter({ text: 'Step Mod!Z BOT • Free DayZ Console Discord Bot' })
    .setTimestamp();
}

export function buildVerifyRow() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId('stepmodz_verify_button')
      .setLabel('Verifizieren')
      .setEmoji('✅')
      .setStyle(ButtonStyle.Success)
  );
}

export async function verifyMember(member) {
  const config = getGuildConfig(member.guild.id);

  if (!config?.verifyRoleId) {
    throw new Error('Für diesen Server wurde keine Verify-Rolle gesetzt.');
  }

  if (member.roles.cache.has(config.verifyRoleId)) {
    return { alreadyVerified: true };
  }

  await member.roles.add(
    config.verifyRoleId,
    'User hat sich über den Verify-Button verifiziert'
  );

  if (config.unverifiedRoleId && member.roles.cache.has(config.unverifiedRoleId)) {
    await member.roles.remove(
      config.unverifiedRoleId,
      'User wurde erfolgreich verifiziert'
    );
  }

  return { alreadyVerified: false };
}
