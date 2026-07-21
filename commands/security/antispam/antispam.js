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
        loadJSON("antispam.json");

    if (!db[guildId]) {

        db[guildId] = {};
    }

    if (!db[guildId].antispam) {

        db[guildId].antispam = {
            enabled: false,
            maxMessages: 5,
            interval: 5,
            punishment: "timeout",
            timeoutDuration: 60000,
            deleteMessages: true,
            logChannel: null,
            ignoredChannels: [],
            ignoredUsers: []
        };

        saveJSON(
            "antispam.json",
            db
        );
    }

    const config =
        db[guildId].antispam;


    // Migration for existing configurations
    if (!Array.isArray(config.ignoredChannels)) {
        config.ignoredChannels = [];
    }

    if (!Array.isArray(config.ignoredUsers)) {
        config.ignoredUsers = [];
    }

    saveJSON(
        "antispam.json",
        db
    );


    return {
        db,
        config
    };
}


module.exports = {

    data: new SlashCommandBuilder()

        .setName("anti-spam")
        .setDescription("Configure Axiora Anti-Spam.")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )


        // =========================
        // STATUS
        // =========================

        .addSubcommand(sub =>
            sub
                .setName("status")
                .setDescription(
                    "View Anti-Spam settings."
                )
        )


        // =========================
        // ENABLE
        // =========================

        .addSubcommand(sub =>
            sub
                .setName("enable")
                .setDescription(
                    "Enable Anti-Spam."
                )
        )


        // =========================
        // DISABLE
        // =========================

        .addSubcommand(sub =>
            sub
                .setName("disable")
                .setDescription(
                    "Disable Anti-Spam."
                )
        )


        // =========================
        // MESSAGES
        // =========================

        .addSubcommand(sub =>
            sub
                .setName("messages")
                .setDescription(
                    "Set the maximum messages allowed."
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription(
                            "Maximum messages allowed."
                        )
                        .setRequired(true)
                        .setMinValue(2)
                        .setMaxValue(50)
                )
        )


        // =========================
        // INTERVAL
        // =========================

        .addSubcommand(sub =>
            sub
                .setName("interval")
                .setDescription(
                    "Set the spam detection interval."
                )
                .addIntegerOption(option =>
                    option
                        .setName("seconds")
                        .setDescription(
                            "Time interval in seconds."
                        )
                        .setRequired(true)
                        .setMinValue(1)
                        .setMaxValue(60)
                )
        )


        // =========================
        // PUNISHMENT
        // =========================

        .addSubcommand(sub =>
            sub
                .setName("punishment")
                .setDescription(
                    "Set the punishment."
                )
                .addStringOption(option =>
                    option
                        .setName("type")
                        .setDescription(
                            "Punishment type."
                        )
                        .setRequired(true)
                        .addChoices(
                            {
                                name: "Warn",
                                value: "warn"
                            },
                            {
                                name: "Timeout",
                                value: "timeout"
                            }
                        )
                )
        )


        // =========================
        // DELETE
        // =========================

        .addSubcommand(sub =>
            sub
                .setName("delete")
                .setDescription(
                    "Enable or disable deleting spam messages."
                )
                .addBooleanOption(option =>
                    option
                        .setName("enabled")
                        .setDescription(
                            "Delete spam messages?"
                        )
                        .setRequired(true)
                )
        )


        // =========================
        // IGNORE GROUP
        // =========================

        .addSubcommandGroup(group =>
            group
                .setName("ignore")
                .setDescription(
                    "Manage Anti-Spam exemptions."
                )

                .addSubcommand(sub =>
                    sub
                        .setName("channel")
                        .setDescription(
                            "Add or remove an ignored channel."
                        )
                        .addStringOption(option =>
                            option
                                .setName("action")
                                .setDescription(
                                    "Add or remove the channel."
                                )
                                .setRequired(true)
                                .addChoices(
                                    {
                                        name: "Add",
                                        value: "add"
                                    },
                                    {
                                        name: "Remove",
                                        value: "remove"
                                    }
                                )
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "Channel to ignore."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("user")
                        .setDescription(
                            "Add or remove an ignored user."
                        )
                        .addStringOption(option =>
                            option
                                .setName("action")
                                .setDescription(
                                    "Add or remove the user."
                                )
                                .setRequired(true)
                                .addChoices(
                                    {
                                        name: "Add",
                                        value: "add"
                                    },
                                    {
                                        name: "Remove",
                                        value: "remove"
                                    }
                                )
                        )
                        .addUserOption(option =>
                            option
                                .setName("user")
                                .setDescription(
                                    "User to ignore."
                                )
                                .setRequired(true)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("list")
                        .setDescription(
                            "View ignored channels and users."
                        )
                )
        )


        // =========================
        // LOGS
        // =========================

        .addSubcommandGroup(group =>
            group
                .setName("logs")
                .setDescription(
                    "Configure Anti-Spam logs."
                )

                .addSubcommand(sub =>
                    sub
                        .setName("set")
                        .setDescription(
                            "Set the Anti-Spam log channel."
                        )
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription(
                                    "Log channel."
                                )
                                .addChannelTypes(
                                    ChannelType.GuildText
                                )
                                .setRequired(true)
                        )
                )
        ),


    async execute(interaction) {

        const {
            db,
            config
        } = getConfig(
            interaction.guild.id
        );


        const group =
            interaction.options
                .getSubcommandGroup(false);


        const sub =
            interaction.options
                .getSubcommand();


        // =========================
        // IGNORE
        // =========================

        if (
            group === "ignore"
        ) {


            // IGNORE CHANNEL
            if (
                sub === "channel"
            ) {

                const action =
                    interaction.options
                        .getString(
                            "action"
                        );


                const channel =
                    interaction.options
                        .getChannel(
                            "channel"
                        );


                if (
                    action === "add"
                ) {

                    if (
                        config.ignoredChannels
                            .includes(
                                channel.id
                            )
                    ) {

                        return interaction.reply({
                            content:
                                `⚠️ ${channel} is already ignored by Anti-Spam.`,
                            ephemeral: true
                        });
                    }


                    config.ignoredChannels.push(
                        channel.id
                    );


                    saveJSON(
                        "antispam.json",
                        db
                    );


                    return interaction.reply({
                        content:
                            `✅ Anti-Spam will now ignore ${channel}.`
                    });
                }


                if (
                    action === "remove"
                ) {

                    const index =
                        config.ignoredChannels
                            .indexOf(
                                channel.id
                            );


                    if (
                        index === -1
                    ) {

                        return interaction.reply({
                            content:
                                `⚠️ ${channel} is not currently ignored.`,
                            ephemeral: true
                        });
                    }


                    config.ignoredChannels.splice(
                        index,
                        1
                    );


                    saveJSON(
                        "antispam.json",
                        db
                    );


                    return interaction.reply({
                        content:
                            `✅ ${channel} has been removed from the Anti-Spam ignore list.`
                    });
                }
            }


            // IGNORE USER
            if (
                sub === "user"
            ) {

                const action =
                    interaction.options
                        .getString(
                            "action"
                        );


                const user =
                    interaction.options
                        .getUser(
                            "user"
                        );


                if (
                    action === "add"
                ) {

                    if (
                        config.ignoredUsers
                            .includes(
                                user.id
                            )
                    ) {

                        return interaction.reply({
                            content:
                                `⚠️ ${user} is already ignored by Anti-Spam.`,
                            ephemeral: true
                        });
                    }


                    config.ignoredUsers.push(
                        user.id
                    );


                    saveJSON(
                        "antispam.json",
                        db
                    );


                    return interaction.reply({
                        content:
                            `✅ Anti-Spam will now ignore ${user}.`
                    });
                }


                if (
                    action === "remove"
                ) {

                    const index =
                        config.ignoredUsers
                            .indexOf(
                                user.id
                            );


                    if (
                        index === -1
                    ) {

                        return interaction.reply({
                            content:
                                `⚠️ ${user} is not currently ignored.`,
                            ephemeral: true
                        });
                    }


                    config.ignoredUsers.splice(
                        index,
                        1
                    );


                    saveJSON(
                        "antispam.json",
                        db
                    );


                    return interaction.reply({
                        content:
                            `✅ ${user} has been removed from the Anti-Spam ignore list.`
                    });
                }
            }


            // IGNORE LIST
            if (
                sub === "list"
            ) {

                const channels =
                    config.ignoredChannels.length > 0
                        ? config.ignoredChannels
                            .map(
                                id =>
                                    `<#${id}>`
                            )
                            .join("\n")
                        : "None";


                const users =
                    config.ignoredUsers.length > 0
                        ? config.ignoredUsers
                            .map(
                                id =>
                                    `<@${id}>`
                            )
                            .join("\n")
                        : "None";


                const embed =
                    new EmbedBuilder()
                        .setColor("Blue")
                        .setTitle(
                            "🛡️ Anti-Spam Ignore List"
                        )
                        .addFields(
                            {
                                name:
                                    "📺 Ignored Channels",
                                value:
                                    channels
                            },
                            {
                                name:
                                    "👤 Ignored Users",
                                value:
                                    users
                            }
                        )
                        .setTimestamp();


                return interaction.reply({
                    embeds: [
                        embed
                    ]
                });
            }
        }


        // =========================
        // NORMAL SUBCOMMANDS
        // =========================

        if (
            !group
        ) {

            switch (
                sub
            ) {

                case "status": {

                    const embed =
                        new EmbedBuilder()
                            .setColor(
                                config.enabled
                                    ? "Green"
                                    : "Red"
                            )
                            .setTitle(
                                "🛡️ Anti-Spam Status"
                            )
                            .addFields(
                                {
                                    name:
                                        "Status",
                                    value:
                                        config.enabled
                                            ? "Enabled"
                                            : "Disabled",
                                    inline: true
                                },
                                {
                                    name:
                                        "Messages",
                                    value:
                                        `${config.maxMessages}`,
                                    inline: true
                                },
                                {
                                    name:
                                        "Interval",
                                    value:
                                        `${config.interval} seconds`,
                                    inline: true
                                },
                                {
                                    name:
                                        "Punishment",
                                    value:
                                        config.punishment,
                                    inline: true
                                },
                                {
                                    name:
                                        "Delete Messages",
                                    value:
                                        config.deleteMessages
                                            ? "Enabled"
                                            : "Disabled",
                                    inline: true
                                },
                                {
                                    name:
                                        "Ignored Channels",
                                    value:
                                        `${config.ignoredChannels.length}`,
                                    inline: true
                                },
                                {
                                    name:
                                        "Ignored Users",
                                    value:
                                        `${config.ignoredUsers.length}`,
                                    inline: true
                                },
                                {
                                    name:
                                        "Log Channel",
                                    value:
                                        config.logChannel
                                            ? `<#${config.logChannel}>`
                                            : "`Not Set`",
                                    inline: true
                                }
                            )
                            .setTimestamp();


                    return interaction.reply({
                        embeds: [
                            embed
                        ]
                    });
                }


                case "enable":

                    config.enabled =
                        true;

                    break;


                case "disable":

                    config.enabled =
                        false;

                    break;


                case "messages":

                    config.maxMessages =
                        interaction.options
                            .getInteger(
                                "amount"
                            );

                    break;


                case "interval":

                    config.interval =
                        interaction.options
                            .getInteger(
                                "seconds"
                            );

                    break;


                case "punishment":

                    config.punishment =
                        interaction.options
                            .getString(
                                "type"
                            );

                    break;


                case "delete":

                    config.deleteMessages =
                        interaction.options
                            .getBoolean(
                                "enabled"
                            );

                    break;
            }
        }


        // =========================
        // LOGS
        // =========================

        if (
            group === "logs"
        ) {

            if (
                sub === "set"
            ) {

                config.logChannel =
                    interaction.options
                        .getChannel(
                            "channel"
                        )
                        .id;
            }
        }


        // =========================
        // SAVE
        // =========================

        saveJSON(
            "antispam.json",
            db
        );


        return interaction.reply({

            embeds: [

                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(
                        "✅ Anti-Spam Updated"
                    )
                    .setDescription(
                        "Your Anti-Spam settings have been saved successfully."
                    )
                    .setTimestamp()

            ]

        });
    }
};