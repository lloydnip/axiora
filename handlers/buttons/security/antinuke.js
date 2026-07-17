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
    .setAuthor({
        name: `${interaction.guild.name} Security Center`,
        iconURL: interaction.guild.iconURL({ size: 1024 }) || undefined
    })
    .setTitle("Anti-Nuke System")
    .setThumbnail(interaction.guild.iconURL({ size: 1024 }))
    .setDescription(
        "Protect your server from malicious administrators, compromised accounts, and mass destructive actions."
    )
    .addFields(
        {
            name: "Status",
            value:
                `- **System:** ${config.enabled ? "`Enabled`" : "`Disabled`"}\n` +
                `- **Punishment:** \`${config.punishment.toUpperCase().replace(/_/g, " ")}\`\n` +
                `- **Log Channel:** ${config.logChannel ? `<#${config.logChannel}>` : "`Not Configured`"}\n` +
                `- **Whitelisted Users:** \`${config.whitelist.length}\``,
            inline: false
        },
        {
            name: "Channel Deletes",
            value: `**Limit:** \`${config.limits.channelDelete}\` / 10s`,
            inline: true
        },
        {
            name: "Channel Creates",
            value: `**Limit:** \`${config.limits.channelCreate}\` / 10s`,
            inline: true
        },
        {
            name: "Role Deletes",
            value: `**Limit:** \`${config.limits.roleDelete}\` / 10s`,
            inline: true
        },
        {
            name: "Role Creates",
            value: `**Limit:** \`${config.limits.roleCreate}\` / 10s`,
            inline: true
        },
        {
            name: "Member Bans",
            value: `**Limit:** \`${config.limits.ban}\` / 10s`,
            inline: true
        },
        {
            name: "Webhook Creates",
            value: `**Limit:** \`${config.limits.webhook}\` / 10s`,
            inline: true
        },
        {
            name: "Information",
            value:
                "If any configured limit is exceeded within **10 seconds**, Axiora will automatically apply the configured punishment and log the incident to the configured log channel."
        }
    )

    .setFooter({
        text: "Development Security Center • Page 3/4 • Anti Nuke"
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