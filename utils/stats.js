import fs from 'fs';

const FILE = './data/stats.json';

function load() {
  if (!fs.existsSync(FILE)) return {};
  return JSON.parse(fs.readFileSync(FILE, 'utf8'));
}

function save(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

export function addKill(guildId, killer, victim) {
  const data = load();

  if (!data[guildId]) data[guildId] = {};

  if (!data[guildId][killer]) {
    data[guildId][killer] = { kills: 0, deaths: 0 };
  }

  if (!data[guildId][victim]) {
    data[guildId][victim] = { kills: 0, deaths: 0 };
  }

  data[guildId][killer].kills++;
  data[guildId][victim].deaths++;

  save(data);
}

export function getTop(guildId) {
  const data = load();
  const players = data[guildId] || {};

  return Object.entries(players)
    .sort((a, b) => b[1].kills - a[1].kills)
    .slice(0, 10);
}