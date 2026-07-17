const {
    EmbedBuilder
} = require("discord.js");

const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const text = interaction.options.getString("text");
        const remove = interaction.options.getBoolean("remove");


        // Remove title
        if (remove) {

            embedManager.update(
                "welcome",
                "title",
                null
            );


            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Welcome Title Removed")
                .setDescription("The welcome embed title has been removed.")
                .setTimestamp();


            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });

        }



        // Require text if not removing
        if (!text) {

            return interaction.reply({
                content: "❌ Please provide a title or select `remove: true`.",
                ephemeral: true
            });

        }



        // Update title
        embedManager.update(
            "welcome",
            "title",
            text
        );


        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Welcome Title Updated")
            .setDescription(`New title:\n\n${text}`)
            .setTimestamp();


        await interaction.reply({
            embeds: [embed],
            ephemeral: true
        });

    }

};