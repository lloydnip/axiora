const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadJSON } = require("../../../utils/database");

module.exports = {

    customId: "security_antinuke",

    async execute(interaction) {

        const db = loadJSON("antinuke.json");

        const config = db[interaction.guild.id] || {

            enabled: false,

            punishment: "ban",

            logChannel: null,

            whitelist: [],

            limits: {

                channelDelete: 3,
                channelCreate: 3,
                roleDelete: 3,
                roleCreate: 3,
                ban: 3,
                webhook: 3

            }

        };

        const embed = new EmbedBuilder()

            .setColor(config.enabled ? "#57F287" : "#ED4245")

            .setThumbnail(interaction.guild.iconURL())

            .setDescription(
`# 🛡 Anti-Nuke System
> Protect your server from malicious administrators, compromised accounts, and mass destructive actions.

## Status
**System:** ${config.enabled ? "🟢 Enabled" : "⚪ Disabled"}
**Punishment:** \`${config.punishment.toUpperCase().replace(/_/g, " ")}\`
**Log Channel:** ${config.logChannel ? `<#${config.logChannel}>` : "`Not Configured`"}
**Whitelisted Users:** \`${config.whitelist.length}\`

## Protection Limits
-# Maximum actions allowed within **10 seconds**

🗑️ **Channel Deletes**
> ${config.limits.channelDelete}

📂 **Channel Creates**
> ${config.limits.channelCreate}

🎭 **Role Deletes**
> ${config.limits.roleDelete}

✨ **Role Creates**
> ${config.limits.roleCreate}

🔨 **Member Bans**
> ${config.limits.ban}

🪝 **Webhook Creates**
> ${config.limits.webhook}

##  Information
When any configured limit is exceeded, Axiora will automatically apply the configured punishment and record the incident in the configured log channel.`
)

            .setFooter({
                text: "Page 3/4 • Anti-Nuke System"
            })

            .setTimestamp();

        const row1 = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("security_overview")
                    .setLabel("Overview")
                    .setEmoji("🏠")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("security_lockdown")
                    .setLabel("Lockdown")
                    .setEmoji("🔒")
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("security_antinuke")
                    .setLabel("Anti-Nuke")
                    .setEmoji("🛡")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId("security_verification")
                    .setLabel("Verification")
                    .setEmoji("🎫")
                    .setStyle(ButtonStyle.Secondary)

            );

        await interaction.update({

            embeds: [embed],

            components: [row1]

        });

    }

};