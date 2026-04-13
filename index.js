import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { Client, Collection, GatewayIntentBits, Partials } from 'discord.js';
import { ensureGuildFile } from './utils/config.js';

dotenv.config();

if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  console.error('Fehlende ENV Variablen: DISCORD_TOKEN oder CLIENT_ID');
  process.exit(1);
}

ensureGuildFile();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages
  ],
  partials: [Partials.Channel, Partials.Message, Partials.GuildMember]
});

client.commands = new Collection();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const commandModule = await import(`file://${filePath}`);
  const command = commandModule.default;

  if (!command?.data || !command?.execute) {
    console.warn(`Ungültiger Command übersprungen: ${file}`);
    continue;
  }

  client.commands.set(command.data.name, command);
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

for (const file of eventFiles) {
  const filePath = path.join(__dirname, file);
  const eventModule = await import(`file://${path.join(eventsPath, file)}`);
  const event = eventModule.default;

  if (!event?.name || !event?.execute) {
    console.warn(`Ungültiges Event übersprungen: ${file}`);
    continue;
  }

  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args, client));
  } else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

client.login(process.env.DISCORD_TOKEN);