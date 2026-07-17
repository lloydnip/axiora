const {
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    ActionRowBuilder
} = require("discord.js");
const embedManager = require("../../utils/embedManager");

module.exports = {

    async execute(interaction) {

        const modal = new ModalBuilder()
            .setCustomId("welcome_description_modal")
            .setTitle("Welcome Embed Description");

        const description = new TextInputBuilder()
            .setCustomId("description")
            .setLabel("Embed Description")
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true)
            .setMaxLength(4000);

        modal.addComponents(
            new ActionRowBuilder().addComponents(description)
        );

        await interaction.showModal(modal);

    }

};