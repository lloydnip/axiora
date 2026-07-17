const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");

module.exports = {
    async execute(interaction) {

        embedManager.reset("welcome");

        const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("🗑️ Welcome Embed Reset")
            .setDescription(
                "The welcome embed configuration has been reset to its default values."
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }
};