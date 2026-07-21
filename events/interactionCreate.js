const {
    Events,
    EmbedBuilder
} = require("discord.js");

const embedManager = require("../utils/embedManager");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        // =========================
        // SLASH COMMANDS
        // =========================

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(
                interaction.commandName
            );

            if (!command) return;

            try {
                await command.execute(
                    interaction,
                    client
                );
            } catch (error) {

                console.error(
                    `Error in /${interaction.commandName}:`,
                    error
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {
                    await interaction.followUp({
                        content:
                            "❌ An unexpected error occurred.",
                        ephemeral: true
                    }).catch(() => {});
                } else {
                    await interaction.reply({
                        content:
                            "❌ An unexpected error occurred.",
                        ephemeral: true
                    }).catch(() => {});
                }
            }

            return;
        }


        // =========================
        // BUTTONS
        // =========================

        if (interaction.isButton()) {

            const button = client.buttons.get(
                interaction.customId
            );

            if (!button) {

                console.log(
                    `❌ Button not found: ${interaction.customId}`
                );

                return interaction.reply({
                    content:
                        "❌ This button is not configured correctly.",
                    ephemeral: true
                }).catch(() => {});
            }

            try {

                await button.execute(
                    interaction,
                    client
                );

            } catch (error) {

                console.error(
                    `Error in button ${interaction.customId}:`,
                    error
                );

                if (
                    interaction.replied ||
                    interaction.deferred
                ) {
                    await interaction.followUp({
                        content:
                            "❌ An error occurred while processing this button.",
                        ephemeral: true
                    }).catch(() => {});
                } else {
                    await interaction.reply({
                        content:
                            "❌ An error occurred while processing this button.",
                        ephemeral: true
                    }).catch(() => {});
                }
            }

            return;
        }


        // =========================
        // MODALS
        // =========================

        if (interaction.isModalSubmit()) {

            if (
                interaction.customId ===
                "welcome_description_modal"
            ) {

                const description =
                    interaction.fields.getTextInputValue(
                        "description"
                    );

                embedManager.update(
                    "welcome",
                    "description",
                    description
                );

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(
                        "✅ Welcome Description Updated"
                    )
                    .setDescription(
                        "The welcome embed description has been updated successfully."
                    )
                    .addFields({
                        name: "Preview",
                        value:
                            description.length > 1024
                                ? description.substring(
                                    0,
                                    1021
                                ) + "..."
                                : description
                    })
                    .setTimestamp();

                return interaction.reply({
                    embeds: [embed],
                    ephemeral: true
                });
            }
        }
    }
};
