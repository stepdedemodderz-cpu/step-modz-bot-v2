import { getGuildConfig } from '../utils/config.js';

export default {
  name: 'guildMemberAdd',
  async execute(member) {
    try {
      if (member.user.bot) return;
      if (member.id === member.guild.ownerId) return;

      const config = getGuildConfig(member.guild.id) || {};
      if (!config.unverifiedRoleId) return;

      const unverifyRole = member.guild.roles.cache.get(config.unverifiedRoleId);
      if (!unverifyRole) return;

      if (!member.roles.cache.has(unverifyRole.id)) {
        await member.roles.add(unverifyRole);
      }
    } catch (error) {
      console.error('guildMemberAdd Fehler:', error);
    }
  }
};