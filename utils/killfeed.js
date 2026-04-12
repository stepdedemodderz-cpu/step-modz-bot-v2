import { getGuildConfig } from './config.js';

export function startKillfeed(client) {
  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      const config = getGuildConfig(guild.id);

      if (!config?.killfeedEnabled || !config.killfeedChannelId) continue;

      const channel = guild.channels.cache.get(config.killfeedChannelId);
      if (!channel) continue;

      // 🚧 HIER KOMMEN SPÄTER DIE ECHTEN NITRADO LOGS REIN

      // aktuell nur Hinweis (kein Spam mehr)
    }
  }, 30000);
}