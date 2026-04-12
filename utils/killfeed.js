import { getGuildConfig } from './config.js';
import {
  getFirstDayZService,
  getLogFiles,
  getDownloadUrl
} from './nitrado.js';

const lastLinesCache = new Map();

function parseKill(line) {
  if (!line.includes('killed')) return null;

  // Beispiel einfache Erkennung
  const match = line.match(/Player \"(.+?)\".*killed.*\"(.+?)\"/);

  if (!match) return null;

  return {
    killer: match[1],
    victim: match[2]
  };
}

export function startKillfeed(client) {
  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      try {
        const config = getGuildConfig(guild.id);

        if (!config?.killfeedEnabled || !config.nitradoToken) continue;

        const channel = guild.channels.cache.get(config.killfeedChannelId);
        if (!channel) continue;

        const service = await getFirstDayZService(config.nitradoToken);
        if (!service) continue;

        const logs = await getLogFiles(config.nitradoToken, service.id);

        const logFile = logs.find(l => l.path.includes('.ADM'));
        if (!logFile) continue;

        const url = await getDownloadUrl(
          config.nitradoToken,
          service.id,
          logFile.path
        );

        const res = await fetch(url);
        const text = await res.text();

        const lines = text.split('\n');

        const last = lastLinesCache.get(guild.id) || 0;
        const newLines = lines.slice(last);

        lastLinesCache.set(guild.id, lines.length);

        for (const line of newLines) {
          const kill = parseKill(line);
          if (!kill) continue;

          await channel.send(
            `💀 **${kill.killer}** hat **${kill.victim}** getötet`
          );
        }

      } catch (err) {
        console.error('Killfeed Fehler:', err);
      }
    }
  }, 20000);
}