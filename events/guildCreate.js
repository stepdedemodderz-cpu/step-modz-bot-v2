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

const STEP_CATEGORY_NAME = 'Step Mod!Z BOT';
const STEP_CHANNEL_NAME = 'step-modz-bot';

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

async function findExistingCategory(guild) {
  await guild.channels.fetch().catch(() => null);

  return guild.channels.cache.find(
    (c) => c.type === ChannelType.GuildCategory && c.name === STEP_CATEGORY_NAME
  ) || null;
}

async function findExistingTextChannel(guild, categoryId = null) {
  await guild.channels.fetch().catch(() => null);

  let channel = guild.channels.cache.find(
    (c) =>
      c.type === ChannelType.GuildText &&
      c.name === STEP_CHANNEL_NAME &&
      (!categoryId || c.parentId === categoryId)
  );

  if (!channel) {
    channel = guild.channels.cache.find(
      (c) => c.type === ChannelType.GuildText && c.name === STEP_CHANNEL_NAME
    );
  }

  return channel || null;
}

async function botPanelAlreadyExists(channel, botId) {
  const messages = await channel.messages.fetch({ limit: 15 }).catch(() => null);
  if (!messages) return false;

  return messages.some(
    (msg) =>
      msg.author.id === botId &&
      msg.embeds?.[0]?.title === 'Step Mod!Z BOT'
  );
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

      let category = await findExistingCategory(guild);

      if (!category) {
        category = await guild.channels.create({
          name: STEP_CATEGORY_NAME,
          type: ChannelType.GuildCategory,
          permissionOverwrites: overwrites
        });
      }

      let channel = await findExistingTextChannel(guild, category.id);

      if (!channel) {
        channel = await guild.channels.create({
          name: STEP_CHANNEL_NAME,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: overwrites
        });
      } else if (channel.parentId !== category.id) {
        await channel.setParent(category.id).catch(() => null);
      }

      const alreadyPosted = await botPanelAlreadyExists(channel, botId);
      if (alreadyPosted) return;

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