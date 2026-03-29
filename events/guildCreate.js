import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
} from 'discord.js';
import { getGuildConfig, setGuildConfig } from '../utils/config.js';
import { t } from '../utils/i18n.js';
import { getHelpMenuOptions } from '../utils/helpMenu.js';

function botBaseOverwrites(ownerId, botId, everyoneId) {
  return [
    {
      id: everyoneId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.ReadMessageHistory
      ],
      deny: [PermissionsBitField.Flags.SendMessages]
    },
    {
      id: ownerId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory
      ]
    },
    {
      id: botId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
        PermissionsBitField.Flags.ReadMessageHistory,
        PermissionsBitField.Flags.ManageChannels,
        PermissionsBitField.Flags.ManageMessages
      ]
    }
  ];
}

export default {
  name: 'guildCreate',
  async execute(guild) {
    try {
      const config = getGuildConfig(guild.id) || {};
      const language = config.language || 'de';

      if (!config.language) {
        setGuildConfig(guild.id, { ...config, language: 'de' });
      }

      const owner = await guild.fetchOwner();
      const ownerId = owner.id;
      const botId = guild.members.me?.id || guild.client.user.id;
      const everyoneId = guild.roles.everyone.id;
      const overwrites = botBaseOverwrites(ownerId, botId, everyoneId);

      let category = guild.channels.cache.find(
        (c) => c.type === ChannelType.GuildCategory && c.name === 'Step Mod!Z BOT'
      );

      if (!category) {
        category = await guild.channels.create({
          name: 'Step Mod!Z BOT',
          type: ChannelType.GuildCategory,
          permissionOverwrites: overwrites
        });
      } else {
        await category.edit({
          permissionOverwrites: overwrites
        }).catch(() => null);
      }

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
          permissionOverwrites: overwrites
        });
      } else {
        await channel.edit({
          parent: category.id,
          permissionOverwrites: overwrites
        }).catch(() => null);
      }

      const embed = new EmbedBuilder()
        .setTitle('Step Mod!Z BOT')
        .setDescription(
          [
            'Ich bin **Step Mod!Z BOT**.',
            '',
            'Klicke auf **Info** und bekomme eine Übersicht & Befehle der Einrichtung.',
            '',
            'Wähle eine Kategorie aus dem Dropdown-Menü,',
            'um meine Befehlsliste anzuzeigen.',
            'Klicke auf den entsprechenden Tab, je nachdem, wobei du Hilfe benötigst.',
            'Lasse über das DropDown Menü, **Step BOT** alles Einrichten.',
            'Wähle dazu **Step BOT Schnell Einrichtung** aus.'
          ].join('\n')
        )
        .setColor(0x5865f2)
        .setImage('https://cdn.discordapp.com/attachments/1485785120270061751/1486064187053441096/25882009-b8b1-4350-bdaa-9652c0bfead3.png')
        .setFooter({ text: t(language, 'checkedBy') })
        .setTimestamp();

      const buttonRow = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId('stepmodz_open_info')
          .setLabel(t(language, 'buttonInfo'))
          .setStyle(ButtonStyle.Primary),
        new ButtonBuilder()
          .setCustomId('stepmodz_lang_de')
          .setLabel('Deutsch')
          .setStyle(ButtonStyle.Secondary),
        new ButtonBuilder()
          .setCustomId('stepmodz_lang_en')
          .setLabel('English')
          .setStyle(ButtonStyle.Secondary)
      );

      const menuRow = new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId('stepmodz_help_menu')
          .setPlaceholder(language === 'en' ? 'Dropdown Menu' : 'Dropdown Menü')
          .addOptions(getHelpMenuOptions(language))
      );

      await channel.send({
        embeds: [embed],
        components: [buttonRow, menuRow]
      });
    } catch (err) {
      console.error('guildCreate Fehler:', err);
    }
  }
};