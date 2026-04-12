import { getGuildConfig } from './config.js';
import { findAdmLogFile, downloadFileText } from './nitrado.js';

const lastProcessedLineByGuild = new Map();
const pollState = {
  started: false
};

function normalizeLine(line) {
  return String(line || '').trim();
}

function parseWeapon(line) {
  const weaponPatterns = [
    /\bwith\s+([A-Za-z0-9_\-\. ]{2,60})/i,
    /\bweapon\s*[:\-]\s*([A-Za-z0-9_\-\. ]{2,60})/i
  ];

  for (const pattern of weaponPatterns) {
    const match = line.match(pattern);
    if (match?.[1]) {
      return match[1].trim();
    }
  }

  return null;
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
  const quoted = [...line.matchAll(/"([^"]+)"/g)].map((m) => m[1]).filter(Boolean);

  if (quoted.length >= 2) {
    return {
      killer: quoted[0],
      victim: quoted[1]
    };
  }

  const killedMatch = line.match(/([A-Za-z0-9_\-\.]+)\s+killed\s+([A-Za-z0-9_\-\.]+)/i);
  if (killedMatch) {
    return {
      killer: killedMatch[1],
      victim: killedMatch[2]
    };
  }

  return null;
}

function parseKillLine(line) {
  const clean = normalizeLine(line);

  if (!clean) return null;
  if (!/\bkilled\b/i.test(clean)) return null;

  const players = parsePlayers(clean);
  if (!players) return null;

  return {
    killer: players.killer,
    victim: players.victim,
    weapon: parseWeapon(clean),
    distance: parseDistance(clean),
    headshot: parseHeadshot(clean),
    raw: clean
  };
}

function buildKillEmbed(kill) {
  const extra = [];

  if (kill.weapon) {
    extra.push(`🔫 **Waffe:** ${kill.weapon}`);
  }

  if (kill.distance) {
    extra.push(`📏 **Distanz:** ${kill.distance}`);
  }

  if (kill.headshot) {
    extra.push('🎯 **Headshot**');
  }

  return {
    title: '💀 Killfeed',
    description: [
      `**${kill.killer}** hat **${kill.victim}** getötet`,
      '',
      ...extra
    ].join('\n'),
    color: 0xef4444,
    timestamp: new Date().toISOString()
  };
}

async function processGuildKillfeed(guild) {
  const config = getGuildConfig(guild.id);

  if (!config?.killfeedEnabled || !config?.killfeedChannelId || !config?.nitradoToken || !config?.nitradoServiceId) {
    return;
  }

  const channel = guild.channels.cache.get(config.killfeedChannelId);
  if (!channel) return;

  const admFile = await findAdmLogFile(config.nitradoToken, config.nitradoServiceId);
  if (!admFile?.path) return;

  const content = await downloadFileText(config.nitradoToken, config.nitradoServiceId, admFile.path);
  const lines = content
    .split(/\r?\n/)
    .map(normalizeLine)
    .filter(Boolean);

  if (lines.length === 0) return;

  const lastSeen = lastProcessedLineByGuild.get(guild.id);

  if (!lastSeen) {
    lastProcessedLineByGuild.set(guild.id, lines[lines.length - 1]);
    return;
  }

  const lastIndex = lines.lastIndexOf(lastSeen);
  const newLines = lastIndex >= 0 ? lines.slice(lastIndex + 1) : lines.slice(-50);

  for (const line of newLines) {
    const kill = parseKillLine(line);
    if (!kill) continue;

    await channel.send({
      embeds: [buildKillEmbed(kill)]
    }).catch(() => null);
  }

  lastProcessedLineByGuild.set(guild.id, lines[lines.length - 1]);
}

export function startKillfeed(client) {
  if (pollState.started) return;
  pollState.started = true;

  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      try {
        await processGuildKillfeed(guild);
      } catch (error) {
        console.error(`Killfeed Fehler auf ${guild.name}:`, error);
      }
    }
  }, 20000);
}