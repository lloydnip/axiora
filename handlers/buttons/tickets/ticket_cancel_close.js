module.exports = {

    customId:
        "ticket_cancel_close",

    async execute(interaction) {

        await interaction.update({

            content:
                "❌ Ticket closing cancelled.",

            embeds: [],

            components: []
        });
    }
};