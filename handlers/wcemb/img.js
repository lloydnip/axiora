const { EmbedBuilder } = require("discord.js");
const embedManager = require("../../utils/embedManager");
const { replaceVariables } = require("../../utils/variables");

module.exports = {
    async execute(interaction) {

        const type = interaction.options.getString("type");
        const attachment = interaction.options.getAttachment("image");
        const variable = interaction.options.getString("variable");


        let imageUrl;


        // Uploaded image
        if (attachment) {

            if (!attachment.contentType?.startsWith("image/")) {
                return interaction.reply({
                    content: "❌ Please upload a valid image file.",
                    ephemeral: true
                });
            }

            imageUrl = attachment.url;
        }


        // Variable image
        if (variable) {

            imageUrl = replaceVariables(
                variable,
                interaction.member
            );

        }


        if (!imageUrl) {
            return interaction.reply({
                content: "❌ Please provide an image or variable.",
                ephemeral:true
            });
        }



        switch (type) {

            case "author":

                embedManager.updateNested(
                    "welcome",
                    "author",
                    "icon",
                    imageUrl
                );

                break;



            case "thumbnail":

                embedManager.update(
                    "welcome",
                    "thumbnail",
                    imageUrl
                );

                break;



            case "image":

                embedManager.update(
                    "welcome",
                    "image",
                    imageUrl
                );

                break;



            case "footer":

                embedManager.updateNested(
                    "welcome",
                    "footer",
                    "icon",
                    imageUrl
                );

                break;



            default:

                return interaction.reply({
                    content:"❌ Invalid image type.",
                    ephemeral:true
                });
        }



        const embed = new EmbedBuilder()

            .setColor("Green")

            .setTitle("✅ Welcome Image Updated")

            .setDescription(
                `Successfully updated **${type}** image.\n\n` +
                `Image: ${imageUrl}`
            )

            .setImage(imageUrl)

            .setFooter({
                text:"Welcome Embed Configuration"
            })

            .setTimestamp();



        await interaction.reply({
            embeds:[embed],
            ephemeral:true
        });

    }
};