const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const { logModeration } = require("../../utils/modLogger");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("slowmode")
        .setDescription("Set the channel slowmode.")
        .addIntegerOption(option =>
            option
                .setName("seconds")
                .setDescription("0-21600 seconds")
                .setRequired(true)
                .setMinValue(0)
                .setMaxValue(21600)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),

    async execute(interaction) {

        const seconds = interaction.options.getInteger("seconds");

        await interaction.channel.setRateLimitPerUser(seconds);

        const embed = new EmbedBuilder()
            .setColor("Blue")
            .setTitle("🐢 Slowmode Updated")
            .setDescription(
                seconds === 0
                    ? "Slowmode has been disabled."
                    : `Slowmode is now **${seconds} second(s)**.`
            )
            .setFooter({
                text: `Changed by ${interaction.user.tag}`
            })
            .setTimestamp();

        await interaction.reply({
            embeds: [embed]
        });

        await logModeration(interaction.guild, embed);
    }
};