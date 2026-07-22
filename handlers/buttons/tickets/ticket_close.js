const {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    EmbedBuilder
} = require("discord.js");

const ticketManager =
    require("../../../utils/ticketManager");

module.exports = {
    customId: "ticket_close",
    async execute(interaction) {
        const { client } = interaction;

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

        const embed = new EmbedBuilder()
            .setColor("#ED4245")
            .setTitle("🔒 Close Ticket?")
            .setDescription(
                "Are you sure you want to close this ticket?\n\n" +
                "The ticket transcript will be saved and " +
                "the channel will be deleted."
            )
            .setFooter({
                text: "This action requires confirmation.",
                iconURL: client.user.displayAvatarURL()
            });

        const row = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId("ticket_confirm_close")
                        .setLabel("Confirm Close")
                        .setStyle(ButtonStyle.Danger),

                    new ButtonBuilder()
                        .setCustomId("ticket_cancel_close")
                        .setLabel("Cancel")
                        .setStyle(ButtonStyle.Secondary)
                );

        await interaction.reply({
            embeds: [embed],
            components: [row]
        });
    }
};