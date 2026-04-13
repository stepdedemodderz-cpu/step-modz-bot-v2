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

async function removeOldBotIntroMessages(channel, botUserId) {
  const messages = await channel.messages.fetch({ limit: 50 }).catch(() => null);
  if (!messages) return null;

  const introMessages = messages.filter((m) => {
    if (m.author.id !== botUserId) return false;

    const embed = m.embeds?.[0];
    const title = embed?.title || '';
    const description = embed?.description || '';

    return (
      title === 'Step Mod!Z BOT' ||
      description.includes('Ich bin **Step Mod!Z BOT**') ||
      description.includes('Ich bin **Step Mod!Z BOT** 👋') ||
      description.includes('Klicke auf **Info**') ||
      description.includes('Step BOT Schnell Einrichtung')
    );
  });

  let newestMessage = null;
  const sorted = [...introMessages.values()].sort(
    (a, b) => b.createdTimestamp - a.createdTimestamp
  );

  if (sorted.length > 0) {
    newestMessage = sorted[0];
  }

  for (let i = 1; i < sorted.length; i++) {
    await sorted[i].delete().catch(() => null);
  }

  return newestMessage;
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
        .setTitle('Step Mod!Z BOT')
        .setDescription(
          [
            'Ich bin **Step Mod!Z BOT** 👋',
            '',
            'Klicke auf **Info** und bekomme eine Übersicht & Befehle der Einrichtung.',
            '',
            'Wähle eine Kategorie aus dem Dropdown-Menü,',
            'um meine Befehlsliste anzuzeigen.',
            'Klicke auf den entsprechenden Tab, je nachdem, wobei du Hilfe benötigst.',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '⚡ **Schnell Einrichtung**',
            '',
            'Lasse über das Dropdown Menü den Bot alles automatisch einrichten.',
            'Wähle dazu **Step BOT Schnell Einrichtung** aus.',
            '',
            '⏳ Die Einrichtung kann bis zu **1 Minute** dauern.',
            '',
            '━━━━━━━━━━━━━━━━━━━━━━',
            '🔑 **DayZ Server verbinden**',
            '',
            'Nutze danach nur diesen Command:',
            '`/killfeed-setup token:DEIN_TOKEN`',
            '',
            '👉 Damit wird automatisch aktiviert:',
            '• 💀 Killfeed',
            '• 📡 Server Activity',
            '• 🧟 Server Status',
            '',
            '❗ Es ist kein weiterer Setup-Befehl nötig'
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

      const introMessage = await removeOldBotIntroMessages(channel, botId);

      if (introMessage) {
        await introMessage.edit({
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