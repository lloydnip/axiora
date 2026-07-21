const {
    Events,
    EmbedBuilder
} = require("discord.js");

const {
    getSession,
    deleteSession
} = require("../utils/verificationSessions");

const {
    getConfig
} = require("../utils/verification");

module.exports = {
    name: Events.MessageCreate,

    async execute(message, client) {

        // =========================
    // SERVER ANTISPAM
    // =========================

    if (message.guild) {

        const {
            checkSpam,
            clearUser
        } = require("../utils/antispam");

        const {
            PermissionsBitField
        } = require("discord.js");

        if (
            message.member.permissions.has(
                PermissionsBitField.Flags.Administrator
            )
        ) {
            return;
        }

        const result =
            checkSpam(message);

        if (
            !result.spam
        ) {
            return;
        }

        try {

            if (
                result.config.deleteMessages
            ) {
                await message.delete()
                    .catch(() => {});
            }

            if (
                result.config.action ===
                "timeout"
            ) {

                if (
                    message.member.moderatable
                ) {

                    await message.member.timeout(
                        result.config.timeoutDuration,
                        `AntiSpam: ${result.reason}`
                    );
                }
            }

            const warning =
                await message.channel.send({
                    content:
                        `⚠️ ${message.author}, please stop spamming.`
                });

            setTimeout(() => {
                warning.delete()
                    .catch(() => {});
            }, 5000);

            clearUser(
                message.guild.id,
                message.author.id
            );

        } catch (error) {

            console.error(
                "AntiSpam Error:",
                error
            );
        }

        return;
    }


        // Ignore bot messages
        if (message.author.bot) return;

        // Only handle DMs
        if (message.guild) return;

        // Find verification session
        const session =
            getSession(message.author.id);

        if (!session) return;

        const input =
            message.content
                .trim()
                .toUpperCase();

        const expected =
            String(session.captcha)
                .trim()
                .toUpperCase();


        // =========================
        // WRONG CAPTCHA
        // =========================

        if (input !== expected) {

            session.attempts++;

            const remaining =
                3 - session.attempts;

            if (remaining <= 0) {

                deleteSession(
                    message.author.id
                );

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle(
                                "❌ Verification Failed"
                            )
                            .setDescription(
                                "You entered an incorrect CAPTCHA **3 times**.\n\n" +
                                "Return to the server and press **Verify** to start again."
                            )
                            .setFooter({
                                text: "Axiora Security"
                            })
                            .setTimestamp()
                    ]
                });
            }

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Orange")
                        .setTitle(
                            "⚠️ Incorrect CAPTCHA"
                        )
                        .setDescription(
                            `That code is incorrect.\n\n` +
                            `**Attempts Remaining:** ${remaining}`
                        )
                        .setFooter({
                            text: "Axiora Security"
                        })
                        .setTimestamp()
                ]
            });
        }


        // =========================
        // GET SERVER
        // =========================

        const guild =
            client.guilds.cache.get(
                session.guildId
            );

        if (!guild) {

            deleteSession(
                message.author.id
            );

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle(
                            "❌ Verification Error"
                        )
                        .setDescription(
                            "The server could not be found."
                        )
                        .setFooter({
                            text: "Axiora Security"
                        })
                        .setTimestamp()
                ]
            });
        }


        // =========================
        // FETCH MEMBER
        // =========================

        let member;

        try {

            member =
                await guild.members.fetch(
                    message.author.id
                );

        } catch (error) {

            console.error(
                "Failed to fetch member:",
                error
            );

            deleteSession(
                message.author.id
            );

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle(
                            "❌ Verification Error"
                        )
                        .setDescription(
                            "You are no longer a member of the server."
                        )
                        .setFooter({
                            text: "Axiora Security"
                        })
                        .setTimestamp()
                ]
            });
        }


        // =========================
        // GET CONFIG
        // =========================

        const config =
            getConfig(guild.id);

        if (
            !config ||
            !config.role
        ) {

            deleteSession(
                message.author.id
            );

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle(
                            "❌ Verification Error"
                        )
                        .setDescription(
                            "The verification role has not been configured."
                        )
                        .setFooter({
                            text: "Axiora Security"
                        })
                        .setTimestamp()
                ]
            });
        }


        // =========================
        // ALREADY VERIFIED
        // =========================

        if (
            member.roles.cache.has(
                config.role
            )
        ) {

            deleteSession(
                message.author.id
            );

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle(
                            "✅ Already Verified"
                        )
                        .setDescription(
                            `You already have the verification role in **${guild.name}**.`
                        )
                        .setFooter({
                            text: "Axiora Security"
                        })
                        .setTimestamp()
                ]
            });
        }


        // =========================
        // ADD ROLE
        // =========================

        try {

            await member.roles.add(
                config.role
            );

        } catch (error) {

            console.error(
                "Failed to add verification role:",
                error
            );

            deleteSession(
                message.author.id
            );

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle(
                            "❌ Verification Error"
                        )
                        .setDescription(
                            "I couldn't give you the verification role.\n\n" +
                            "Please contact a server administrator."
                        )
                        .setFooter({
                            text: "Axiora Security"
                        })
                        .setTimestamp()
                ]
            });
        }


        // =========================
        // DELETE SESSION
        // =========================

        deleteSession(
            message.author.id
        );


        // =========================
        // SUCCESS MESSAGE
        // =========================

        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle(
                        "✅ Verification Successful"
                    )
                    .setDescription(
                        `Welcome to **${guild.name}**!\n\n` +
                        "You have been successfully verified and now have access to the server."
                    )
                    .setFooter({
                        text: "Axiora Security"
                    })
                    .setTimestamp()
            ]
        });


        // =========================
        // VERIFICATION LOG
        // =========================

        if (
            config.logChannel
        ) {

            const channel =
                guild.channels.cache.get(
                    config.logChannel
                );

            if (
                channel
            ) {

                await channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle(
                                "✅ Member Verified"
                            )
                            .setThumbnail(
                                member.displayAvatarURL({
                                    dynamic: true
                                })
                            )
                            .addFields(
                                {
                                    name: "👤 Member",
                                    value: `${member.user}`,
                                    inline: true
                                },
                                {
                                    name: "🏷️ Username",
                                    value: member.user.tag,
                                    inline: true
                                },
                                {
                                    name: "🆔 User ID",
                                    value: member.id,
                                    inline: false
                                },
                                {
                                    name: "📅 Verified",
                                    value:
                                        `<t:${Math.floor(
                                            Date.now() / 1000
                                        )}:F>`,
                                    inline: false
                                }
                            )
                            .setFooter({
                                text: "Axiora Security"
                            })
                            .setTimestamp()
                    ]
                });
            }
        }
    }
};
