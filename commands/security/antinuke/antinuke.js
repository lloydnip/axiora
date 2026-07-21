const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

const {
    loadJSON,
    saveJSON
} = require("../../../utils/database");

function getConfig(guildId) {

    const db =
        loadJSON("antinuke.json");

    if (!db[guildId]) {

        db[guildId] = {

            enabled: false,

            punishment: "ban",

            logChannel: null,

            whitelist: [],

            limits: {

                channelDelete: 3,

                channelCreate: 3,

                roleDelete: 3,

                roleCreate: 3,

                ban: 3,

                webhook: 3

            }

        };

        saveJSON(
            "antinuke.json",
            db
        );
    }

    return {

        db,

        config: db[guildId]

    };

}


module.exports = {


    data:

        new SlashCommandBuilder()

            .setName(
                "anti-nuke"
            )

            .setDescription(
                "Configure Axiora Anti-Nuke."
            )

            .setDefaultMemberPermissions(
                PermissionFlagsBits.Administrator
            )


            // =========================
            // STATUS
            // =========================

            .addSubcommand(
                sub =>
                    sub

                        .setName(
                            "status"
                        )

                        .setDescription(
                            "View Anti-Nuke settings."
                        )
            )


            // =========================
            // ENABLE
            // =========================

            .addSubcommand(
                sub =>
                    sub

                        .setName(
                            "enable"
                        )

                        .setDescription(
                            "Enable Anti-Nuke."
                        )
            )


            // =========================
            // DISABLE
            // =========================

            .addSubcommand(
                sub =>
                    sub

                        .setName(
                            "disable"
                        )

                        .setDescription(
                            "Disable Anti-Nuke."
                        )
            )


            // =========================
            // PUNISHMENT
            // =========================

            .addSubcommand(
                sub =>
                    sub

                        .setName(
                            "punishment"
                        )

                        .setDescription(
                            "Set the punishment."
                        )

                        .addStringOption(
                            option =>
                                option

                                    .setName(
                                        "type"
                                    )

                                    .setDescription(
                                        "Punishment type."
                                    )

                                    .setRequired(
                                        true
                                    )

                                    .addChoices(

                                        {
                                            name:
                                                "Ban",

                                            value:
                                                "ban"
                                        },

                                        {
                                            name:
                                                "Kick",

                                            value:
                                                "kick"
                                        },

                                        {
                                            name:
                                                "Timeout",

                                            value:
                                                "timeout"
                                        },

                                        {
                                            name:
                                                "Strip Roles",

                                            value:
                                                "strip_roles"
                                        }

                                    )
                        )
            )


            // =========================
            // LIMIT GROUP
            // =========================

            .addSubcommandGroup(

                group =>

                    group

                        .setName(
                            "limit"
                        )

                        .setDescription(
                            "Manage Anti-Nuke limits."
                        )


                        // SET LIMIT
                        .addSubcommand(

                            sub =>

                                sub

                                    .setName(
                                        "set"
                                    )

                                    .setDescription(
                                        "Set an action limit."
                                    )

                                    .addStringOption(

                                        option =>

                                            option

                                                .setName(
                                                    "action"
                                                )

                                                .setDescription(
                                                    "Action."
                                                )

                                                .setRequired(
                                                    true
                                                )

                                                .addChoices(

                                                    {
                                                        name:
                                                            "Channel Delete",

                                                        value:
                                                            "channelDelete"
                                                    },

                                                    {
                                                        name:
                                                            "Channel Create",

                                                        value:
                                                            "channelCreate"
                                                    },

                                                    {
                                                        name:
                                                            "Role Delete",

                                                        value:
                                                            "roleDelete"
                                                    },

                                                    {
                                                        name:
                                                            "Role Create",

                                                        value:
                                                            "roleCreate"
                                                    },

                                                    {
                                                        name:
                                                            "Ban",

                                                        value:
                                                            "ban"
                                                    },

                                                    {
                                                        name:
                                                            "Webhook",

                                                        value:
                                                            "webhook"
                                                    }

                                                )
                                    )

                                    .addIntegerOption(

                                        option =>

                                            option

                                                .setName(
                                                    "amount"
                                                )

                                                .setDescription(
                                                    "Allowed actions within 10 seconds."
                                                )

                                                .setRequired(
                                                    true
                                                )

                                                .setMinValue(
                                                    1
                                                )

                                                .setMaxValue(
                                                    20
                                                )
                                    )

                        )


                        // VIEW LIMITS
                        .addSubcommand(

                            sub =>

                                sub

                                    .setName(
                                        "view"
                                    )

                                    .setDescription(
                                        "View current limits."
                                    )

                        )

            )


            // =========================
            // LOGS GROUP
            // =========================

            .addSubcommandGroup(

                group =>

                    group

                        .setName(
                            "logs"
                        )

                        .setDescription(
                            "Configure Anti-Nuke logs."
                        )

                        .addSubcommand(

                            sub =>

                                sub

                                    .setName(
                                        "set"
                                    )

                                    .setDescription(
                                        "Set the log channel."
                                    )

                                    .addChannelOption(

                                        option =>

                                            option

                                                .setName(
                                                    "channel"
                                                )

                                                .setDescription(
                                                    "Log channel."
                                                )

                                                .addChannelTypes(
                                                    ChannelType.GuildText
                                                )

                                                .setRequired(
                                                    true
                                                )

                                    )

                        )

            )


            // =========================
            // WHITELIST GROUP
            // =========================

            .addSubcommandGroup(

                group =>

                    group

                        .setName(
                            "whitelist"
                        )

                        .setDescription(
                            "Manage the whitelist."
                        )


                        // ADD
                        .addSubcommand(

                            sub =>

                                sub

                                    .setName(
                                        "add"
                                    )

                                    .setDescription(
                                        "Add a user."
                                    )

                                    .addUserOption(

                                        option =>

                                            option

                                                .setName(
                                                    "user"
                                                )

                                                .setDescription(
                                                    "User."
                                                )

                                                .setRequired(
                                                    true
                                                )

                                    )

                        )


                        // REMOVE
                        .addSubcommand(

                            sub =>

                                sub

                                    .setName(
                                        "remove"
                                    )

                                    .setDescription(
                                        "Remove a user."
                                    )

                                    .addUserOption(

                                        option =>

                                            option

                                                .setName(
                                                    "user"
                                                )

                                                .setDescription(
                                                    "User."
                                                )

                                                .setRequired(
                                                    true
                                                )

                                    )

                        )


                        // LIST
                        .addSubcommand(

                            sub =>

                                sub

                                    .setName(
                                        "list"
                                    )

                                    .setDescription(
                                        "View the whitelist."
                                    )

                        )

            ),


    async execute(
        interaction
    ) {


        const {

            client

        } = interaction;


        const {

            db,

            config

        } = getConfig(

            interaction.guild.id

        );


        const group =

            interaction.options

                .getSubcommandGroup(
                    false
                );


        const sub =

            interaction.options

                .getSubcommand();


        // =====================================================
        // NORMAL SUBCOMMANDS
        // =====================================================

        if (
            !group
        ) {


            switch (
                sub
            ) {


                // =====================================================
                // STATUS
                // =====================================================

                case "status": {

                    const embed =

                        new EmbedBuilder()

                            .setColor(

                                config.enabled

                                    ? "Green"

                                    : "Red"

                            )

                            .setTitle(

                                "🛡 Anti-Nuke Status"

                            )

                            .setDescription(

                                `Anti-Nuke System is currently **${

                                    config.enabled

                                        ? "Enabled"

                                        : "Disabled"

                                }**.`

                            )

                            .addFields(

                                {

                                    name:
                                        "Status",

                                    value:

                                        config.enabled

                                            ? "Enabled"

                                            : "Disabled",

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "Punishment",

                                    value:

                                        config.punishment,

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "Log Channel",

                                    value:

                                        config.logChannel

                                            ? `<#${config.logChannel}>`

                                            : "`Not Set`",

                                    inline:
                                        true

                                },

                                {

                                    name:
                                        "Whitelisted Users",

                                    value:

                                        `${

                                            config.whitelist.length

                                        }`,

                                    inline:
                                        true

                                }

                            )

                            .setFooter({

                                text:
                                    "Anti-Nuke System Configuration",

                                iconURL:

                                    client.user

                                        .displayAvatarURL()

                            })

                            .setTimestamp();


                    return interaction.reply({

                        embeds: [

                            embed

                        ]

                    });

                }


                // =====================================================
                // ENABLE
                // =====================================================

                case "enable": {

                    if (
                        config.enabled
                    ) {

                        const embed =

                            new EmbedBuilder()

                                .setColor(
                                    "Orange"
                                )

                                .setTitle(
                                    "Anti-Nuke System"
                                )

                                .setDescription(

                                    "Anti-Nuke System is already **enabled**."

                                )

                                .setFooter({

                                    text:
                                        "Anti-Nuke System Configuration",

                                    iconURL:

                                        client.user

                                            .displayAvatarURL()

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


                    config.enabled =
                        true;


                    saveJSON(

                        "antinuke.json",

                        db

                    );


                    const embed =

                        new EmbedBuilder()

                            .setColor(
                                "Green"
                            )

                            .setTitle(
                                "Anti-Nuke System"
                            )

                            .setDescription(

                                `Anti-Nuke System has been **enabled** by <@${interaction.user.id}>`

                            )

                            .setFooter({

                                text:
                                    "Anti-Nuke System Configuration",

                                iconURL:

                                    client.user

                                        .displayAvatarURL()

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


                // =====================================================
                // DISABLE
                // =====================================================

                case "disable": {

                    if (
                        !config.enabled
                    ) {

                        const embed =

                            new EmbedBuilder()

                                .setColor(
                                    "Orange"
                                )

                                .setTitle(
                                    "Anti-Nuke System"
                                )

                                .setDescription(

                                    "Anti-Nuke System is already **disabled**."

                                )

                                .setFooter({

                                    text:
                                        "Anti-Nuke System Configuration",

                                    iconURL:

                                        client.user

                                            .displayAvatarURL()

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


                    config.enabled =
                        false;


                    saveJSON(

                        "antinuke.json",

                        db

                    );


                    const embed =

                        new EmbedBuilder()

                            .setColor(
                                "Red"
                            )

                            .setTitle(
                                "Anti-Nuke System"
                            )

                            .setDescription(

                                `Anti-Nuke System has been **disabled** by <@${interaction.user.id}>`

                            )

                            .setFooter({

                                text:
                                    "Anti-Nuke System Configuration",

                                iconURL:

                                    client.user

                                        .displayAvatarURL()

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


                // =====================================================
                // PUNISHMENT
                // =====================================================

                case "punishment": {

                    const punishment =

                        interaction.options

                            .getString(
                                "type"
                            );


                    config.punishment =
                        punishment;


                    saveJSON(

                        "antinuke.json",

                        db

                    );


                    const embed =

                        new EmbedBuilder()

                            .setColor(
                                "Blue"
                            )

                            .setTitle(

                                "Anti-Nuke Punishment Updated"

                            )

                            .setDescription(

                                `The Anti-Nuke punishment has been set to **${

                                    punishment

                                        .replace(
                                            /_/g,
                                            " "
                                        )

                                        .toUpperCase()

                                }**.`

                            )

                            .setFooter({

                                text:
                                    "Anti-Nuke System Configuration",

                                iconURL:

                                    client.user

                                        .displayAvatarURL()

                            })

                            .setTimestamp();


                    return interaction.reply({

                        embeds: [

                            embed

                        ]

                    });

                }

            }

        }


        // =====================================================
        // LIMIT GROUP
        // =====================================================

        if (
            group === "limit"
        ) {


            if (
                sub === "set"
            ) {

                const action =

                    interaction.options

                        .getString(
                            "action"
                        );


                const amount =

                    interaction.options

                        .getInteger(
                            "amount"
                        );


                config.limits[action] =
                    amount;


                saveJSON(

                    "antinuke.json",

                    db

                );


                const embed =

                    new EmbedBuilder()

                        .setColor(
                            "Blue"
                        )

                        .setTitle(

                            "Anti-Nuke Limit Updated"

                        )

                        .setDescription(

                            `The limit for **${

                                action

                                    .replace(
                                        /([A-Z])/g,
                                        " $1"
                                    )

                            }** has been set to **${

                                amount

                            } actions per 10 seconds.`

                        )

                        .setFooter({

                            text:
                                "Anti-Nuke System Configuration",

                            iconURL:

                                client.user

                                    .displayAvatarURL()

                        })

                        .setTimestamp();


                return interaction.reply({

                    embeds: [

                        embed

                    ]

                });

            }


            if (
                sub === "view"
            ) {

                const limits =

                    Object.entries(

                        config.limits

                    )

                        .map(

                            ([

                                key,

                                value

                            ]) =>

                                `**${

                                    key

                                        .replace(
                                            /([A-Z])/g,
                                            " $1"
                                        )

                                }:** \`${

                                    value

                                }\``

                        )

                        .join(
                            "\n"
                        );


                const embed =

                    new EmbedBuilder()

                        .setColor(
                            "Blurple"
                        )

                        .setTitle(

                            "Anti-Nuke Limits"

                        )

                        .setDescription(

                            limits

                        )

                        .setFooter({

                            text:
                                "Anti-Nuke System Configuration",

                            iconURL:

                                client.user

                                    .displayAvatarURL()

                        })

                        .setTimestamp();


                return interaction.reply({

                    embeds: [

                        embed

                    ]

                });

            }

        }


        // =====================================================
        // LOGS GROUP
        // =====================================================

        if (
            group === "logs"
        ) {


            const channel =

                interaction.options

                    .getChannel(
                        "channel"
                    );


            config.logChannel =
                channel.id;


            saveJSON(

                "antinuke.json",

                db

            );


            const embed =

                new EmbedBuilder()

                    .setColor(
                        "Green"
                    )

                    .setTitle(

                        "Anti-Nuke Log Channel Updated"

                    )

                    .setDescription(

                        `Anti-Nuke logs will now be sent to ${channel}.`

                    )

                    .setFooter({

                        text:
                            "Anti-Nuke System Configuration",

                        iconURL:

                            client.user

                                .displayAvatarURL()

                    })

                    .setTimestamp();


            return interaction.reply({

                embeds: [

                    embed

                ]

            });

        }


        // =====================================================
        // WHITELIST GROUP
        // =====================================================

        if (
            group === "whitelist"
        ) {


            const user =

                interaction.options

                    .getUser(
                        "user"
                    );


            // =================================================
            // ADD
            // =================================================

            if (
                sub === "add"
            ) {


                if (

                    config.whitelist

                        .includes(
                            user.id
                        )

                ) {

                    const embed =

                        new EmbedBuilder()

                            .setColor(
                                "Orange"
                            )

                            .setTitle(

                                "Anti-Nuke Whitelist"

                            )

                            .setDescription(

                                `${user} is already whitelisted.`

                            )

                            .setTimestamp();


                    return interaction.reply({

                        embeds: [

                            embed

                        ],

                        ephemeral:
                            true

                    });

                }


                config.whitelist

                    .push(
                        user.id
                    );


                saveJSON(

                    "antinuke.json",

                    db

                );


                const embed =

                    new EmbedBuilder()

                        .setColor(
                            "Green"
                        )

                        .setTitle(

                            "User Whitelisted"

                        )

                        .setDescription(

                            `${user} has been added to the Anti-Nuke whitelist.`

                        )

                        .setFooter({

                            text:
                                "Anti-Nuke System Configuration",

                            iconURL:

                                client.user

                                    .displayAvatarURL()

                        })

                        .setTimestamp();


                return interaction.reply({

                    embeds: [

                        embed

                    ]

                });

            }


            // =================================================
            // REMOVE
            // =================================================

            if (
                sub === "remove"
            ) {


                if (

                    !config.whitelist

                        .includes(
                            user.id
                        )

                ) {

                    const embed =

                        new EmbedBuilder()

                            .setColor(
                                "Orange"
                            )

                            .setTitle(

                                "Anti-Nuke Whitelist"

                            )

                            .setDescription(

                                `${user} is not currently whitelisted.`

                            )

                            .setTimestamp();


                    return interaction.reply({

                        embeds: [

                            embed

                        ],

                        ephemeral:
                            true

                    });

                }


                config.whitelist =

                    config.whitelist

                        .filter(

                            id =>

                                id !== user.id

                        );


                saveJSON(

                    "antinuke.json",

                    db

                );


                const embed =

                    new EmbedBuilder()

                        .setColor(
                            "Red"
                        )

                        .setTitle(

                            "User Removed From Whitelist"

                        )

                        .setDescription(

                            `${user} has been removed from the Anti-Nuke whitelist.`

                        )

                        .setFooter({

                            text:
                                "Anti-Nuke System Configuration",

                            iconURL:

                                client.user

                                    .displayAvatarURL()

                        })

                        .setTimestamp();


                return interaction.reply({

                    embeds: [

                        embed

                    ]

                });

            }


            // =================================================
            // LIST
            // =================================================

            if (
                sub === "list"
            ) {


                const embed =

                    new EmbedBuilder()

                        .setColor(
                            "Blurple"
                        )

                        .setTitle(

                            "Anti-Nuke Whitelist"

                        )

                        .setDescription(

                            config.whitelist.length

                                ?

                                    config.whitelist

                                        .map(

                                            id =>

                                                `<@${id}>`

                                        )

                                        .join(
                                            "\n"
                                        )

                                :

                                    "*No whitelisted users.*"

                        )

                        .setFooter({

                            text:
                                "Anti-Nuke System Configuration",

                            iconURL:

                                client.user

                                    .displayAvatarURL()

                        })

                        .setTimestamp();


                return interaction.reply({

                    embeds: [

                        embed

                    ]

                });

            }

        }

    }

};
