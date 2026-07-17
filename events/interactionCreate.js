const { Events, EmbedBuilder } = require("discord.js");

const buttons = require("../handlers/buttons");
const embedManager = require("../utils/embedManager");
const { replaceVariables } = require("../utils/variables");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {
                await command.execute(interaction, client);
            } catch (err) {
                console.error(err);

                if (!interaction.replied && !interaction.deferred) {
                    await interaction.reply({
                        content: "❌ An unexpected error occurred.",
                        ephemeral: true
                    }).catch(() => {});
                }
            }

            return;
        }

        if (interaction.isButton()) {

            const button = buttons.get(interaction.customId);

            if (!button) return;

            try {
                await button.execute(interaction, client);
            } catch (err) {

                console.error(err);

                if (interaction.deferred || interaction.replied) {
                    await interaction.editReply({
                        content: "❌ An unexpected error occurred."
                    }).catch(() => {});
                } else {
                    await interaction.reply({
                        content: "❌ An unexpected error occurred.",
                        ephemeral: true
                    }).catch(() => {});
                }
            }

            return;
        }


        if (interaction.isModalSubmit()) {
            if (interaction.customId === "welcome_description_modal") {

                const description =
                    interaction.fields.getTextInputValue("description");

                embedManager.update(
                    "welcome",
                    "description",
                    description
                );

                const embed = new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Welcome Description Updated")
                    .setDescription(
                        "The welcome embed description has been updated successfully."
                    )
                    .addFields({
                        name: "Preview",
                        value: description.length > 1024
                            ? description.substring(0, 1021) + "..."
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
