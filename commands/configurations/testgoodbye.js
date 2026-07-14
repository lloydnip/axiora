const {
    SlashCommandBuilder,
    PermissionFlagsBits
} = require("discord.js");

const { sendGoodbye } = require("../../utils/goodbye");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("testgoodbye")
        .setDescription("Test the goodbye message.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        ),

    async execute(interaction) {

        await sendGoodbye(interaction.member);

        await interaction.reply({
            content: "✅ Goodbye message sent.",
            ephemeral: true
        });

    }
};