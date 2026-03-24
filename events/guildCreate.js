import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { t } from '../utils/i18n.js';

export default {
  name: 'guildCreate',
  async execute(guild) {
    try {
      const config = getGuildConfig(guild.id);
      const language = config.language || 'de';

      if (!config.language) {
        setGuildConfig(guild.id, { language: 'de' });
      }

      // 1. Kategorie suchen oder erstellen
      let category = guild.channels.cache.find(
        (c) =>
          c.type === ChannelType.GuildCategory &&
          c.name === 'Step Mod!Z BOT'
      );

      if (!category) {
        category = await guild.channels.create({
          name: 'Step Mod!Z BOT',
          type: ChannelType.GuildCategory,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              allow: [PermissionsBitField.Flags.ViewChannel]
            }
          ]
        });
      }

      // 2. Textchannel in der Kategorie suchen oder erstellen
      let channel = guild.channels.cache.find(
        (c) =>
          c.type === ChannelType.GuildText &&
          c.name === 'step-modz-bot' &&
          c.parentId === category.id
      );

      if (!channel) {
        channel = await guild.channels.create({
          name: 'step-modz-bot',
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: [
            {
              id: guild.roles.everyone.id,
              allow: [
                PermissionsBitField.Flags.ViewChannel,
                PermissionsBitField.Flags.SendMessages,
                PermissionsBitField.Flags.ReadMessageHistory
              ]
            }
          ]
        });
      }

      const embed = new EmbedBuilder()
        .setTitle(t(language, 'welcomeChannelTitle'))
        .setDescription(t(language, 'welcomeChannelDescription'))
        .setColor(0x5865f2)
        .setImage('https://media.discordapp.net/attachments/1468693516942180372/1485943376179237026/25882009-b8b1-4350-bdaa-9652c0bfead3.png?ex=69c3b41c&is=69c2629c&hm=06fb2176062774d470971c3fdd5c9d03b262e02e860c1b491e669c424dc96547&=&format=webp&quality=lossless')
        .setFooter({ text: t(language, 'checkedBy') })
        .setTimestamp();

      const row1 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('stepmodz_open_info')
          .setLabel(t(language, 'buttonInfo'))
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('stepmodz_setup_help')
          .setLabel(t(language, 'buttonSetup'))
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId('stepmodz_validator_help')
          .setLabel(t(language, 'buttonValidator'))
          .setStyle(ButtonStyle.Secondary)
      );

      const row2 = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('stepmodz_lang_de')
          .setLabel('Deutsch')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('stepmodz_lang_en')
          .setLabel('English')
          .setStyle(ButtonStyle.Secondary)
      );

      await channel.send({
        embeds: [embed],
        components: [row1, row2]
      });
    } catch (err) {
      console.error('guildCreate Fehler:', err);
    }
  }
};