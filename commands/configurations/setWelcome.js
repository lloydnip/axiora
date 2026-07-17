const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder
} = require("discord.js");

const embedManager = require("../../utils/embedManager");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("setwelcome")
        .setDescription("Set the welcome channel.")
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)

        .addChannelOption(option =>
            option
                .setName("channel")
                .setDescription("Select the welcome channel.")
                .addChannelTypes(ChannelType.GuildText)
                .setRequired(true)
        ),

    async execute(interaction) {

        const channel = interaction.options.getChannel("channel");

        embedManager.update(
            "welcome",
            "channel",
            channel.id
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Welcome Channel Updated")
            .setDescription(
                `Welcome messages will now be sent in ${channel}.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }
};
