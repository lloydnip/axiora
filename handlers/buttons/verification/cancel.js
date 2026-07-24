const { EmbedBuilder } = require("discord.js");

const { deleteSession } = require("../../../utils/verificationSessions");

module.exports = {
    customId: "verification_cancel",
    async execute(interaction) {
        const { client } = interaction
        try {
            deleteSession(
                interaction.user.id
            );

            const embed = new EmbedBuilder()
            .setColor("Red")
            .setTitle("❌ Verification Cancelled")
            .setDescription(
                "Your verification session has been cancelled.\n\n" +
                "No verification data was saved.\n\n" +
                "Return to the server and click **Verify** again whenever you're ready.")
            .setFooter({
                text: "Axiora Security",
                iconURL: Client.user.displayAvatarURL()
            })
            .setTimestamp();

            await interaction.update({
                embeds: [embed],
                components: [],
                files: []
            });

        } catch (error) {

            console.error("Verification Cancel Error:", error);

            if (
                interaction.replied ||
                interaction.deferred
            ) {
                return interaction.followUp({
                    content: "❌ Failed to cancel your verification session.",
                    ephemeral: true
                }).catch(
                    () => {}
                );
            }

            return interaction.reply({
                content: "❌ Failed to cancel your verification session.",
                ephemeral: true
            });
        }
    }
};
