import { EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from './config.js';

async function fetchNitradoServer(token, serviceId) {
  const res = await fetch(`https://api.nitrado.net/services/${serviceId}/gameservers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }).catch(() => null);

  if (!res || !res.ok) {
    return null;
  }

  const json = await res.json().catch(() => null);
  return json?.data?.gameserver || null;
}

function buildServerStatusEmbed(server) {
  if (!server) {
    return new EmbedBuilder()
      .setTitle('🧟 DayZ Server Status')
      .setDescription(
        [
          '🔴 **Offline / Nicht erreichbar**',
          '',
          'Der Server konnte aktuell nicht geladen werden.',
          'Prüfe Token, Service oder versuche es später erneut.'
        ].join('\n')
      )
      .setColor(0xef4444)
      .setFooter({ text: 'Step Mod!Z BOT • Live Status' })
      .setTimestamp();
  }

  const online = server.status === 'started';
  const hostname = server?.settings?.config?.hostname || 'Unbekannter Server';
  const map =
    server?.game_specific?.map ||
    server?.settings?.config?.template ||
    server?.settings?.config?.map ||
    'Unbekannt';

  const currentPlayers =
    server?.query?.player_current ??
    server?.player_current ??
    0;

  const maxPlayers =
    server?.query?.player_max ??
    server?.slots ??
    server?.player_max ??
    '?';

  return new EmbedBuilder()
    .setTitle('🧟 DayZ Server Status')
    .setDescription(
      [
        `${online ? '🟢 **Online**' : '🔴 **Offline**'}`,
        '',
        `**Server:** ${hostname}`,
        `**Spieler:** ${currentPlayers} / ${maxPlayers}`,
        `**Map:** ${map}`
      ].join('\n')
    )
    .setColor(online ? 0x22c55e : 0xef4444)
    .setFooter({ text: 'Step Mod!Z BOT • Live Status' })
    .setTimestamp();
}

export async function updateServerStatusMessage(guild) {
  const config = getGuildConfig(guild.id) || {};

  if (!config?.nitradoToken || !config?.nitradoServiceId || !config?.serverStatusChannelId) {
    return { ok: false, reason: 'missing_config' };
  }

  const channel =
    guild.channels.cache.get(config.serverStatusChannelId) ||
    await guild.channels.fetch(config.serverStatusChannelId).catch(() => null);

  if (!channel) {
    return { ok: false, reason: 'missing_channel' };
  }

  const server = await fetchNitradoServer(config.nitradoToken, config.nitradoServiceId);
  const embed = buildServerStatusEmbed(server);

  let message = null;

  if (config.serverStatusMessageId) {
    message = await channel.messages.fetch(config.serverStatusMessageId).catch(() => null);
  }

  if (message) {
    await message.edit({ embeds: [embed] }).catch(() => null);
    return { ok: true, updated: true };
  }

  const sent = await channel.send({ embeds: [embed] }).catch(() => null);

  if (!sent) {
    return { ok: false, reason: 'send_failed' };
  }

  setGuildConfig(guild.id, {
    ...config,
    serverStatusMessageId: sent.id
  });

  return { ok: true, updated: false };
}