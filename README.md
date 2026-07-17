# <img src="https://raw.githubusercontent.com/twitter/twemoji/master/assets/svg/1f6e1.svg" width="30"> Axiora

> **A modern, modular, and powerful Discord moderation & security bot built with Discord.js v14.**

Axiora is designed to provide everything a Discord community needs—from moderation and security to automation and server management. The project is built with scalability in mind, allowing new systems to be added without changing the core architecture.

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
│   ├── verification/
│   └── security/
│
├── events/
│
├── handlers/
│   ├── buttons/
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

# Axiora | Patch Notes v0.0.4
*Released: July 16–17, 2026*

## :wrench: Welcome System Improvements
The **Welcome System** has been significantly improved with a new **Embed Builder**, allowing server administrators to fully customize welcome messages and embeds through an interactive, button-based interface.

### Updated Commands
The following commands now use **button-based navigation** for a more intuitive configuration experience:
- **`/setwelcome`** — Interactive welcome configuration
- **`/wcemb content`** — Configure welcome content
- **`/wcemb title`** — Configure the embed title
- **`/wcemb color`** — Configure the embed color
- **`/wcemb description`** — Configure the embed description
- **`/wcemb field`** — Manage embed fields
- **`/wcemb img`** — Configure author icons, thumbnails, images, and footer icons
- **`/wcemb footer`** — Configure the embed footer
- **`/wcemb timestamp`** — Enable or disable the embed timestamp
- **`/wcemb button`** — Manage link buttons
- **`/wcemb preview`** — Preview the current welcome embed
- **`/wcemb reset`** — Reset the welcome embed configuration
- **`/wcemb variables`** — View all available welcome variables

### Additional Improvements
- Fixed button navigation for the **`/security`** dashboard.
- Fixed major bugs and errors on each commands.
- Welcome System is now logged so administrators can view the latest on the said system.

> **Axiora **is still under active development. More features, performance improvements, bug fixes, and security enhancements are planned for future updates.
---

## 📄 License

This project is licensed under the **MIT License**.

---

## ❤️ Developed by

**Noviqo Developers**

Building the next generation of Discord moderation and security tools.

---

> **Axiora is under active development.** More features, optimizations, and security improvements are coming in future releases.
