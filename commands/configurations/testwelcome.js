const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { sendWelcome } = require("../../utils/welcome");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testwelcome")
        .setDescription("Test the welcome message.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        await sendWelcome(interaction.member);

        await interaction.reply({
            content: "✅ Welcome message sent.",
            ephemeral: true
        });

    }
};