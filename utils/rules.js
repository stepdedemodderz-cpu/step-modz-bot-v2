import {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} from 'discord.js';

export const RULES_DE = [
  '⚠️ **Behandelt alle mit Respekt.** Belästigung, Hetze, Sexismus, Rassismus und Aufstachelung werden absolut nicht toleriert.',
  '',
  '⚠️ **Spam und Eigenwerbung** (Servereinladungen, Werbung usw.) sind ohne Genehmigung eines Teammitglieds nicht gestattet. Dies gilt auch für Direktnachrichten an andere Mitglieder.',
  '',
  '⚠️ **Inhalte mit Altersbeschränkung oder Obszönitäten** sind verboten. Dazu gehören Texte, Bilder und Links mit Nacktheit, Sex, schwerer Gewalt oder anderen grafisch verstörenden Inhalten.',
  '',
  '⚠️ **Wenn ihr etwas seht, das gegen die Regeln verstößt** oder euch ein unsicheres Gefühl gibt, meldet es bitte dem Team. Wir möchten, dass sich jeder auf diesem Server willkommen fühlt.',
  '',
  '⚠️ **Wer gegen die Regeln verstößt, wird SOFORT** von unserem Discord-Server ausgeschlossen.',
  '',
  '⚠️ **Wir sind stets bemüht**, der Community ein umfassendes Spielerlebnis zu bieten.',
  '',
  '✅ **Bitte bestätigt die Regeln mit einem Klick.**'
].join('\n');

export const RULES_EN = [
  '⚠️ **Treat everyone with respect.** Harassment, hate speech, sexism, racism and incitement are absolutely not tolerated.',
  '',
  '⚠️ **Spam and self-promotion** (server invites, advertising, etc.) are not allowed without permission from a team member. This also applies to direct messages to other members.',
  '',
  '⚠️ **Age-restricted or obscene content** is forbidden. This includes text, images and links containing nudity, sex, extreme violence or other disturbing graphic content.',
  '',
  '⚠️ **If you see something that breaks the rules** or makes you feel unsafe, please report it to the team. We want everyone to feel welcome on this server.',
  '',
  '⚠️ **Anyone who breaks the rules will be IMMEDIATELY removed** from our Discord server.',
  '',
  '⚠️ **We always aim** to provide the community with the best possible experience.',
  '',
  '✅ **Please confirm the rules with one click.**'
].join('\n');

export function buildRulesIntroEmbed() {
  return new EmbedBuilder()
    .setTitle('📜 Regeln & Verifizierung')
    .setDescription(
      [
        'Willkommen auf dem Server.',
        '',
        '**Bevor du Zugriff auf alle Bereiche bekommst:**',
        '1. Wähle deine Sprache',
        '2. Lies die Regeln',
        '3. Bestätige die Regeln',
        '4. Klicke danach auf **Verifizieren**',
        '',
        'Erst danach werden alle freigeschalteten Kanäle sichtbar.'
      ].join('\n')
    )
    .setColor(0xf59e0b)
    .setFooter({ text: 'Step Mod!Z BOT • Regeln System' })
    .setTimestamp();
}

export function buildRulesEmbed(language = 'de') {
  const isEn = language === 'en';

  return new EmbedBuilder()
    .setTitle(isEn ? '📜 Server Rules' : '📜 Server Regeln')
    .setDescription(isEn ? RULES_EN : RULES_DE)
    .setColor(0xf59e0b)
    .setFooter({ text: 'Step Mod!Z BOT • Regeln System' })
    .setTimestamp();
}

export function buildRulesButtons() {
  return [
    new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId('stepmodz_rules_de')
        .setLabel('🇩🇪 Deutsch')
        .setStyle(ButtonStyle.Secondary),
      new ButtonBuilder()
        .setCustomId('stepmodz_rules_en')
        .setLabel('🇬🇧 English')
        .setStyle(ButtonStyle.Secondary)
    )
  ];
}