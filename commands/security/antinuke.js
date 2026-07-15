const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ChannelType
} = require("discord.js");

const {
    loadJSON,
    saveJSON
} = require("../../utils/database");

function getConfig(guildId) {
    const db = loadJSON("antinuke.json");

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

        saveJSON("antinuke.json", db);
    }

    return { db, config: db[guildId] };
}

module.exports = {

    data: new SlashCommandBuilder()
        .setName("antinuke")
        .setDescription("Configure Axiora Anti-Nuke.")
        .setDefaultMemberPermissions(
            PermissionFlagsBits.Administrator
        )

        .addSubcommand(sub =>
            sub
                .setName("status")
                .setDescription("View Anti-Nuke settings.")
        )

        .addSubcommand(sub =>
            sub
                .setName("enable")
                .setDescription("Enable Anti-Nuke.")
        )

        .addSubcommand(sub =>
            sub
                .setName("disable")
                .setDescription("Disable Anti-Nuke.")
        )

        .addSubcommand(sub =>
            sub
                .setName("punishment")
                .setDescription("Set the punishment.")
                .addStringOption(option =>
                    option
                        .setName("type")
                        .setDescription("Punishment type")
                        .setRequired(true)
                        .addChoices(
                            { name: "Ban", value: "ban" },
                            { name: "Kick", value: "kick" },
                            { name: "Timeout", value: "timeout" },
                            { name: "Strip Roles", value: "strip_roles" }
                        )
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("limit")
                .setDescription("Manage Anti-Nuke limits.")

                .addSubcommand(sub =>
                    sub
                        .setName("set")
                        .setDescription("Set an action limit.")
                        .addStringOption(option =>
                            option
                                .setName("action")
                                .setDescription("Action")
                                .setRequired(true)
                                .addChoices(
                                    { name: "Channel Delete", value: "channelDelete" },
                                    { name: "Channel Create", value: "channelCreate" },
                                    { name: "Role Delete", value: "roleDelete" },
                                    { name: "Role Create", value: "roleCreate" },
                                    { name: "Ban", value: "ban" },
                                    { name: "Webhook", value: "webhook" }
                                )
                        )
                        .addIntegerOption(option =>
                            option
                                .setName("amount")
                                .setDescription("Allowed actions within 10 seconds")
                                .setRequired(true)
                                .setMinValue(1)
                                .setMaxValue(20)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("view")
                        .setDescription("View current limits.")
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("logs")
                .setDescription("Configure Anti-Nuke logs.")

                .addSubcommand(sub =>
                    sub
                        .setName("set")
                        .setDescription("Set the log channel.")
                        .addChannelOption(option =>
                            option
                                .setName("channel")
                                .setDescription("Log channel")
                                .addChannelTypes(ChannelType.GuildText)
                                .setRequired(true)
                        )
                )
        )

        .addSubcommandGroup(group =>
            group
                .setName("whitelist")
                .setDescription("Manage the whitelist.")

                .addSubcommand(sub =>
                    sub
                        .setName("add")
                        .setDescription("Add a user.")
                        .addUserOption(option =>
                            option
                                .setName("user")
                                .setDescription("User")
                                .setRequired(true)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("remove")
                        .setDescription("Remove a user.")
                        .addUserOption(option =>
                            option
                                .setName("user")
                                .setDescription("User")
                                .setRequired(true)
                        )
                )

                .addSubcommand(sub =>
                    sub
                        .setName("list")
                        .setDescription("View the whitelist.")
                )
        ),

    async execute(interaction) {

        const { db, config } = getConfig(interaction.guild.id);

        const group = interaction.options.getSubcommandGroup(false);
        const sub = interaction.options.getSubcommand();

        if (!group) {

            switch (sub) {

                case "status": {

                    const embed = new EmbedBuilder()
                        .setColor(config.enabled ? "Green" : "Red")
                        .setTitle("🛡 Anti-Nuke Status")
                        .addFields(
                            {
                                name: "Status",
                                value: config.enabled ? "Enabled" : "Disabled",
                                inline: true
                            },
                            {
                                name: "Punishment",
                                value: config.punishment,
                                inline: true
                            },
                            {
                                name: "Log Channel",
                                value: config.logChannel
                                    ? `<#${config.logChannel}>`
                                    : "`Not Set`",
                                inline: true
                            },
                            {
                                name: "Whitelisted Users",
                                value: `${config.whitelist.length}`,
                                inline: true
                            }
                        );

                    return interaction.reply({ embeds: [embed] });
                }

                case "enable":
                    config.enabled = true;
                    break;

                case "disable":
                    config.enabled = false;
                    break;

                case "punishment":
                    config.punishment =
                        interaction.options.getString("type");
                    break;
            }

        } else {

            switch (group) {

                case "limit":

                    if (sub === "set") {

                        config.limits[
                            interaction.options.getString("action")
                        ] =
                            interaction.options.getInteger("amount");

                    } else {

                        const embed = new EmbedBuilder()
                            .setColor("Blurple")
                            .setTitle("📊 Anti-Nuke Limits");

                        for (const key in config.limits) {
                            embed.addFields({
                                name: key,
                                value: `${config.limits[key]}`,
                                inline: true
                            });
                        }

                        return interaction.reply({
                            embeds: [embed]
                        });

                    }

                    break;

                case "logs":

                    config.logChannel =
                        interaction.options.getChannel("channel").id;

                    break;

                case "whitelist":

                    if (sub === "add") {

                        const user =
                            interaction.options.getUser("user");

                        if (!config.whitelist.includes(user.id))
                            config.whitelist.push(user.id);

                    }

                    if (sub === "remove") {

                        const user =
                            interaction.options.getUser("user");

                        config.whitelist =
                            config.whitelist.filter(
                                id => id !== user.id
                            );

                    }

                    if (sub === "list") {

                        return interaction.reply({

                            embeds: [

                                new EmbedBuilder()
                                    .setColor("Blurple")
                                    .setTitle("Whitelist")
                                    .setDescription(
                                        config.whitelist.length
                                            ? config.whitelist
                                                  .map(id => `<@${id}>`)
                                                  .join("\n")
                                            : "*No whitelisted users.*"
                                    )

                            ]

                        });

                    }

                    break;
            }

        }

        saveJSON("antinuke.json", db);

        return interaction.reply({

            embeds: [

                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("✅ Anti-Nuke Updated")
                    .setDescription(
                        "Your changes have been saved successfully."
                    )

            ]

        });

    }

};
