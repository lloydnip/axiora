const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unlock")
        .setDescription("Unlock the current channel.")
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for unlocking")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const reason =
            interaction.options.getString("reason") || "No reason provided";

        await interaction.channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                SendMessages: null
            }
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("🔓 Channel Unlocked")
            .setDescription(`This channel has been unlocked.`)
            .addFields(
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