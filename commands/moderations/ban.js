const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ban")
        .setDescription("Ban a member from the server.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The member to ban")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the ban")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),

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
                content: "❌ You cannot ban yourself.",
                ephemeral: true
            });
        }

        if (member.id === interaction.guild.ownerId) {
            return interaction.reply({
                content: "❌ You cannot ban the server owner.",
                ephemeral: true
            });
        }

        if (!member.bannable) {
            return interaction.reply({
                content: "❌ I cannot ban that member. They may have a higher role than me.",
                ephemeral: true
            });
        }

        if (
            interaction.member.roles.highest.position <=
            member.roles.highest.position
        ) {
            return interaction.reply({
                content: "❌ You cannot ban someone with an equal or higher role.",
                ephemeral: true
            });
        }

        await member.ban({
            reason,
            deleteMessageSeconds: 0 // Don't delete previous messages
        });

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🔨 Member Banned")
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