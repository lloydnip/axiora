const {

    EmbedBuilder

} = require("discord.js");

const {

    deleteSession

} = require("../../../utils/verificationSessions");

module.exports = {

    customId: "verification_cancel",

    async execute(interaction) {

        deleteSession(interaction.user.id);

        const embed = new EmbedBuilder()

            .setColor("Red")

            .setTitle("❌ Verification Cancelled")

            .setDescription(

                "Your verification session has been cancelled.\n\nReturn to the server and click **Verify** again whenever you're ready."

            );

        await interaction.update({

            embeds: [embed],

            components: [],

            files: []

        });

    }

};