const {
    Events,
    AuditLogEvent,
    EmbedBuilder
} = require("discord.js");

const {
    getConfig,
    exceeded,
    isWhitelisted
} = require("../../utils/antinuke");

const {
    punish
} = require("../../utils/punish");

const {
    logAntiNuke
} = require("../../utils/antinukeLogger");

const {
    restoreChannel
} = require("../../utils/recovery");

module.exports = {

    name: Events.ChannelDelete,

    async execute(channel) {

        const guild = channel.guild;

        const config = getConfig(guild.id);

        if (!config.enabled) return;

        try {

            const logs = await guild.fetchAuditLogs({

                type: AuditLogEvent.ChannelDelete,
                limit: 1

            });

            const entry = logs.entries.first();

            if (!entry) return;

            // Ignore old audit log entries
            if (Date.now() - entry.createdTimestamp > 5000)
                return;

            const executor = entry.executor;

            if (!executor) return;

            if (executor.id === guild.ownerId)
                return;

            if (executor.id === guild.client.user.id)
                return;

            if (isWhitelisted(guild.id, executor.id))
                return;

            const result = exceeded(
                guild.id,
                executor.id,
                "channelDelete"
            );

            if (!result.exceeded)
                return;

            const member =
                await guild.members.fetch(executor.id);

            await punish(

                member,

                config.punishment,

                "Anti-Nuke | Mass Channel Deletion"

            );

            const restored =
    await restoreChannel(channel);

            await logAntiNuke({

    guild,

    user: executor,

    action: "Mass Channel Delete",

    punishment: config.punishment,

    count: result.count,

    recovered: restored != null

});

            // Send log

            const logChannel = guild.channels.cache.get(config.logChannel);

            if (logChannel) {

                const embed = new EmbedBuilder()

                    .setColor("Red")

                    .setTitle("🛡 Anti-Nuke Triggered")

                    .setDescription(
                        `${executor} exceeded the **Channel Delete Limit**.`
                    )

                    .addFields(

                        {
                            name: "User",
                            value: executor.tag,
                            inline: true
                        },

                        {
                            name: "Action",
                            value: "Channel Delete",
                            inline: true
                        },

                        {
                            name: "Count",
                            value: `${result.count}/${result.limit}`,
                            inline: true
                        },

                        {
                            name: "Punishment",
                            value: config.punishment,
                            inline: true
                        }

                    )

                    .setTimestamp();

                await logChannel.send({

                    embeds: [embed]

                });

            }

        } catch (err) {

            console.error(err);

        }

    }

};