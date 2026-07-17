const buildWelcomeEmbed = require("../../utils/welcomeEmbed");

module.exports = {
    async execute(interaction) {

        const message = buildWelcomeEmbed(interaction.member);

        message.ephemeral = true;

        await interaction.reply(message);

    }
};