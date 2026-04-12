import { getGuildConfig } from './config.js';
import { findAdmLogFile, downloadFileText } from './nitrado.js';
import { addKill } from './stats.js';

const lastProcessedIndexByGuild = new Map();
const pollState = {
  started: false
};

function normalizeLine(line) {
  return String(line || '').trim();
}

function parseWeapon(line) {
  const match =
    line.match(/\bwith\s+([A-Za-z0-9_\-\. ]{2,60})/i) ||
    line.match(/\bweapon\s*[:\-]\s*([A-Za-z0-9_\-\. ]{2,60})/i);

  return match?.[1]?.trim() || null;
}

function parseDistance(line) {
  const match =
    line.match(/\bfrom\s+([0-9]+(?:\.[0-9]+)?)\s*m\b/i) ||
    line.match(/\bdistance\s*[:\-]?\s*([0-9]+(?:\.[0-9]+)?)\s*m\b/i);

  return match?.[1] ? `${match[1]}m` : null;
}

function parseHeadshot(line) {
  return /\bheadshot\b/i.test(line);
}

function parsePlayers(line) {
  const quoted = [...line.matchAll(/"([^"]+)"/g)].map((m) => m[1]);

  if (quoted.length >= 2) {
    return { killer: quoted[0], victim: quoted[1] };
  }

  return null;
}

function parseKillLine(line) {
  if (!line.toLowerCase().includes('killed')) return null;

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

  if (!config?.killfeedEnabled) {
    console.log(`[KILLFEED] ${guild.name}: killfeedEnabled fehlt`);
    return;
  }

  if (!config?.killfeedChannelId) {
    console.log(`[KILLFEED] ${guild.name}: killfeedChannelId fehlt`);
    return;
  }

  if (!config?.nitradoToken) {
    console.log(`[KILLFEED] ${guild.name}: nitradoToken fehlt`);
    return;
  }

  if (!config?.nitradoServiceId) {
    console.log(`[KILLFEED] ${guild.name}: nitradoServiceId fehlt`);
    return;
  }

  const channel =
    guild.channels.cache.get(config.killfeedChannelId) ||
    await guild.channels.fetch(config.killfeedChannelId).catch(() => null);

  if (!channel) {
    console.log(`[KILLFEED] ${guild.name}: killfeed channel nicht gefunden`);
    return;
  }

  const activityChannel = config.serverActivityChannelId
    ? (
        guild.channels.cache.get(config.serverActivityChannelId) ||
        await guild.channels.fetch(config.serverActivityChannelId).catch(() => null)
      )
    : null;

  const admFile = await findAdmLogFile(config.nitradoToken, config.nitradoServiceId).catch((err) => {
    console.error(`[KILLFEED] ${guild.name}: ADM Suche fehlgeschlagen`, err);
    return null;
  });

  if (!admFile?.path) {
    console.log(`[KILLFEED] ${guild.name}: keine ADM Logdatei gefunden`);
    return;
  }

  console.log(`[KILLFEED] ${guild.name}: ADM Datei -> ${admFile.path}`);

  const content = await downloadFileText(
    config.nitradoToken,
    config.nitradoServiceId,
    admFile.path
  ).catch((err) => {
    console.error(`[KILLFEED] ${guild.name}: Download fehlgeschlagen`, err);
    return null;
  });

  if (!content) {
    console.log(`[KILLFEED] ${guild.name}: keine Log-Inhalte geladen`);
    return;
  }

  const lines = content.split(/\r?\n/).map(normalizeLine).filter(Boolean);

  if (!lines.length) {
    console.log(`[KILLFEED] ${guild.name}: Log ist leer`);
    return;
  }

  let lastIndex = lastProcessedIndexByGuild.get(guild.id) ?? -1;

  if (lastIndex >= lines.length) {
    lastIndex = -1;
  }

  const newLines = lines.slice(lastIndex + 1);

  console.log(`[KILLFEED] ${guild.name}: ${newLines.length} neue Zeilen`);

  for (const line of newLines) {
    const kill = parseKillLine(line);
    if (kill) {
      console.log(`[KILLFEED] ${guild.name}: Kill erkannt -> ${kill.killer} vs ${kill.victim}`);

      addKill(guild.id, kill.killer, kill.victim);

      await channel.send({
        embeds: [buildKillEmbed(kill)]
      }).catch((err) => {
        console.error(`[KILLFEED] ${guild.name}: Senden Kill fehlgeschlagen`, err);
      });
    }

    const activity = parseConnection(line);
    if (activity && activityChannel) {
      if (activity.type === 'join') {
        await activityChannel.send(`📥 **${activity.player}** ist dem Server beigetreten`).catch(() => null);
      }

      if (activity.type === 'leave') {
        await activityChannel.send(`📤 **${activity.player}** hat den Server verlassen`).catch(() => null);
      }
    }
  }

  lastProcessedIndexByGuild.set(guild.id, lines.length - 1);
}

export function startKillfeed(client) {
  if (pollState.started) return;
  pollState.started = true;

  console.log('[KILLFEED] Polling gestartet');

  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      try {
        await processGuildKillfeed(guild);
      } catch (err) {
        console.error(`[KILLFEED] Fehler auf ${guild.name}:`, err);
      }
    }
  }, 20000);
}