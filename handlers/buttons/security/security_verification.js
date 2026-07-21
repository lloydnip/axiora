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
        iconURL: interaction.guild.iconURL({ size: 1024 }) || undefined
    })
    .setTitle("Verification")
    .setThumbnail(interaction.guild.iconURL({ size: 1024 }) || undefined)
    .setDescription(
        "Configure and monitor the server verification system."
    )

    .addFields(
        {
            name: "Status",
            value: config.enabled
                ? "`Enabled`"
                : "`Disabled`",
            inline: true
        },
        {
            name: "Channel",
            value: config.channel
                ? `<#${config.channel}>`
                : "`Not Configured`",
            inline: true
        },
        {
            name: "Verified Role",
            value: config.role
                ? `<@&${config.role}>`
                : "`Not Configured`",
            inline: true
        },
        {
            name: "Log Channel",
            value: config.logChannel
                ? `<#${config.logChannel}>`
                : "`Not Configured`",
            inline: true
        },
        {
            name: "Session Timeout",
            value: `**${config.timeout || 5} Minutes**`,
            inline: true
        },
        {
            name: "ℹInformation",
            value:
                "Verification helps prevent spam bots and unauthorized accounts from joining."
        }
    )

    .setFooter({
        text: "Development Security Center • Page 4/4 • Verification"
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
