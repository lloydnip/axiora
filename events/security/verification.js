const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadJSON } = require("../../../utils/database");

module.exports = {

    customId: "security_verification",

    async execute(interaction) {

        const db = loadJSON("verification.json");

        const config = db[interaction.guild.id] || {

            enabled: false,

            channel: null,

            role: null,

            logChannel: null,

            dmVerification: true,

            captcha: true,

            timeout: 5

        };

        const embed = new EmbedBuilder()

            .setColor(config.enabled ? "#57F287" : "#ED4245")

            .setAuthor({
                name: `${interaction.guild.name} Security Center`,
                iconURL: interaction.guild.iconURL()
            })

            .setThumbnail(interaction.guild.iconURL())

            .setDescription(
`# 🎫 Verification

Configure and monitor the server verification system.

## Status
${config.enabled ? "🟢 **Enabled**" : "⚪ **Disabled**"}

## Verification Channel
${config.channel ? `<#${config.channel}>` : "`Not Configured`"}

## Verified Role
${config.role ? `<@&${config.role}>` : "`Not Configured`"}

## Log Channel
${config.logChannel ? `<#${config.logChannel}>` : "`Not Configured`"}

## Verification Method

📩 DM Verification
${config.dmVerification ? "🟢 Enabled" : "⚪ Disabled"}

🔐 CAPTCHA
${config.captcha ? "🟢 Enabled" : "⚪ Disabled"}

⏳ Session Timeout
**${config.timeout || 5} Minutes**

> Members must successfully complete the verification process before accessing the server.
`
            )

            .setFooter({
                text: "Page 4/4 • Verification"
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
                    .setStyle(ButtonStyle.Secondary),

                new ButtonBuilder()
                    .setCustomId("security_verification")
                    .setLabel("Verification")
                    .setEmoji("🎫")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true)

            );

        await interaction.update({

            embeds: [embed],

            components: [row1]

        });

    }

};