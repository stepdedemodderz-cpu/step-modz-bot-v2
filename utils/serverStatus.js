import { EmbedBuilder } from 'discord.js';
import { getGuildConfig, setGuildConfig } from './config.js';

function normalizePort(port) {
  const n = Number(port);
  return Number.isInteger(n) ? n : null;
}

export async function fetchBattleMetricsServer(ip, port) {
  const safePort = normalizePort(port);
  if (!ip || !safePort) return null;

  const url =
    `https://api.battlemetrics.com/servers` +
    `?filter[game]=dayz` +
    `&filter[search]=${encodeURIComponent(`${ip}:${safePort}`)}` +
    `&page[size]=100`;

  const res = await fetch(url, {
    headers: {
      Accept: 'application/json'
    }
  }).catch(() => null);

  if (!res || !res.ok) return null;

  const json = await res.json().catch(() => null);
  if (!json?.data?.length) return null;

  const match = json.data.find((item) => {
    const a = item?.attributes || {};
    return a.ip === ip && Number(a.port) === safePort;
  });

  return match || json.data[0] || null;
}

export function buildServerStatusEmbed(serverData, ip, port) {
  if (!serverData) {
    return new EmbedBuilder()
      .setTitle('🧟 DayZ Server Status')
      .setDescription(
        [
          '🔴 **Offline / Nicht gefunden**',
          '',
          `🌐 IP: \`${ip}\``,
          `🔌 Port: \`${port}\``,
          '',
          'Der Server konnte aktuell nicht gefunden werden.',
          'Prüfe IP und Port oder versuche es später erneut.'
        ].join('\n')
      )
      .setColor(0xef4444)
      .setFooter({ text: 'Step Mod!Z BOT • Live Status' })
      .setTimestamp();
  }

  const a = serverData.attributes || {};
  const details = a.details || {};

  const name = a.name || 'Unbekannter Server';
  const status = a.status || 'offline';
  const players = a.players ?? 0;
  const maxPlayers = a.maxPlayers ?? '?';
  const map = details.map || details.mapName || 'Unbekannt';

  return new EmbedBuilder()
    .setTitle('🧟 DayZ Server Status')
    .setDescription(
      [
        `${status === 'online' ? '🟢 **Online**' : '🔴 **Offline**'}`,
        '',
        `**Server:** ${name}`,
        `**Spieler:** ${players} / ${maxPlayers}`,
        `**Map:** ${map}`,
        `**IP:** \`${ip}\``,
        `**Port:** \`${port}\``
      ].join('\n')
    )
    .setColor(status === 'online' ? 0x22c55e : 0xef4444)
    .setFooter({ text: 'Step Mod!Z BOT • Live Status' })
    .setTimestamp();
}

export async function updateServerStatusMessage(guild) {
  const config = getGuildConfig(guild.id) || {};
  const ip = config.serverIP;
  const port = config.serverPort;
  const channelId = config.serverStatusChannelId;

  if (!ip || !port || !channelId) {
    return { ok: false, reason: 'missing_config' };
  }

  const channel =
    guild.channels.cache.get(channelId) ||
    await guild.channels.fetch(channelId).catch(() => null);

  if (!channel) {
    return { ok: false, reason: 'missing_channel' };
  }

  const serverData = await fetchBattleMetricsServer(ip, port);
  const embed = buildServerStatusEmbed(serverData, ip, port);

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