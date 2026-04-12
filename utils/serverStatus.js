import { EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from './config.js';

async function fetchNitradoServer(token, serviceId) {
  const res = await fetch(`https://api.nitrado.net/services/${serviceId}/gameservers`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json'
    }
  }).catch(() => null);

  if (!res || !res.ok) return null;

  const json = await res.json().catch(() => null);
  return json?.data?.gameserver || null;
}

function buildEmbed(server) {
  if (!server) {
    return new EmbedBuilder()
      .setTitle('🧟 DayZ Server Status')
      .setDescription('🔴 Server nicht erreichbar')
      .setColor(0xef4444);
  }

  const online = server.status === 'started';

  return new EmbedBuilder()
    .setTitle('🧟 DayZ Server Status')
    .setDescription(
      [
        online ? '🟢 Online' : '🔴 Offline',
        '',
        `**Server:** ${server?.settings?.config?.hostname || 'Unbekannt'}`,
        `**Spieler:** ${server?.query?.player_current ?? 0} / ${server?.query?.player_max ?? '?'}`,
        `**Map:** ${server?.game_specific?.map || 'Unbekannt'}`
      ].join('\n')
    )
    .setColor(online ? 0x22c55e : 0xef4444);
}

export async function updateServerStatusMessage(guild) {
  const config = getGuildConfig(guild.id) || {};

  if (!config.nitradoToken || !config.nitradoServiceId || !config.serverStatusChannelId) {
    return;
  }

  const channel = await guild.channels.fetch(config.serverStatusChannelId).catch(() => null);
  if (!channel) return;

  const server = await fetchNitradoServer(config.nitradoToken, config.nitradoServiceId);
  const embed = buildEmbed(server);

  let msg = null;

  if (config.serverStatusMessageId) {
    msg = await channel.messages.fetch(config.serverStatusMessageId).catch(() => null);
  }

  if (msg) {
    await msg.edit({ embeds: [embed] }).catch(() => null);
  } else {
    const sent = await channel.send({ embeds: [embed] }).catch(() => null);
    if (sent) {
      setGuildConfig(guild.id, {
        ...config,
        serverStatusMessageId: sent.id
      });
    }
  }
}