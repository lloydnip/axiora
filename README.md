# <img src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f6e1.svg" width="30"> Axiora - Multi-Purpose Discord Bot

> **A modern, modular, and powerful Discord moderation & security bot built with Discord.js v14.**

Axiora is designed to provide everything a Discord community needs—from moderation and security to automation and server management. The project is built with scalability in mind, allowing new systems to be added without changing the core architecture.

--- 
<p align="center">
    <img src="https://cdn.discordapp.com/attachments/1524325027611279395/1526610416531148890/Design_2.png?ex=6a57a63e&is=6a5654be&hm=f5246786225f2518f101a446222c68fb624d539304da2836557bfea1178ca99a&animated=true" alt="Axiora Banner">
</p>
---

## ✨ Features

### 🛡️ Moderation
### 🔒 Security
### 👋 Welcome & Goodbye

### 🤖 Auto Moderation

---

## 📂 Project Structure

```
Axiora
│
├── commands/
│   ├── configurations/
│   ├── moderation/
│   └── security/
│
├── events/
│
├── handlers/
│   ├── buttons/
│   ├── modals/
│   ├── selects/
│   └── autocomplete/
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

# 📜 Patch Notes

## v0.0.2
*Released: July 14, 2026*

### ✨ Added

#### Welcome & Goodbye System

- `/setwelcome`
- `/setgoodbye`
- `/testwelcome`
- `/testgoodbye`

#### Server Lockdown System

- `/lockdown`
- `/unlockdown`
- `/setlockdownrole`
- `/setlockdownignore`
- `/removelockdownignore`
- `/lockdownignored`
- `/security`

### 🔧 Improvements

- Moderation commands are now restricted to authorized staff members.
- Added a dynamic bot status and presence system.
- Improved the internal command and event architecture.
- Added automatic configuration storage.
- Introduced button handlers for scalable interaction management.

### 🛡 Infrastructure

- Optimized for 24/7 hosting.
- Improved performance and error handling.
- Continued development by **Noviqo Developers**.

---

## 📄 License

This project is licensed under the **MIT License**.

---

## ❤️ Developed by

**Noviqo Developers**

Building the next generation of Discord moderation and security tools.

---

> **Axiora is under active development.** More features, optimizations, and security improvements are coming in future releases.
