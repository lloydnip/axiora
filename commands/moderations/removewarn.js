const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

const { logModeration } = require("../../utils/modLogger");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("removewarn")
        .setDescription("Remove a warning from a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member")
                .setRequired(true)
        )
        .addIntegerOption(option =>
            option
                .setName("case")
                .setDescription("Case ID")
                .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const user = interaction.options.getUser("user");
        const caseId = interaction.options.getInteger("case");

        const db = loadJSON("warnings.json");

        const warnings =
            db[interaction.guild.id]?.warnings?.[user.id];

        if (!warnings || warnings.length === 0) {
            return interaction.reply({
                content: "❌ This member has no warnings.",
                ephemeral: true
            });
        }

        const index = warnings.findIndex(w => w.caseId === caseId);

        if (index === -1) {
            return interaction.reply({
                content: "❌ Warning case not found.",
                ephemeral: true
            });
        }

        const removed = warnings.splice(index, 1)[0];

        saveJSON("warnings.json", db);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Warning Removed")
            .addFields(
                {
                    name: "Member",
                    value: user.tag
                },
                {
                    name: "Case",
                    value: `#${removed.caseId}`
                },
                {
                    name: "Reason",
                    value: removed.reason
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        await logModeration(interaction.guild, embed);

    }

};