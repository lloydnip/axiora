const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a user from the server.")
        .addStringOption(option =>
            option
                .setName("userid")
                .setDescription("The ID of the user to unban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the unban")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

    async execute(interaction) {

        const userId = interaction.options.getString("userid");
        const reason =
            interaction.options.getString("reason") || "No reason provided";

        const bans = await interaction.guild.bans.fetch();

        const bannedUser = bans.get(userId);

        if (!bannedUser) {
            return interaction.reply({
                content: "❌ That user is not banned.",
                ephemeral: true
            });
        }

        await interaction.guild.members.unban(userId, reason);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔓 Member Unbanned")
            .addFields(
                {
                    name: "User",
                    value: `${bannedUser.user.tag}`
                },
                {
                    name: "Moderator",
                    value: interaction.user.tag
                },
                {
                    name: "Reason",
                    value: reason
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        await logModeration(interaction.guild, embed);
    }
};