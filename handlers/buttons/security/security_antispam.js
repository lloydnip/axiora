const {
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
} = require("discord.js");

const { loadJSON } = require("../../../utils/database");

module.exports = {

    customId: "security_antispam",

    async execute(interaction) {

        const db = loadJSON("antispam.json");

const config = {

    enabled: false,

    maxMessages: 5,

    interval: 5,

    punishment: "timeout",

    timeoutDuration: 60000,

    deleteMessages: true,

    logChannel: null,

    ignoredChannels: [],

    ignoredUsers: [],

    ...(db[interaction.guild.id]?.antispam || {})

};


        const punishment =
            String(
                config.punishment || "timeout"
            )
                .toUpperCase()
                .replace(
                    /_/g,
                    " "
                );


        const ignoredUsers =
            Array.isArray(
                config.ignoredUsers
            )
                ? config.ignoredUsers.length
                : 0;


        const ignoredChannels =
            Array.isArray(
                config.ignoredChannels
            )
                ? config.ignoredChannels.length
                : 0;


        const embed =
            new EmbedBuilder()

                .setColor(
                    config.enabled
                        ? "#57F287"
                        : "#ED4245"
                )

                .setAuthor({

                    name:
                        `${interaction.guild.name} Security Center`,

                    iconURL:
                        interaction.guild.iconURL({
                            size: 1024
                        }) || undefined

                })

                .setTitle(
                    "Anti-Spam System"
                )

                .setThumbnail(
                    interaction.guild.iconURL({
                        size: 1024
                    })
                )

                .setDescription(
                    "Automatically detects and prevents rapid message spam to keep your server safe and organized."
                )

                .addFields(

                    {
                        name: "Status",

                        value:

                            `- **System:** ${
                                config.enabled
                                    ? "`Enabled`"
                                    : "`Disabled`"
                            }\n` +

                            `- **Punishment:** \`${punishment}\`\n` +

                            `- **Log Channel:** ${
                                config.logChannel
                                    ? `<#${config.logChannel}>`
                                    : "`Not Configured`"
                            }\n` +

                            `- **Whitelisted Users:** \`${ignoredUsers}\`\n` +

                            `- **Whitelisted Channels:** \`${ignoredChannels}\``,

                        inline: false
                    },


                    {
                        name: "Max Messages",

                        value:
                            `\`${config.maxMessages}\``,

                        inline: true
                    },


                    {
                        name: "Max Interval",

                        value:
                            `\`${config.interval}\` seconds`,

                        inline: true
                    },


                    {
                        name: "Information",

                        value:
                            `If a user sends **${config.maxMessages} messages** within **${config.interval} seconds**, AntiSpam can automatically take action against them based on your configured settings.`

                    }

                )


                .setFooter({

                    text:
                        "Development Security Center • Page 5/5 • Anti-Spam"

                })


                .setTimestamp();


        const row1 =
            new ActionRowBuilder()

                .addComponents(

                    new ButtonBuilder()

                        .setCustomId(
                            "security_overview"
                        )

                        .setLabel(
                            "Overview"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        ),


                    new ButtonBuilder()

                        .setCustomId(
                            "security_lockdown"
                        )

                        .setLabel(
                            "Lockdown"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        ),


                    new ButtonBuilder()

                        .setCustomId(
                            "security_antinuke"
                        )

                        .setLabel(
                            "Anti-Nuke"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        ),


                    new ButtonBuilder()

                        .setCustomId(
                            "security_verification"
                        )

                        .setLabel(
                            "Verification"
                        )

                        .setStyle(
                            ButtonStyle.Secondary
                        ),


                    new ButtonBuilder()

                        .setCustomId(
                            "security_antispam"
                        )

                        .setLabel(
                            "Anti-Spam"
                        )

                        .setStyle(
                            ButtonStyle.Primary
                        )

                        .setDisabled(
                            true
                        )

                );


        await interaction.update({

            embeds: [
                embed
            ],

            components: [
                row1
            ]

        });

    }

};
