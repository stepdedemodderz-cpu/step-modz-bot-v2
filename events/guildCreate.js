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
const LOGO_URL =
    'https://cdn.discordapp.com/attachments/1493286442972090518/1493286862695956702/25882009-b8b1-4350-bdaa-9652c0bfead3.png';

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

async function removeAllBotMessages(channel, botUserId) {
  const messages = await channel.messages.fetch({ limit: 100 }).catch(() => null);
  if (!messages) return;

  const botMessages = messages.filter((m) => m.author.id === botUserId);

  for (const [, msg] of botMessages) {
    await msg.delete().catch(() => null);
  }
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

      let category =
        (config.botIntroCategoryId && guild.channels.cache.get(config.botIntroCategoryId)) ||
        guild.channels.cache.find(
          (c) => c.type === ChannelType.GuildCategory && c.name === BOT_CATEGORY_NAME
        ) ||
        null;

      if (!category) {
        category = await guild.channels.create({
          name: BOT_CATEGORY_NAME,
          type: ChannelType.GuildCategory,
          permissionOverwrites: overwrites
        });
      } else {
        await category.permissionOverwrites.set(overwrites).catch(() => null);
      }

      const duplicateCategories = guild.channels.cache.filter(
        (c) =>
          c.type === ChannelType.GuildCategory &&
          c.name === BOT_CATEGORY_NAME &&
          c.id !== category.id
      );

      for (const [, duplicate] of duplicateCategories) {
        const children = guild.channels.cache.filter((c) => c.parentId === duplicate.id);
        for (const [, child] of children) {
          await child.setParent(category.id).catch(() => null);
        }
        await duplicate.delete().catch(() => null);
      }

      let channel =
        (config.botIntroChannelId && guild.channels.cache.get(config.botIntroChannelId)) ||
        guild.channels.cache.find(
          (c) => c.type === ChannelType.GuildText && c.name === BOT_CHANNEL_NAME
        ) ||
        null;

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

      const duplicateChannels = guild.channels.cache.filter(
        (c) =>
          c.type === ChannelType.GuildText &&
          c.name === BOT_CHANNEL_NAME &&
          c.id !== channel.id
      );

      for (const [, duplicate] of duplicateChannels) {
        await duplicate.delete().catch(() => null);
      }

      setGuildConfig(guild.id, {
        ...getGuildConfig(guild.id),
        language,
        botIntroCategoryId: category.id,
        botIntroChannelId: channel.id
      });

      const embed = new EmbedBuilder()
        .setTitle('🤖 Step Mod!Z BOT')
        .setDescription(
          [
            'Willkommen 👋',
            '',
            'Ich bin **Step Mod!Z BOT** und helfe dir bei der Einrichtung deiner wichtigsten Discord-Systeme.',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '📘 **Was du hier machen kannst**',
            '',
            '• Klicke auf **Info**, um eine Übersicht zu bekommen',
            '• Nutze das **Dropdown-Menü**, um Hilfe zu einzelnen Bereichen zu sehen',
            '• Starte über **Step BOT Schnell Einrichtung** die automatische Einrichtung',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '⚡ **Schnell Einrichtung**',
            '',
            'Mit **Step BOT Schnell Einrichtung** erstellt der Bot automatisch die wichtigsten Hauptsysteme für deinen Server.',
            '',
            '⏳ Die Einrichtung kann bis zu **1 Minute** dauern.',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '✅ **Enthaltene Systeme**',
            '',
            '• Verification',
            '• Welcome',
            '• Ticket',
            '• Whitelist',
            '• Validator',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '🛠️ **Tipp**',
            '',
            'Wähle unten einfach den Bereich aus, bei dem du Hilfe brauchst.'
          ].join('\n')
        )
        .setColor(0x5865f2)
        .setThumbnail(LOGO_URL)
        .setImage(LOGO_URL)
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

      // Alles Alte weg, damit garantiert nur 1 Intro bleibt
      await removeAllBotMessages(channel, botId);

      await channel.send({
        embeds: [embed],
        components: [buttonRow, menuRow]
      });
    } catch (err) {
      console.error('guildCreate Fehler:', err);
    }
  }
};