const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("lock")
        .setDescription("Lock the current channel.")
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for locking the channel")
                .setRequired(false)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const reason =
            interaction.options.getString("reason") || "No reason provided";

        await interaction.channel.permissionOverwrites.edit(
            interaction.guild.roles.everyone,
            {
                SendMessages: false
            }
        );

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🔒 Channel Locked")
            .setDescription(`This channel has been locked.`)
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