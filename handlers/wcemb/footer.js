const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const text = interaction.options.getString("text");

        embedManager.updateNested(
            "welcome",
            "footer",
            "text",
            text
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Welcome Footer Updated")
            .setDescription(text)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }

};