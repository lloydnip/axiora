const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("untimeout")
        .setDescription("Remove a timeout from a member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Member to remove the timeout from")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for removing the timeout")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),

    async execute(interaction) {

        const user = interaction.options.getUser("user");
        const reason =
            interaction.options.getString("reason") || "No reason provided";

        const member = await interaction.guild.members.fetch(user.id).catch(() => null);

        if (!member) {
            return interaction.reply({
                content: "❌ Member not found.",
                ephemeral: true
            });
        }

        if (!member.moderatable) {
            return interaction.reply({
                content: "❌ I cannot modify this member.",
                ephemeral: true
            });
        }

        if (!member.communicationDisabledUntil) {
            return interaction.reply({
                content: "❌ This member is not currently timed out.",
                ephemeral: true
            });
        }

        await member.timeout(null, reason);

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔓 Timeout Removed")
            .setDescription(`<@${interaction.user.id}> have removed the timeout from <@${user.id}> (${user.tag}). **Reason:** ${reason}`)
            .setFooter({ text: `Action taken by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        const logEmbed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("Timeout Removed")
            .setDescription(`**Member:** <@${user.id}> (${user.tag})\n**Moderator:** <@${interaction.user.id}> \n**Reason:** ${reason}`)
            .setFooter({ text: `Action taken by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setThumbnail(user.displayAvatarURL())
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

        await logModeration(interaction.guild, logEmbed);
    }
};