const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadJSON } = require("../../../utils/database");

module.exports = {

    customId: "security_overview",

    async execute(interaction) {

        const security = loadJSON("security.json");
        const antinuke = loadJSON("antinuke.json");
        const verification = loadJSON("verification.json");
        const antispam = loadJSON("antispam.json");
        const antilink = loadJSON("antilink.json");
        const antibot = loadJSON("antibot.json");

        const guildId = interaction.guild.id;

        const lockdown =
            security[guildId]?.lockdown || {};

        const antiNuke =
            antinuke[guildId] || {};

        const verify =
            verification[guildId] || {};

        const antiSpam =
            antispam[guildId] || {};

        const antiLink =
            antilink[guildId] || {};

        const antiBot =
            antibot[guildId] || {};

        let score = 0;

        if (lockdown.active) score += 20;
        if (antiNuke.enabled) score += 20;
        if (verify.enabled) score += 20;
        if (antiSpam.enabled) score += 20;
        if (antiLink.enabled) score += 20;

        let rating = "Poor";

        if (score >= 100)
            rating = "Excellent";
        else if (score >= 80)
            rating = "Great";
        else if (score >= 60)
            rating = "Good";
        else if (score >= 40)
            rating = "Fair";

        const embed = new EmbedBuilder()
    .setColor("#5865F2")
    .setAuthor({
        name: `${interaction.guild.name} Security Center`,
        iconURL: interaction.guild.iconURL({ size: 1024 }) || undefined
    })
    .setTitle(`Security Overview`)
    .setThumbnail(interaction.guild.iconURL({ size: 1024 }) || undefined)
    .setDescription(
        "Welcome to the **Axiora Security Center**.\nMonitor your server's protection systems and security status."
    )

    .addFields(
        {
            name: "Overall Security",
            value:
                `- **Score:** \`${score}/100\`\n` +
                `- **Rating:** ${rating}`,
            inline: false
        },
        {
            name: "Lockdown",
            value: lockdown.active
                ? "`Enabled`"
                : "`Disabled`",
            inline: true
        },
        {
            name: "Anti-Nuke",
            value: antiNuke.enabled
                ? "`Enabled`"
                : "`Disabled`",
            inline: true
        },
        {
            name: "Verification",
            value: verify.enabled
                ? "`Enabled`"
                : "`Disabled`",
            inline: true
        },
        {
            name: "ℹInformation",
            value:
                "The security score is calculated based on the enabled protection systems."
        }
    )

    .setFooter({
        text: "Development Security Center • Page 1/4 • Overview"
    })
    .setTimestamp();

        const row1 = new ActionRowBuilder()

            .addComponents(

                new ButtonBuilder()
                    .setCustomId("security_overview")
                    .setLabel("Overview")
                    .setEmoji("🏠")
                    .setStyle(ButtonStyle.Primary)
                    .setDisabled(true),

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
                    .setStyle(ButtonStyle.Secondary)

            );

        await interaction.update({

            embeds: [embed],

            components: [row1]

        });

    }

};
