const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("View a member's warnings.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to view")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const user = interaction.options.getUser("user");

        const db = loadJSON("warnings.json");

        const warnings =
            db[interaction.guild.id]?.warnings?.[user.id] || [];

        if (!warnings.length) {
            return interaction.reply({
                content: "✅ This member has no warnings.",
                ephemeral: true
            });
        }

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle(`⚠️ ${user.tag}'s Warnings`);

        for (const warn of warnings) {
            embed.addFields({
                name: `Case #${warn.caseId}`,
                value:
`**Reason:** ${warn.reason}
**Moderator:** <@${warn.moderator}>
**Date:** <t:${Math.floor(warn.timestamp / 1000)}:F>`
            });
        }

        await interaction.reply({
            embeds: [embed]
        });

    }
};