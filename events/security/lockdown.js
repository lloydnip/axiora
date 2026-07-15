const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadJSON } = require("../../../utils/database");

module.exports = {

    customId: "security_lockdown",

    async execute(interaction) {

        const security = loadJSON("security.json");

        const guildData =
            security[interaction.guild.id] || {};

        const lockdown =
            guildData.lockdown || {};

        const ignored =
            lockdown.ignoredChannels || [];

        const role =
            lockdown.role
                ? `<@&${lockdown.role}>`
                : "`Not Configured`";

        const moderator =
            lockdown.moderator
                ? `<@${lockdown.moderator}>`
                : "`None`";

        const started =
            lockdown.timestamp
                ? `<t:${Math.floor(lockdown.timestamp / 1000)}:F>\n<t:${Math.floor(lockdown.timestamp / 1000)}:R>`
                : "`Never`";

        const embed = new EmbedBuilder()

            .setColor(
                lockdown.active
                    ? "#57F287"
                    : "#ED4245"
            )

            .setAuthor({
                name: `${interaction.guild.name} Security Center`,
                iconURL: interaction.guild.iconURL()
            })

            .setThumbnail(interaction.guild.iconURL())

            .setDescription(
`# 🔒 Lockdown

Manage your server's lockdown configuration.

## Status
${lockdown.active ? "🟢 **Enabled**" : "⚪ **Disabled**"}

## Bypass Role
${role}

## Ignored Channels
${ignored.length ? ignored.map(id => `<#${id}>`).join("\n") : "`None`"}

## Reason
${lockdown.reason || "`None`"}

## Moderator
${moderator}

## Started
${started}
`
            )

            .setFooter({
                text: "Page 2/4 • Lockdown"
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
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),

                new ButtonBuilder()
                    .setCustomId("security_antinuke")
                    .setLabel("Anti-Nuke")
                    .setEmoji("🛡")
                    .setStyle(ButtonStyle.Secondary),

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