# Step Mod!Z BOT

Multi-Server DayZ Console Discord Bot mit:
- Verify Panel
- Tickets
- Whitelist Bewerbung
- Welcome System
- Whitelist annehmen/ablehnen

## Installation

```bash
npm install
```

## ENV

`.env.example` zu `.env` kopieren und ausfüllen:

```env
DISCORD_TOKEN=dein_discord_bot_token
CLIENT_ID=deine_application_id
```

## Commands registrieren

```bash
npm run deploy
```

## Starten

```bash
npm start
```

## Invite Link

```text
https://discord.com/oauth2/authorize?client_id=DEINE_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

## Server Setup

Als Admin auf einem Server:

```text
/setup
/settings
/verify-panel
/ticket-panel
/whitelist-panel
/setup-welcome
```

## Wichtig

- Im Discord Developer Portal `Server Members Intent` aktivieren.
- Die Bot-Rolle muss über den Rollen stehen, die er vergeben soll.
- Globale Commands können bei Discord etwas Zeit brauchen, bis sie überall sichtbar sind.
