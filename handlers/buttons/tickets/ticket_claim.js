const {
    EmbedBuilder
} = require("discord.js");

const ticketManager =
    require("../../../utils/ticketManager");

module.exports = {

    customId:
        "ticket_claim",

    async execute(interaction) {

        const ticket =
            ticketManager.getTicketByChannel(
                interaction.channel.id
            );

        if (!ticket) {
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`:x: | This is not a valid ticket`)

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        const [
            userId,
            ticketData
        ] = ticket;

        if (ticketData.claimedBy) {
            const embed = new EmbedBuilder()
                .setColor("Blurple")
                .setDescription(`:x: | This ticket is already claimed by <@${ticketData.claimedBy}>.`)

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        ticketManager.updateTicket(
            userId,
            {
                claimedBy:
                    interaction.user.id
            }
        );

        const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: | This ticket has been claimed by ${interaction.user}.`)

        await interaction.reply({
            embeds: [embed],
            ephemeral: true
            });
    }
};