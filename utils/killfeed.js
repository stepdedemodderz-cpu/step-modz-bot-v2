import { getGuildConfig } from './config.js';
import { findAdmLogFile, downloadFileText } from './nitrado.js';
import { addKill } from './stats.js'; // 🔥 NEU

const lastProcessedIndexByGuild = new Map();
const pollState = {
  started: false
};

function normalizeLine(line) {
  return String(line || '').trim();
}

// 🔫 Waffe
function parseWeapon(line) {
  const match =
    line.match(/\bwith\s+([A-Za-z0-9_\-\. ]{2,60})/i) ||
    line.match(/\bweapon\s*[:\-]\s*([A-Za-z0-9_\-\. ]{2,60})/i);

  return match?.[1]?.trim() || null;
}

// 📏 Distanz
function parseDistance(line) {
  const match =
    line.match(/\bfrom\s+([0-9]+(?:\.[0-9]+)?)\s*m\b/i) ||
    line.match(/\bdistance\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*m\b/i);

  return match?.[1] ? `${match[1]}m` : null;
}

// 🎯 Headshot
function parseHeadshot(line) {
  return /\bheadshot\b/i.test(line);
}

// 👤 Spieler
function parsePlayers(line) {
  const quoted = [...line.matchAll(/"([^"]+)"/g)].map(m => m[1]);

  if (quoted.length >= 2) {
    return { killer: quoted[0], victim: quoted[1] };
  }

  return null;
}

// 💀 Kill
function parseKillLine(line) {
  if (!line.includes('killed')) return null;

  const players = parsePlayers(line);
  if (!players) return null;

  return {
    killer: players.killer,
    victim: players.victim,
    weapon: parseWeapon(line),
    distance: parseDistance(line),
    headshot: parseHeadshot(line)
  };
}

// 📡 JOIN / LEAVE
function parseConnection(line) {
  if (/connected/i.test(line)) {
    const match = line.match(/"(.+?)"/);
    if (match) return { type: 'join', player: match[1] };
  }

  if (/disconnected/i.test(line)) {
    const match = line.match(/"(.+?)"/);
    if (match) return { type: 'leave', player: match[1] };
  }

  return null;
}

// 🎨 Embed
function buildKillEmbed(kill) {
  return {
    title: '💀 Killfeed',
    description: `**${kill.killer}** hat **${kill.victim}** getötet`,
    color: 0xef4444,
    fields: [
      {
        name: '🔫 Waffe',
        value: kill.weapon || 'Unbekannt',
        inline: true
      },
      {
        name: '📏 Distanz',
        value: kill.distance || 'Unbekannt',
        inline: true
      },
      {
        name: '🎯 Treffer',
        value: kill.headshot ? 'Headshot' : 'Normal',
        inline: true
      }
    ],
    timestamp: new Date().toISOString()
  };
}

async function processGuildKillfeed(guild) {
  const config = getGuildConfig(guild.id);

  if (!config?.killfeedEnabled || !config?.killfeedChannelId) return;

  const channel = guild.channels.cache.get(config.killfeedChannelId);
  if (!channel) return;

  const activityChannel = config.serverActivityChannelId
    ? guild.channels.cache.get(config.serverActivityChannelId)
    : null;

  const admFile = await findAdmLogFile(config.nitradoToken, config.nitradoServiceId);
  if (!admFile?.path) return;

  const content = await downloadFileText(
    config.nitradoToken,
    config.nitradoServiceId,
    admFile.path
  );

  const lines = content.split('\n').map(normalizeLine).filter(Boolean);

  let lastIndex = lastProcessedIndexByGuild.get(guild.id) ?? -1;

  if (lastIndex >= lines.length) {
    lastIndex = -1;
  }

  const newLines = lines.slice(lastIndex + 1);

  for (const line of newLines) {
    // 💀 KILLS + STATS
    const kill = parseKillLine(line);
    if (kill) {

      // 🔥 STATS SPEICHERN
      addKill(guild.id, kill.killer, kill.victim);

      await channel.send({
        embeds: [buildKillEmbed(kill)]
      }).catch(() => null);
    }

    // 📡 JOIN / LEAVE
    const activity = parseConnection(line);
    if (activity && activityChannel) {
      if (activity.type === 'join') {
        await activityChannel.send(`📥 **${activity.player}** ist dem Server beigetreten`);
      }

      if (activity.type === 'leave') {
        await activityChannel.send(`📤 **${activity.player}** hat den Server verlassen`);
      }
    }
  }

  lastProcessedIndexByGuild.set(guild.id, lines.length - 1);
}

export function startKillfeed(client) {
  if (pollState.started) return;
  pollState.started = true;

  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      try {
        await processGuildKillfeed(guild);
      } catch (err) {
        console.error('Killfeed Fehler:', err);
      }
    }
  }, 20000);
}