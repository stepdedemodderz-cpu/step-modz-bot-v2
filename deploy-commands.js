import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import dotenv from 'dotenv';
import { REST, Routes } from 'discord.js';

dotenv.config();

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
  console.error('Fehlende ENV Variablen: DISCORD_TOKEN oder CLIENT_ID');
  process.exit(1);
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commands = [];
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  try {
    const filePath = path.join(commandsPath, file);
    const commandModule = await import(`file://${filePath}`);
    const command = commandModule.default;

    if (command?.data) {
      commands.push(command.data.toJSON());
      console.log(`✅ Loaded: ${file}`);
    } else {
      console.log(`⚠️ Skipped: ${file}`);
    }
  } catch (error) {
    console.log(`❌ ERROR in ${file}`);
    console.error(error);
  }
}

const rest = new REST({ version: '10' }).setToken(token);

try {
  console.log('🚀 Registering global slash commands...');
  await rest.put(Routes.applicationCommands(clientId), {
    body: commands
  });
  console.log('✅ Global slash commands registered successfully.');
} catch (error) {
  console.error('❌ Deploy error:');
  console.error(error);
}