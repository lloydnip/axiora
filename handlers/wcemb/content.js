const {
    EmbedBuilder
} = require("discord.js");

const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const text = interaction.options.getString("text");
        const remove = interaction.options.getBoolean("remove");


        // Remove content
        if (remove) {

            embedManager.update(
                "welcome",
                "content",
                null
            );


            const embed = new EmbedBuilder()
                .setColor("Green")
                .setTitle("✅ Welcome Content Removed")
                .setDescription(
                    "The welcome message content has been removed."
                )
                .setTimestamp();


            return interaction.reply({
                embeds:[embed],
                ephemeral:true
            });

        }



        if (!text) {

            return interaction.reply({
                content:"❌ Please provide content or select remove.",
                ephemeral:true
            });

        }



        embedManager.update(
            "welcome",
            "content",
            text
        );


        const embed = new EmbedBuilder()
            .setColor("Green")
            .setTitle("✅ Welcome Content Updated")
            .setDescription(
                `New content:\n\n${text}`
            )
            .setTimestamp();


        await interaction.reply({
            embeds:[embed],
            ephemeral:true
        });

    }

};