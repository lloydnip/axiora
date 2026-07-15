const { Events } = require("discord.js");

const buttons = require("../handlers/buttons");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        // Slash Commands
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

        // Buttons
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

    }

};
