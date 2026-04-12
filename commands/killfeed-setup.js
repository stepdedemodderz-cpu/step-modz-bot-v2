import { SlashCommandBuilder, EmbedBuilder, MessageFlags } from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { getFirstDayZService } from '../utils/nitrado.js';
import { updateServerStatusMessage } from '../utils/serverStatus.js';

function findChannel(guild, names) {
  return guild.channels.cache.find((c) =>
    names.some((name) => c.name.toLowerCase().includes(name))
  );
}

export default {
  data: new SlashCommandBuilder()
    .setName('killfeed-setup')
    .setDescription('Aktiviert alle DayZ Systeme mit einem Nitrado Token')
    .addStringOption((option) =>
      option
        .setName('token')
        .setDescription('Nitrado Token')
        .setRequired(true)
    ),

  async execute(interaction) {
    const config = getGuildConfig(interaction.guild.id) || {};
    const token = interaction.options.getString('token', true);

    await interaction.deferReply({
      flags: MessageFlags.Ephemeral
    });

    const killfeedChannel = findChannel(interaction.guild, ['killfeed']);
    const activityChannel = findChannel(interaction.guild, ['server-activity']);
    const statusChannel = findChannel(interaction.guild, ['server-status']);

    if (!killfeedChannel) {
      const embed = new EmbedBuilder()
        .setTitle('❌ Killfeed Kanal fehlt')
        .setDescription(
          [
            'Der Kanal **💀 killfeed** wurde nicht gefunden.',
            '',
            'Nutze zuerst:',
            '`/update-server`',
            '',
            'Danach führe `/killfeed-setup token:DEIN_TOKEN` erneut aus.'
          ].join('\n')
        )
        .setColor(0xef4444)
        .setFooter({ text: 'Step Mod!Z BOT • DayZ Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
      return;
    }

    try {
      const service = await getFirstDayZService(token);

      if (!service?.id) {
        const embed = new EmbedBuilder()
          .setTitle('❌ Kein DayZ Server gefunden')
          .setDescription(
            [
              'Mit diesem Token konnte kein DayZ-Service gefunden werden.',
              '',
              'Prüfe bitte:',
              '• ob der Token gültig ist',
              '• ob beim Token **service** aktiviert ist',
              '• ob auf dem Account ein DayZ Server vorhanden ist'
            ].join('\n')
          )
          .setColor(0xef4444)
          .setFooter({ text: 'Step Mod!Z BOT • DayZ Setup' })
          .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
        return;
      }

      setGuildConfig(interaction.guild.id, {
        ...config,
        dayzConnectionMode: 'nitrado',
        nitradoToken: token,
        nitradoServiceId: String(service.id),
        killfeedEnabled: true,
        killfeedChannelId: killfeedChannel.id,
        serverActivityChannelId: activityChannel?.id || null,
        serverStatusChannelId: statusChannel?.id || null
      });

      if (statusChannel) {
        await updateServerStatusMessage(interaction.guild).catch(() => null);
      }

      const embed = new EmbedBuilder()
        .setTitle('✅ DayZ Tools aktiviert')
        .setDescription(
          [
            'Der Token wurde gespeichert und alle verfügbaren DayZ Tools wurden aktiviert.',
            '',
            `🎮 **Erkannter Service:** \`${service.id}\``,
            `💀 **Killfeed:** <#${killfeedChannel.id}>`,
            activityChannel
              ? `📡 **Server Activity:** <#${activityChannel.id}>`
              : '📡 **Server Activity:** Nicht gefunden',
            statusChannel
              ? `🧟 **Server Status:** <#${statusChannel.id}>`
              : '🧟 **Server Status:** Nicht gefunden',
            '',
            'Damit laufen jetzt über denselben Token:',
            '• Killfeed',
            '• Join / Leave',
            '• Server Status',
            '',
            'Es ist kein zweiter Setup-Befehl nötig.'
          ].join('\n')
        )
        .setColor(0x22c55e)
        .setFooter({ text: 'Step Mod!Z BOT • DayZ Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error('KILLFEED_SETUP_ERROR:', error);

      const embed = new EmbedBuilder()
        .setTitle('❌ Setup fehlgeschlagen')
        .setDescription(
          [
            'Die Verbindung zu Nitrado konnte nicht aufgebaut werden.',
            '',
            'Prüfe bitte:',
            '• ob der Token korrekt ist',
            '• ob der Token die Berechtigung **service** hat',
            '• ob Nitrado gerade erreichbar ist'
          ].join('\n')
        )
        .setColor(0xef4444)
        .setFooter({ text: 'Step Mod!Z BOT • DayZ Setup' })
        .setTimestamp();

      await interaction.editReply({ embeds: [embed] });
    }
  }
};