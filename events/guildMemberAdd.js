import { Events } from 'discord.js';
import { sendWelcomeMessage } from '../utils/welcome.js';

export default {
  name: Events.GuildMemberAdd,
  once: false,

  async execute(member) {
    await sendWelcomeMessage(member);
  }
};
