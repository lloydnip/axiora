const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    ChannelType,
    EmbedBuilder,
    ActionRowBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder
} = require("discord.js");

const ticketConfig = require("../../utils/ticketConfig");

module.exports = {

    data: new SlashCommandBuilder()
        .setName("ticket")
        .setDescription("Manage the ticket system.")

        .addSubcommandGroup(group =>
            group
                .setName("setup")
                .setDescription("Configure the ticket system.")

                .addSubcommand(sub =>
                    sub
                        .setName("category")
                        .setDescription(
                            "Set the category where tickets are created."
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "Ticket category"
                                )
                                .addChannelTypes(
                                    ChannelType.GuildCategory
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("supportrole")
                        .setDescription(
                            "Set the support role."
                        )
                        .addRoleOption(option =>
                            option
                                .setName("role")
                                .setDescription(
                                    "Support team role"
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("transcript")
                        .setDescription(
                            "Set the transcript channel."
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "Transcript channel"
                                )
                                .addChannelTypes(
                                    ChannelType.GuildText
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("panel")
                        .setDescription(
                            "Send the ticket panel."
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "Panel channel"
                                )
                                .addChannelTypes(
                                    ChannelType.GuildText
                                )
                                .setRequired(true)
                        )
                )
        )

        .addSubcommand(sub =>
            sub
                .setName("config")
                .setDescription(
                    "View the ticket configuration."
                )
        )

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        ),

    async execute(interaction) {

        const { client } = interaction;
        const guild = interaction.guild;

        const guildId =
            interaction.guild.id;

        const subcommand =
            interaction.options.getSubcommand();

        const group =
            interaction.options.getSubcommandGroup();

        if (
            group === "setup" &&
            subcommand === "category"
        ) {

            const channel =
                interaction.options.getChannel(
                    "channel"
                );

            ticketConfig.update(
                guildId,
                "ticketCategoryId",
                channel.id
            );

            const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: | Tickets will now be created inside this category ${channel}`)

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (
            group === "setup" &&
            subcommand === "supportrole"
        ) {

            const role =
                interaction.options.getRole(
                    "role"
                );

            ticketConfig.update(
                guildId,
                "supportRoleId",
                role.id
            );

            const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: | Support Role has been set to ${role}`)

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (
            group === "setup" &&
            subcommand === "transcript"
        ) {

            const channel =
                interaction.options.getChannel(
                    "channel"
                );

            ticketConfig.update(
                guildId,
                "transcriptChannelId",
                channel.id
            );

            const embed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: | Transcript Channel has been set to ${channel}`)

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }

        if (
            group === "setup" &&
            subcommand === "panel"
        ) {

            const channel =
                interaction.options.getChannel(
                    "channel"
                );

            const config =
                ticketConfig.get(guildId);

            if (
                !config.ticketCategoryId ||
                !config.supportRoleId
            ) {

            const embed = new EmbedBuilder()
            .setColor("Orange")
            .setDescription(`:warning: | Please configure the role and the category please. \n\n - Role: \`/ticket setup supportrole:@role\` \n - Category: \`/ticket setup category:#category\``)

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
            }

            const embed =
                new EmbedBuilder()
                    .setColor("#5865F2")
                    .setTitle("Support Tickets")
                    .setDescription("Click the dropdown below to open a ticket. \n\n **Categories:** \n - 🛠️ General Support \n - 🚨 Report a User \n - 💻 Technical Support \n - 🤝 Partnership")
                    .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }))
                    .setFooter({
                        text: `${guild.name} Ticket Management System`,
                        iconURL: client.user.displayAvatarURL()
                    })
                    .setTimestamp();

            const menu =
                new StringSelectMenuBuilder()
                    .setCustomId(
                        "ticket_category"
                    )
                    .setPlaceholder(
                        "Select a ticket category"
                    )
                    .addOptions(

                        Object.entries(
                            config.categories
                        ).map(
                            ([id, category]) =>
                                new StringSelectMenuOptionBuilder()
                                    .setLabel(
                                        category.name
                                    )
                                    .setDescription(
                                        category.description
                                    )
                                    .setEmoji(
                                        category.emoji
                                    )
                                    .setValue(id)
                        )
                    );

            const row =
                new ActionRowBuilder()
                    .addComponents(menu);

            await channel.send({
                embeds: [embed],
                components: [row]
            });

            const aembed = new EmbedBuilder()
            .setColor("Green")
            .setDescription(`:white_check_mark: | Ticket has been sent to ${channel}`)

            return interaction.reply({
                embeds: [aembed],
                ephemeral: true
            });
        }

        if (
            !group &&
            subcommand === "config"
        ) {

            const config =
                ticketConfig.get(guildId);

            const embed =
                new EmbedBuilder()
                    .setColor("#5865F2")
                    .setTitle("🎫 Ticket Configuration")
                    .addFields(

                        {
                            name: "🛡️ Support Role",
                            value:
                                config.supportRoleId
                                    ? `<@&${config.supportRoleId}>`
                                    : "Not configured",
                            inline: true
                        },

                        {
                            name: "📁 Ticket Category",
                            value:
                                config.ticketCategoryId
                                    ? `<#${config.ticketCategoryId}>`
                                    : "Not configured",
                            inline: true
                        },

                        {
                            name: "📄 Transcript Channel",
                            value:
                                config.transcriptChannelId
                                    ? `<#${config.transcriptChannelId}>`
                                    : "Not configured",
                            inline: true
                        }
                    )
                    .setFooter({
                        text: `${client.user.username} Ticket Management System`,
                        iconURL: client.user.displayAvatarURL()
                    })

            return interaction.reply({
                embeds: [embed],
                ephemeral: true
            });
        }
    }
};