import { EmbedBuilder } from 'discord.js';
import { getGuildConfig } from './config.js';

export function buildWelcomeEmbed(guildName, member = null) {
  return new EmbedBuilder()
    .setTitle('👋 Willkommen bei Step Mod!Z BOT')
    .setDescription(
      [
        member ? `Willkommen ${member}!` : 'Willkommen auf dem Server!',
        '',
        'Bitte lies die Regeln und verifiziere dich, um Zugriff auf alle Bereiche zu erhalten.',
        '',
        'Danach kannst du Tickets öffnen oder dich für die DayZ Whitelist bewerben.'
      ].join('\n')
    )
    .setFooter({ text: `${guildName} • DayZ Console Community` })
    .setTimestamp();
}

export async function sendWelcomeMessage(member) {
  const config = getGuildConfig(member.guild.id);

  if (!config?.welcomeChannelId) return;

  const channel = await member.guild.channels
    .fetch(config.welcomeChannelId)
    .catch(() => null);

  if (!channel || !channel.isTextBased()) return;

  await channel.send({
    embeds: [buildWelcomeEmbed(member.guild.name, member)]
  });
}
