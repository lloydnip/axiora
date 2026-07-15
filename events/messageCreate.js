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

        // Ignore bots
        if (message.author.bot) return;

        // Only accept DMs
        if (message.guild) return;

        const session = getSession(message.author.id);

        if (!session) return;

        const answer = message.content.trim().toUpperCase();

        if (answer !== session.captcha) {

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
                                "You entered the wrong CAPTCHA **3 times**.\n\nPlease return to the server and click **Verify** again."
                            )

                    ]

                });

            }

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Orange")

                        .setTitle("❌ Incorrect CAPTCHA")

                        .setDescription(
                            `That wasn't the correct CAPTCHA.\n\n**Attempts Remaining:** ${remaining}`
                        )

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

        // Already verified

        if (member.roles.cache.has(config.role)) {

            deleteSession(message.author.id);

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Green")

                        .setTitle("✅ Already Verified")

                        .setDescription(
                            "You are already verified."
                        )

                ]

            });

        }


        try {

            await member.roles.add(config.role);

        } catch {

            return message.reply({

                embeds: [

                    new EmbedBuilder()

                        .setColor("Red")

                        .setTitle("❌ Verification Error")

                        .setDescription(
                            "I couldn't give you the verified role.\nPlease contact a server administrator."
                        )

                ]

            });

        }

        deleteSession(message.author.id);

        await message.reply({

            embeds: [

                new EmbedBuilder()

                    .setColor("Green")

                    .setTitle("✅ Verification Successful")

                    .setDescription(
                        `Welcome to **${guild.name}**!\n\nYou now have access to the server.`
                    )

            ]

        });

        if (config.logChannel) {

            const channel = guild.channels.cache.get(config.logChannel);

            if (channel) {

                const embed = new EmbedBuilder()

                    .setColor("Green")

                    .setTitle("✅ Member Verified")

                    .addFields(

                        {
                            name: "Member",
                            value: `${member.user.tag}`,
                            inline: true
                        },

                        {
                            name: "User ID",
                            value: member.id,
                            inline: true
                        },

                        {
                            name: "Verified At",
                            value: `<t:${Math.floor(Date.now() / 1000)}:F>`
                        }

                    )

                    .setThumbnail(member.displayAvatarURL());

                channel.send({

                    embeds: [embed]

                });

            }

        }

    }

};
