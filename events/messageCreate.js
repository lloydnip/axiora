const { Events, EmbedBuilder } = require("discord.js");

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
        if (message.author.bot) return;

        if (message.guild) return;

        const session = getSession(message.author.id);

        if (!session) return;

        const input = message.content.trim().toUpperCase();

        const expected = String(session.captcha)
            .trim()
            .toUpperCase();

        if (input !== expected) {

            session.attempts++;

            const remaining = 3 - session.attempts;

            if (remaining <= 0) {

                deleteSession(message.author.id);

                return message.reply({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Red")
                            .setTitle("❌ Verification Failed")
                            .setDescription(
                                "You entered an incorrect CAPTCHA **3 times**.\n\nReturn to the server and press **Verify** to start again."
                            )
                    .setFooter({
                        text: "Axiora Security",
                        iconURL: guild.iconURL()
                    })
                    .setTimestamp()
                    ]
                });

            }

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Orange")
                        .setTitle("⚠ Incorrect CAPTCHA")
                        .setDescription(
                            `That code is incorrect.\n**Attempts Remaining:** ${remaining}`
                        )
                    .setFooter({
                        text: "Axiora Security",
                        iconURL: guild.iconURL()
                    })
                    .setTimestamp()
                ]
            });

        }

        const guild = client.guilds.cache.get(session.guildId);

        if (!guild) {

            deleteSession(message.author.id);
            return;

        }

        let member;

        try {

            member = await guild.members.fetch(message.author.id);

        } catch {

            deleteSession(message.author.id);
            return;

        }

        const config = getConfig(guild.id);

        if (!config || !config.role) {

            deleteSession(message.author.id);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Verification Error")
                        .setDescription(
                            "The verification role has not been configured."
                        )
                    .setFooter({
                        text: "Axiora Security",
                        iconURL: guild.iconURL()
                    })
                    .setTimestamp()
                ]
            });

        }

        if (member.roles.cache.has(config.role)) {

            deleteSession(message.author.id);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Green")
                        .setTitle("You are already verified!")
                        .setDescription(
                            `You already have the verification role in **${guild.name}**.`
                        )
                    .setFooter({
                        text: "Axiora Security",
                        iconURL: guild.iconURL()
                    })
                    .setTimestamp()
                ]
            });

        }

        try {

            await member.roles.add(config.role);

        } catch (err) {

            console.error(err);

            deleteSession(message.author.id);

            return message.reply({
                embeds: [
                    new EmbedBuilder()
                        .setColor("Red")
                        .setTitle("❌ Verification Error")
                        .setDescription(
                            "I couldn't give you the verification role.\nPlease contact a server administrator."
                        )
                    .setFooter({
                        text: "Axiora Security",
                        iconURL: guild.iconURL()
                    })
                    .setTimestamp()
                ]
            });

        }

        deleteSession(message.author.id);

        await message.reply({
            embeds: [
                new EmbedBuilder()
                    .setColor("Green")
                    .setTitle("You have successfully verified!")
                    .setDescription(
                        `Welcome to **${guild.name}**!\n\nYou have been successfully verified and now have access to the server.`
                    )
                    .setFooter({
                        text: "Axiora Security",
                        iconURL: guild.iconURL()
                    })
                    .setTimestamp()
            ]
        });

        if (config.logChannel) {

            const channel = guild.channels.cache.get(config.logChannel);

            if (channel) {

                channel.send({
                    embeds: [
                        new EmbedBuilder()
                            .setColor("Green")
                            .setTitle("Member Verified")
                            .setThumbnail(member.displayAvatarURL())
                            .addFields(
                                {
                                    name: "Member",
                                    value: `${member.user}`,
                                    inline: true
                                },
                                {
                                    name: "Username",
                                    value: member.user.tag,
                                    inline: true
                                },
                                {
                                    name: "User ID",
                                    value: member.id
                                },
                                {
                                    name: "Verified",
                                    value: `<t:${Math.floor(Date.now() / 1000)}:F>`
                                }
                            )
                    .setFooter({
                        text: "Axiora Security",
                        iconURL: guild.iconURL()
                    })
                    .setTimestamp()
                            .setTimestamp()
                    ]
                });

            }

        }

    }

};
