const { Events } = require("discord.js");

module.exports = {
    name: Events.InteractionCreate,

    async execute(interaction, client) {

        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (err) {
            console.error(err);

            const message = {
                content: "❌ An error occurred while executing this command.",
                ephemeral: true
            };

            if (interaction.replied || interaction.deferred) {
                await interaction.followUp(message);
            } else {
                await interaction.reply(message);
            }
        }
    }
};