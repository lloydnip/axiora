const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON } = require("../../utils/database");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("history")
        .setDescription("View a member's moderation history.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const user = interaction.options.getUser("user");

        const db = loadJSON("warnings.json");

        const warnings =
            db[interaction.guild.id]?.warnings?.[user.id] || [];

        const embed = new EmbedBuilder()
            .setColor("Blurple")
            .setTitle(`📜 ${user.tag}'s Moderation History`)
            .setThumbnail(user.displayAvatarURL());

        if (!warnings.length) {
            embed.setDescription("This member has no moderation history.");
        } else {

            embed.setDescription(
                `Total Warnings: **${warnings.length}**`
            );

            for (const warn of warnings.slice(-10).reverse()) {

                embed.addFields({
                    name: `⚠️ Warning • Case #${warn.caseId}`,
                    value:
`Reason: ${warn.reason}
Moderator: <@${warn.moderator}>
<t:${Math.floor(warn.timestamp / 1000)}:F>`
                });

            }

        }

        await interaction.reply({
            embeds: [embed]
        });

    }
};