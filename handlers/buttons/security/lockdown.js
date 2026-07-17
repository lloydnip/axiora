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
    .setColor(lockdown.active ? "#57F287" : "#ED4245")
    .setTitle("Lockdown")
    .setAuthor({
        name: `${interaction.guild.name} Security Center`,
        iconURL: interaction.guild.iconURL({ size: 1024 }) || undefined
    })
    .setThumbnail(interaction.guild.iconURL({ size: 1024 }) || undefined)
    .setDescription(
        "Configure and monitor your server's lockdown system."
    )

    .addFields(
        {
            name: "Status",
            value: lockdown.active
                ? "`Enabled`"
                : "`Disabled`",
            inline: true
        },
        {
            name: "Bypass Role",
            value: role,
            inline: true
        },
        {
            name: "Moderator",
            value: moderator,
            inline: true
        },
        {
            name: "Reason",
            value: lockdown.reason || "`None`",
            inline: false
        },
        {
            name: "📂 Ignored Channels",
            value: ignored.length
                ? ignored.map(id => `<#${id}>`).join("\n")
                : "`None`",
            inline: false
        },
        {
            name: "🕒 Started",
            value: started,
            inline: false
        },
        {
            name: "Information",
            value:
                "When lockdown is enabled, members without the configured bypass role will be prevented from sending messages in locked channels. Ignored channels remain accessible during lockdown."
        }
    )

    .setFooter({
        text: "Development Security Center • Page 2/4 • Lockdown"
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