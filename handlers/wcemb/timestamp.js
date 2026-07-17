const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");

module.exports = {
    async execute(interaction) {

        const enabled = interaction.options.getBoolean("enabled");

        embedManager.update(
            "welcome",
            "timestamp",
            enabled
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Welcome Timestamp Updated")
            .setDescription(
                `Timestamp has been **${enabled ? "Enabled" : "Disabled"}**.`
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });
    }
};