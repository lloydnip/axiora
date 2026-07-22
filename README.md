# <img src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f6e1.svg" width="30"> Axiora

> **A modern, modular, and powerful Discord moderation & security bot built with Discord.js v14.**

Axiora is designed to provide everything a Discord community needs—from moderation and security to automation and server management. The project is built with scalability in mind, allowing new systems to be added without changing the core architecture.

<p align="center">
    <img src="https://cdn.discordapp.com/attachments/1524325027611279395/1526610416531148890/Design_2.png?ex=6a57a63e&is=6a5654be&hm=f5246786225f2518f101a446222c68fb624d539304da2836557bfea1178ca99a&animated=true" alt="Axiora Banner">
</p>

---

## 📂 Project Structure

```
Axiora
│
├── commands/
│   ├── configurations/
│   ├── moderation/
│   ├── verification/
│   ├── stats/
│   ├── ticket/
│   └── security/
│
├── events/
│   └── security/
│
├── handlers/
│   ├── buttons/
│   ├── dropdowns/
│   └── wcemb/
│
├── utils/
│
├── data/
│
├── index.js
│
└── package.json
```

---

## ⚙️ Built With

- Node.js
- Discord.js v14
- JSON Database (*soon to be MongoDB or SQL*)
- Slash Commands
- Event Handler
- Button Handler
- Modular Architecture

---

## 📁 Configuration

Axiora stores its configuration inside the **/data** directory.

Example

```
data/
├── config.json
├── security.json
└── warnings.json
```

Files are automatically generated if they do not already exist.

---

# Axiora | Patch Notes v0.0.5
*Released: July 18–22, 2026*

## ✨ New Commands

### 📊 Statistics Commands
- **`/servers`** — View all servers where Axiora is installed.
- **`/serverinfo`** — View detailed information about a server.
- **`/avatar`** — View a user's avatar.
- **`/userinfo`** — View detailed information about a user.
- **`/channelinfo`** — View detailed information about a channel.
- **`/roleinfo`** — View detailed information about a role.

### ⚙️ Welcome System
- **`/setautorole`** — Configure the role automatically assigned to new members when they join the server.

## ✨ New Features

### ⚔️ Anti-Spam System
A fully configurable Anti-Spam system has been added to help protect your server from spam.
- **`/anti-spam enable`** — Enable the Anti-Spam system.
- **`/anti-spam disable`** — Disable the Anti-Spam system.
- **`/anti-spam punishment`** — Configure the punishment for spam violations.
- **`/anti-spam messages`** — Set the maximum number of messages allowed.
- **`/anti-spam interval`** — Set the time interval used to detect spam.
- **`/anti-spam delete`** — Configure whether spam messages should be deleted.
- **`/anti-spam ignore channel`** — Ignore a specific channel.
- **`/anti-spam ignore user`** — Ignore a specific user.
- **`/anti-spam ignore list`** — View all ignored channels and users.
- **`/anti-spam logs set`** — Set the channel where Anti-Spam logs are sent.

### 🎫 Ticket System
The Ticket System is now fully configurable with the following commands:
- **`/ticket setup supportrole`** — Set the support role for tickets.
- **`/ticket setup category`** — Set the category where ticket channels are created.
- **`/ticket setup transcript`** — Set the channel where ticket transcripts are stored.
- **`/ticket setup panel`** — Configure and send the ticket panel.
- **`/ticket setup config`** — View the current ticket system configuration.

## 🔧 Improvements
- Renamed the Anti-Nuke command from **`/antinuke`** to **`/anti-nuke`**.
- Fixed issues with the Lockdown System not properly locking channels.
- Improved and fixed Button Handlers.
- Fixed major bugs and errors across the bot.
- Fixed bugs and errors in the Verification System.
- Fixed issues with Button, Modal, and Dropdown interactions.
- Improved overall system stability and performance.

> Thank you for your patience and continued support. Stay tuned for more updates! 🚀
---

## 📄 License

This project is licensed under the **MIT License**.

---

## ❤️ Developed by

**Noviqo Developers**

Building the next generation of Discord moderation and security tools.

---

> **Axiora is under active development.** More features, optimizations, and security improvements are coming in future releases.
