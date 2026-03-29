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

const BOT_CATEGORY_NAME = 'Step Mod!Z BOT';
const BOT_CHANNEL_NAME = 'step-modz-bot';

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

async function findExistingIntroMessage(channel, botUserId) {
  const messages = await channel.messages.fetch({ limit: 50 }).catch(() => null);
  if (!messages) return null;

  return (
    messages.find(
      (m) =>
        m.author.id === botUserId &&
        m.embeds.length > 0 &&
        m.embeds[0]?.title === 'Step Mod!Z BOT'
    ) || null
  );
}

export default {
  name: 'guildCreate',
  async execute(guild) {
    try {
      console.log(`Bot wurde zu Server hinzugefügt: ${guild.name}`);

      await guild.channels.fetch().catch(() => null);

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

      let category = null;

      if (config.botIntroCategoryId) {
        category = guild.channels.cache.get(config.botIntroCategoryId) || null;
      }

      if (!category) {
        const categories = guild.channels.cache.filter(
          (c) => c.type === ChannelType.GuildCategory && c.name === BOT_CATEGORY_NAME
        );

        category = categories.first() || null;

        const duplicates = categories.filter((c) => c.id !== category?.id);
        for (const [, duplicate] of duplicates) {
          const children = guild.channels.cache.filter((c) => c.parentId === duplicate.id);

          for (const [, child] of children) {
            if (category) {
              await child.setParent(category.id).catch(() => null);
            }
          }

          await duplicate.delete().catch(() => null);
        }
      }

      if (!category) {
        category = await guild.channels.create({
          name: BOT_CATEGORY_NAME,
          type: ChannelType.GuildCategory,
          permissionOverwrites: overwrites
        });
      } else {
        await category.permissionOverwrites.set(overwrites).catch(() => null);
      }

      let channel = null;

      if (config.botIntroChannelId) {
        channel = guild.channels.cache.get(config.botIntroChannelId) || null;
      }

      if (!channel) {
        const channels = guild.channels.cache.filter(
          (c) =>
            c.type === ChannelType.GuildText &&
            c.name === BOT_CHANNEL_NAME
        );

        channel = channels.first() || null;

        const duplicates = channels.filter((c) => c.id !== channel?.id);
        for (const [, duplicate] of duplicates) {
          await duplicate.delete().catch(() => null);
        }
      }

      if (!channel) {
        channel = await guild.channels.create({
          name: BOT_CHANNEL_NAME,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: overwrites
        });
      } else {
        if (channel.parentId !== category.id) {
          await channel.setParent(category.id).catch(() => null);
        }

        await channel.permissionOverwrites.set(overwrites).catch(() => null);
      }

      setGuildConfig(guild.id, {
        ...getGuildConfig(guild.id),
        language,
        botIntroCategoryId: category.id,
        botIntroChannelId: channel.id
      });

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

      const existingIntro = await findExistingIntroMessage(channel, botId);

      if (existingIntro) {
        await existingIntro.edit({
          embeds: [embed],
          components: [buttonRow, menuRow]
        }).catch(() => null);
      } else {
        await channel.send({
          embeds: [embed],
          components: [buttonRow, menuRow]
        });
      }
    } catch (err) {
      console.error('guildCreate Fehler:', err);
    }
  }
};