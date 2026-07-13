const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { loadJSON, saveJSON } = require("../../utils/database");

const { logModeration } = require("../../utils/modLogger");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("clearwarns")
        .setDescription("Remove all warnings from a member.")
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

        if (
            !db[interaction.guild.id] ||
            !db[interaction.guild.id].warnings[user.id]
        ) {
            return interaction.reply({
                content: "❌ This member has no warnings.",
                ephemeral: true
            });
        }   

        const total =
            db[interaction.guild.id].warnings[user.id].length;

        delete db[interaction.guild.id].warnings[user.id];

        saveJSON("warnings.json", db);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🗑️ Warnings Cleared")
            .addFields(
                {
                    name: "Member",
                    value: user.tag
                },
                {
                    name: "Warnings Removed",
                    value: `${total}`
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        await logModeration(interaction.guild, embed);
    }

};