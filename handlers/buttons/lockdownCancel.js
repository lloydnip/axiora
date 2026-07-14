module.exports = {

    customId: "lockdown_cancel",

    async execute(interaction) {

        await interaction.update({
            content: "❌ Lockdown cancelled.",
            embeds: [],
            components: []
        });

    }

};