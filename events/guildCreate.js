import { ChannelType, PermissionsBitField, EmbedBuilder } from 'discord.js';

export default {
  name: 'guildCreate',
  async execute(guild) {
    try {
      // Check ob Channel schon existiert
      let channel = guild.channels.cache.find(
        (c) => c.name === 'step-modz-bot'
      );

      if (!channel) {
        channel = await guild.channels.create({
          name: 'step-modz-bot',
          type: ChannelType.GuildText,
          permissionOverwrites: [
            {
              id: guild.roles.everyone,
              allow: [PermissionsBitField.Flags.ViewChannel],
            },
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle('👋 Willkommen!')
        .setDescription(
`Hallo User 👋

Mein Name ist **Step Mod!Z BOT** 🤖  
Ich wurde erstellt von **StepDede_ModderZ**  

Ich werde dir jetzt helfen 🚀

📌 **Starte hier:**
Gib in diesem Channel ein:
👉 \`/info\`

Du bekommst:
✔ Übersicht aller Features  
✔ Setup Anleitung  
✔ Erklärung aller Commands  

🔥 Viel Spaß mit deinem Server!`
        )
        .setColor(0x5865f2)
        .setFooter({ text: 'Step Mod!Z BOT' });

      await channel.send({ embeds: [embed] });

    } catch (err) {
      console.error('guildCreate Fehler:', err);
    }
  }
};