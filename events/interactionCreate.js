const { Events } = require("discord.js");

const buttons = require("../handlers/buttons");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        if (interaction.isChatInputCommand()) {

            const command = client.commands.get(interaction.commandName);

            if (!command) return;

            try {

                await command.execute(interaction);

            } catch (err) {

                console.error(err);

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({
                        content: "❌ An error occurred.",
                        ephemeral: true
                    });

                } else {

                    await interaction.reply({
                        content: "❌ An error occurred.",
                        ephemeral: true
                    });

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

            }

        }

    }

};
