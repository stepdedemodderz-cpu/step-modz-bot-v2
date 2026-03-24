import fs from 'node:fs';
import path from 'node:path';

const dataDir = path.resolve('./data');
const dataPath = path.resolve('./data/guilds.json');

export function ensureGuildFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, JSON.stringify({}, null, 2), 'utf8');
  }
}

export function loadGuildConfigs() {
  ensureGuildFile();

  try {
    const raw = fs.readFileSync(dataPath, 'utf8');
    return JSON.parse(raw || '{}');
  } catch (error) {
    console.error('Fehler beim Laden von guilds.json:', error);
    return {};
  }
}

export function saveGuildConfigs(data) {
  ensureGuildFile();
  fs.writeFileSync(dataPath, JSON.stringify(data, null, 2), 'utf8');
}

export function getGuildConfig(guildId) {
  const configs = loadGuildConfigs();
  return configs[guildId] || {};
}

export function setGuildConfig(guildId, config) {
  const configs = loadGuildConfigs();
  configs[guildId] = {
    ...(configs[guildId] || {}),
    ...config
  };
  saveGuildConfigs(configs);
  return configs[guildId];
}