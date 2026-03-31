import { getGuildConfig } from './config.js';

const lastKills = new Map();

function randomKill() {
  const players = ['Max', 'Alex', 'SniperX', 'Ghost', 'Hunter', 'Player123'];
  const weapons = ['AK-74', 'M4', 'Sniper', 'Shotgun', 'Pistol'];

  const killer = players[Math.floor(Math.random() * players.length)];
  let victim = players[Math.floor(Math.random() * players.length)];

  while (victim === killer) {
    victim = players[Math.floor(Math.random() * players.length)];
  }

  const weapon = weapons[Math.floor(Math.random() * weapons.length)];
  const distance = Math.floor(Math.random() * 500) + 10;

  return {
    killer,
    victim,
    weapon,
    distance
  };
}

export function startKillfeed(client) {
  setInterval(async () => {
    for (const guild of client.guilds.cache.values()) {
      const config = getGuildConfig(guild.id);

      if (!config?.killfeedEnabled || !config.killfeedChannelId) continue;

      const channel = guild.channels.cache.get(config.killfeedChannelId);
      if (!channel) continue;

      const kill = randomKill();

      const key = `${kill.killer}-${kill.victim}-${kill.weapon}`;
      if (lastKills.get(guild.id) === key) continue;

      lastKills.set(guild.id, key);

      await channel.send({
        embeds: [
          {
            title: '💀 Killfeed',
            description:
              `🔫 **${kill.killer}** hat **${kill.victim}** getötet\n` +
              `🧰 Waffe: **${kill.weapon}**\n` +
              `📏 Distanz: **${kill.distance}m**`,
            color: 0xef4444,
            timestamp: new Date()
          }
        ]
      }).catch(() => null);
    }
  }, 15000); // alle 15 Sekunden
}