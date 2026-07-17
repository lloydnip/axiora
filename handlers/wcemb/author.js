const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const text = interaction.options.getString("text");
        const icon = interaction.options.getString("icon");

        embedManager.updateNested(
            "welcome",
            "author",
            "text",
            text
        );

        if (icon) {
            embedManager.updateNested(
                "welcome",
                "author",
                "icon",
                icon
            );
        }

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Welcome Author Updated")
            .addFields(
                {
                    name: "Author Text",
                    value: text
                },
                {
                    name: "Author Icon",
                    value: icon || "*No changes*"
                }
            )
            .setTimestamp();

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }

};