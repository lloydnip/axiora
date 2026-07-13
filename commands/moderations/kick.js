const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("kick")
        .setDescription("Kick a member from the server.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to kick")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the kick")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),

    async execute(interaction) {

        const user = interaction.options.getUser("user");
        const reason =
            interaction.options.getString("reason") || "No reason provided";

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "❌ That user is not in this server.",
                ephemeral: true
            });
        }

        if (member.id === interaction.user.id) {
            return interaction.reply({
                content: "❌ You cannot kick yourself.",
                ephemeral: true
            });
        }

        if (member.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: "❌ You cannot kick the server owner.",
                ephemeral: true
            });
        }

        if (!member.kickable) {
            return interaction.reply({
                content: "❌ I cannot kick that member. They may have a higher role than me.",
                ephemeral: true
            });
        }

        if (
            interaction.member.roles.highest.position <=
            member.roles.highest.position
        ) {
            return interaction.reply({
                content: "❌ You cannot kick someone with an equal or higher role.",
                ephemeral: true
            });
        }

        await member.kick(reason);

        const embed = new EmbedBuilder()
            .setColor("Orange")
            .setTitle("👢 Member Kicked")
            .addFields(
                {
                    name: "Member",
                    value: `${user.tag} (${user.id})`
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