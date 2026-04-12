import { EmbedBuilder } from 'discord.js';
import { getGuildConfig } from './config.js';

let lastStatusMessage = new Map();
let lastOnlineState = new Map();

async function fetchServer(token, serviceId) {
  const res = await fetch(`https://api.nitrado.net/services/${serviceId}/gameservers`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  const data = await res.json();
  return data.data.gameserver;
}

function buildEmbed(server) {
  const online = server.status === 'started';

  return new EmbedBuilder()
    .setTitle('🧟 DayZ Server Status')
    .setDescription(
      [
        `${online ? '🟢 **Online**' : '🔴 **Offline**'}`,
        '',
        `**Server:** ${server.settings?.config?.hostname || 'Unbekannt'}`,
        `**Spieler:** ${server.query?.player_current || 0} / ${server.query?.player_max || 0}`,
        `**Map:** ${server.settings?.config?.map || 'Unbekannt'}`
      ].join('\n')
    )
    .setColor(online ? 0x22c55e : 0xef4444)
    .setFooter({ text: 'Step Mod!Z BOT • Live Status' })
    .setTimestamp();
}

export async function updateServerStatusMessage(guild) {
  const config = getGuildConfig(guild.id);

  if (!config?.nitradoToken || !config?.nitradoServiceId || !config?.serverStatusChannelId) {
    return;
  }

  const channel = guild.channels.cache.get(config.serverStatusChannelId);
  if (!channel) return;

  try {
    const server = await fetchServer(config.nitradoToken, config.nitradoServiceId);
    const embed = buildEmbed(server);

    let messageId = lastStatusMessage.get(guild.id);

    if (messageId) {
      const msg = await channel.messages.fetch(messageId).catch(() => null);
      if (msg) {
        await msg.edit({ embeds: [embed] });
      }
    } else {
      const msg = await channel.send({ embeds: [embed] });
      lastStatusMessage.set(guild.id, msg.id);
    }

    // 🔴 Offline Alert
    const wasOnline = lastOnlineState.get(guild.id);
    const isOnline = server.status === 'started';

    if (wasOnline !== undefined && wasOnline !== isOnline) {
      if (!isOnline) {
        await channel.send('🔴 **Server ist OFFLINE gegangen!**');
      } else {
        await channel.send('🟢 **Server ist wieder ONLINE!**');
      }
    }

    lastOnlineState.set(guild.id, isOnline);

  } catch (err) {
    console.error('Server Status Fehler:', err);
  }
}