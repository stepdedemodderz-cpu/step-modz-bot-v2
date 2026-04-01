import { SlashCommandBuilder } from 'discord.js';
import { runAutoSetup } from '../utils/autosetup.js';

export default {
  data: new SlashCommandBuilder()
    .setName('update-server')
    .setDescription('Installiert nur neue fehlende Tools und Bereiche nach.'),

  async execute(interaction) {
    if (interaction.user.id !== interaction.guild.ownerId) {
      await interaction.reply({
        content: '❌ Nur der Server-Besitzer darf das.',
        ephemeral: true
      });
      return;
    }

    await interaction.deferReply({ ephemeral: true });

    const result = await runAutoSetup(interaction.guild, { mode: 'update' });

if (!result.createdAnything) {
  await interaction.reply({
    content: '✅ Du hast das neuste Update.',
    ephemeral: true
  });
  return;
}

await interaction.reply({
  content: `🆕 Neue Tools installiert:\n${result.createdList.map(x => `• ${x}`).join('\n')}`,
  ephemeral: true
});

    if (!result.createdAnything) {
      await interaction.editReply({
        content: '✅ Du hast das neueste Update.'
      });
      return;
    }

    await interaction.editReply({
      content:
        '✅ Neue Tools wurden installiert:\n\n' +
        result.createdList.map((x) => `• ${x}`).join('\n')
    });
  }
};