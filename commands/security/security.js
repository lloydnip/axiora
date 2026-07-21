const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadJSON } = require("../../utils/database");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("security")
        .setDescription("View the Axiora Security Center.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        const security = loadJSON("security.json");
        const antinuke = loadJSON("antinuke.json");
        const verification = loadJSON("verification.json");
        const antispam = loadJSON("antispam.json");

        const guildId = interaction.guild.id;

        const lockdown =
            security[guildId]?.lockdown || {};

        const antiNuke =
            antinuke[guildId] || {};

        const verify =
            verification[guildId] || {};

        const antiSpam =
            antispam[guildId] || {};

        let score = 0;

        if (lockdown.active) score += 20;
        if (antiNuke.enabled) score += 20;
        if (verify.enabled) score += 20;
        if (antiSpam.enabled) score += 20;

        let rating = "Poor 🔴";

        if (score >= 100)
            rating = "Excellent 🟢";
        else if (score >= 80)
            rating = "Great 🟢";
        else if (score >= 60)
            rating = "Good 🟡";
        else if (score >= 40)
            rating = "Fair 🟠";

        const embed = new EmbedBuilder()

            .setColor("#5865F2")

            .setAuthor({
                name: `${interaction.guild.name} Security Center`,
                iconURL: interaction.guild.iconURL()
            })

            .setThumbnail(interaction.guild.iconURL())

            .setDescription(
`# 🛡 Axiora Security

Welcome to the **Axiora Security Center**.

### Overall Security

> **Score:** **${score}/100**
> **Rating:** **${rating}**

## Systems

🔒 **Lockdown**
${lockdown.active ? "🟢 Enabled" : "⚪ Disabled"}

🛡 **Anti-Nuke**
${antiNuke.enabled ? "🟢 Enabled" : "⚪ Disabled"}

🎫 **Verification**
${verify.enabled ? "🟢 Enabled" : "⚪ Disabled"}

Use the buttons below to manage each security module.`
            )

            .setFooter({
                text: "Page 1/6 • Overview • Axiora Security"
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

        await interaction.reply({

            embeds: [embed],

            components: [row1]

        });

    }

};
