import {
  ChannelType,
  PermissionsBitField,
  EmbedBuilder
} from 'discord.js';

const CATEGORY_NAME = 'Step Mod!Z BOT';
const CHANNEL_NAME = 'step-modz-bot';

function overwrites(ownerId, botId, everyoneId) {
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
        PermissionsBitField.Flags.SendMessages
      ]
    },
    {
      id: botId,
      allow: [
        PermissionsBitField.Flags.ViewChannel,
        PermissionsBitField.Flags.SendMessages,
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
      console.log(`Bot wurde zu Server hinzugefügt: ${guild.name}`);

      // 🔥 WICHTIG: alles frisch laden (verhindert doppelte Erstellung)
      await guild.channels.fetch().catch(() => null);

      const owner = await guild.fetchOwner();
      const ownerId = owner.id;
      const botId = guild.members.me?.id || guild.client.user.id;
      const everyoneId = guild.roles.everyone.id;

      const perms = overwrites(ownerId, botId, everyoneId);

      // 🔹 Kategorie IMMER global suchen (nicht nur cache!)
      let category = guild.channels.cache.find(
        (c) =>
          c.type === ChannelType.GuildCategory &&
          c.name === CATEGORY_NAME
      );

      if (!category) {
        category = await guild.channels.create({
          name: CATEGORY_NAME,
          type: ChannelType.GuildCategory,
          permissionOverwrites: perms
        });
      }

      // 🔹 Channel GLOBAL suchen (kein parent check!)
      let channel = guild.channels.cache.find(
        (c) =>
          c.type === ChannelType.GuildText &&
          c.name === CHANNEL_NAME
      );

      if (!channel) {
        channel = await guild.channels.create({
          name: CHANNEL_NAME,
          type: ChannelType.GuildText,
          parent: category.id,
          permissionOverwrites: perms
        });
      } else {
        // falls falsche Kategorie → verschieben
        if (channel.parentId !== category.id) {
          await channel.setParent(category.id).catch(() => null);
        }
      }

      // 🔹 Nur 1 Nachricht (keine Duplikate)
      const messages = await channel.messages.fetch({ limit: 10 }).catch(() => null);

      const alreadyExists = messages?.some(
        (m) =>
          m.author.id === botId &&
          m.embeds.length > 0 &&
          m.embeds[0]?.title === 'Step Mod!Z BOT'
      );

      if (!alreadyExists) {
        const embed = new EmbedBuilder()
          .setTitle('Step Mod!Z BOT')
          .setDescription('Setup erfolgreich.')
          .setColor(0x5865f2);

        await channel.send({ embeds: [embed] });
      }

    } catch (err) {
      console.error('guildCreate Fehler:', err);
    }
  }
};