const { EmbedBuilder } = require("discord.js");

const ticketManager =  require("../../../utils/ticketManager");

const ticketConfig = require("../../../utils/ticketConfig");

const { createTranscript } = require("../../../utils/transcript");

module.exports = { 
    customId: "ticket_confirm_close",
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

        const config = ticketConfig.get(interaction.guild.id);

        await interaction.update({
            content: "🔒 Ticket closing in **5 seconds**..."
        });

        let transcript;

        try {
            transcript = await createTranscript(interaction.channel);
        } catch (error) {
            console.error( "Transcript error:", error);
        }

        if (
            transcript &&
            config.transcriptChannelId
        ) {

            const logChannel =
                interaction.guild.channels.cache.get(
                    config.transcriptChannelId
                );

            if (logChannel) {

                const embed = new EmbedBuilder()
                    .setColor("#ED4245")
                    .setTitle("🔒 Ticket Closed")
                    .addFields(
                        {
                            name: "🎫 Ticket",
                            value: interaction.channel.name,
                            inline: true
                        },
                        {
                            name: "👤 Owner",
                            value: `<@${userId}>`,
                            inline: true
                        },
                        {
                            name: "🛡️ Closed By",
                            value: `${interaction.user}`,
                            inline: true
                        }
                    )
                    .setFooter({
                        text: `Ticket System | Axiora`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();

                await logChannel.send({
                    embeds: [embed],
                    files: [transcript]
                });
            }
        }

        setTimeout(async () => {
            ticketManager.deleteTicket(
                userId
            );

            await interaction.channel
                .delete()
                .catch(console.error);

        },
    5000
        );
    }
};