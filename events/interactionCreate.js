const {
    Events,
    EmbedBuilder
} = require("discord.js");

const embedManager =
    require("../utils/embedManager");

const ticketManager =
    require("../utils/ticketManager");

const ticketConfig =
    require("../utils/ticketConfig");

module.exports = {

    name: Events.InteractionCreate,

    async execute(interaction, client) {

        // =========================
        // SLASH COMMANDS
        // =========================

        if (interaction.isChatInputCommand()) {

            const command =
                client.commands.get(
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
        // SELECT MENUS
        // =========================

        if (
            interaction.isStringSelectMenu() &&
            interaction.customId ===
            "ticket_category"
        ) {

            const existing =
                ticketManager.getTicket(
                    interaction.user.id
                );

            if (existing) {

                return interaction.reply({
                    content:
                        `❌ You already have an open ticket: <#${existing.channelId}>`,
                    ephemeral: true
                });
            }

            const category =
                interaction.values[0];

            const {
                ModalBuilder,
                TextInputBuilder,
                TextInputStyle,
                ActionRowBuilder
            } = require("discord.js");

            const modal =
                new ModalBuilder()
                    .setCustomId(
                        `ticket_modal_${category}`
                    )
                    .setTitle(
                        "Create Support Ticket"
                    );

            const concern =
                new TextInputBuilder()
                    .setCustomId(
                        "concern"
                    )
                    .setLabel(
                        "What do you need help with?"
                    )
                    .setStyle(
                        TextInputStyle.Paragraph
                    )
                    .setPlaceholder(
                        "Explain your concern..."
                    )
                    .setRequired(true)
                    .setMinLength(10)
                    .setMaxLength(1000);

            const row =
                new ActionRowBuilder()
                    .addComponents(
                        concern
                    );

            modal.addComponents(
                row
            );

            return interaction.showModal(
                modal
            );
        }

        // =========================
// TICKET ADD / REMOVE SELECT
// =========================

if (
    interaction.isStringSelectMenu()
) {

    if (
        interaction.customId ===
        "ticket_add_select"
    ) {

        const selected =
            interaction.values[0];

        const [
            type,
            targetId
        ] =
            selected.split("_");

        const target =
            type === "member"

                ? await interaction.guild.members
                    .fetch(targetId)
                    .catch(() => null)

                : interaction.guild.roles.cache.get(
                    targetId
                );

        if (!target) {

            return interaction.update({

                content:
                    "❌ This member or role no longer exists.",

                components: []
            });
        }

        await interaction.channel
            .permissionOverwrites
            .edit(
                target.id,
                {
                    ViewChannel:
                        true,

                    SendMessages:
                        true,

                    ReadMessageHistory:
                        true
                }
            );

        return interaction.update({

            content:
                `✅ Added ${target} to this ticket.`,

            components: []
        });
    }


    if (
        interaction.customId ===
        "ticket_remove_select"
    ) {

        const selected =
            interaction.values[0];

        const [
            type,
            targetId
        ] =
            selected.split("_");

        const target =
            type === "member"

                ? await interaction.guild.members
                    .fetch(targetId)
                    .catch(() => null)

                : interaction.guild.roles.cache.get(
                    targetId
                );

        if (!target) {

            return interaction.update({

                content:
                    "❌ This member or role no longer exists.",

                components: []
            });
        }

        await interaction.channel
            .permissionOverwrites
            .delete(
                target.id
            );

        return interaction.update({

            content:
                `✅ Removed ${target} from this ticket.`,

            components: []
        });
    }
}


        // =========================
        // BUTTONS
        // =========================

        if (interaction.isButton()) {

            const button =
                client.buttons.get(
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
                interaction.customId.startsWith(
                    "ticket_modal_"
                )
            ) {

                const config =
                    ticketConfig.get(
                        interaction.guild.id
                    );

                if (
                    !config.supportRoleId ||
                    !config.ticketCategoryId
                ) {
                    const embed = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`❌ | The ticket systemm has not been configured yet.`)

                    return interaction.reply({
                        embeds: [embed],
                        ephemeral: true
                    });
                }

                const existing =
                    ticketManager.getTicket(
                        interaction.user.id
                    );

                if (existing) {
                    const aembed = new EmbedBuilder()
                    .setColor("Orange")
                    .setDescription(`❌ | You already have an open ticket: <#${existing.channelId}>.`)

                    return interaction.reply({
                        embeds: [aembed],
                        ephemeral: true
                    });
                }

                const category =
                    interaction.customId.replace(
                        "ticket_modal_",
                        ""
                    );

                const concern =
                    interaction.fields.getTextInputValue(
                        "concern"
                    );

                const {
                    ChannelType,
                    PermissionFlagsBits,
                    ActionRowBuilder,
                    ButtonBuilder,
                    ButtonStyle
                } = require("discord.js");

                const ticketName =
                    `ticket-${interaction.user.username}`
                        .toLowerCase()
                        .replace(
                            /[^a-z0-9-]/g,
                            ""
                        )
                        .substring(0, 90);

                const channel =
                    await interaction.guild.channels.create({

                        name:
                            ticketName,

                        type:
                            ChannelType.GuildText,

                        parent:
                            config.ticketCategoryId,

                        permissionOverwrites: [

                            {
                                id:
                                    interaction.guild.id,

                                deny: [
                                    PermissionFlagsBits.ViewChannel
                                ]
                            },

                            {
                                id:
                                    interaction.user.id,

                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory
                                ]
                            },

                            {
                                id:
                                    config.supportRoleId,

                                allow: [
                                    PermissionFlagsBits.ViewChannel,
                                    PermissionFlagsBits.SendMessages,
                                    PermissionFlagsBits.ReadMessageHistory
                                ]
                            }
                        ]
                    });

                ticketManager.createTicket(
                    interaction.user.id,
                    {

                        guildId:
                            interaction.guild.id,

                        channelId:
                            channel.id,

                        category:
                            category,

                        createdAt:
                            Date.now()
                    }
                );

                const bembed =
                    new EmbedBuilder()
                        .setColor("#5865F2")
                        .setTitle("🎫 Support Ticket")
                        .setDescription( `Welcome ${interaction.user}!\n\n` + "A member of the support team will assist you shortly.")
                        .addFields(
                            {
                                name: "📂 Category",
                                value: category,
                                inline: true
                            },
                            {
                                name: "📝 Concern",
                                value: concern
                            }
                        )
                        .setTimestamp();

                const ticketButtons =
                    new ActionRowBuilder()
                        .addComponents(

                            new ButtonBuilder()
                                .setCustomId("ticket_claim")
                                .setLabel("Claim Ticket")
                                .setStyle(ButtonStyle.Primary),

                            new ButtonBuilder()
                                .setCustomId("ticket_add")
                                .setLabel("Add User/Role")
                                .setStyle(ButtonStyle.Secondary),

                            new ButtonBuilder()
                                .setCustomId("ticket_remove")
                                .setLabel("Remove User/Role")
                                .setStyle(ButtonStyle.Secondary),

                            new ButtonBuilder()
                                .setCustomId("ticket_close")
                                .setLabel("Close Ticket")
                                .setStyle(ButtonStyle.Danger)
                        );

                await channel.send({
                    content: `${interaction.user} <@&${config.supportRoleId}>`,
                    embeds: [bembed],
                    components: [ticketButtons]
                });

                const cembed = new EmbedBuilder()
                .setColor("Green")
                .setDescription(`:white_check_mark | Your ticket has ben created ${channel}`)

                return interaction.reply({
                    embeds: [cembed],
                    ephemeral: true
                });
            }


            // =========================
            // WELCOME DESCRIPTION
            // =========================

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

                const embed =
                    new EmbedBuilder()
                        .setColor(
                            "Green"
                        )
                        .setTitle(
                            "✅ Welcome Description Updated"
                        )
                        .setDescription(
                            "The welcome embed description has been updated successfully."
                        )
                        .addFields({

                            name:
                                "Preview",

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

                    embeds: [
                        embed
                    ],

                    ephemeral:
                        true
                });
            }
        }
    }
};
