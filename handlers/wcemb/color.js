const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const color = interaction.options.getString("color");

        // Basic hex validation
        if (!/^#([0-9A-F]{6})$/i.test(color)) {
            return interaction.reply({
                content: "❌ Please provide a valid hex color (example: `#5865F2`).",
                ephemeral: true
            });
        }

        embedManager.update(
            "welcome",
            "color",
            color
        );

        const embed = new EmbedBuilder()
            .setColor(color)
            .setTitle("✅ Welcome Color Updated")
            .setDescription(`Color set to \`${color}\``)
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }

};