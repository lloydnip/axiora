const {
    ChannelType,
    PermissionOverwrites
} = require("discord.js");

async function restoreChannel(channel) {

    try {

        const guild = channel.guild;

        const newChannel =
            await guild.channels.create({

                name: channel.name,

                type: channel.type,

                topic: channel.topic,

                nsfw: channel.nsfw,

                bitrate: channel.bitrate,

                userLimit: channel.userLimit,

                rateLimitPerUser:
                    channel.rateLimitPerUser,

                parent: channel.parentId,

                position: channel.position,

                permissionOverwrites:
                    channel.permissionOverwrites.cache.map(
                        overwrite => ({

                            id: overwrite.id,

                            allow:
                                overwrite.allow.bitfield,

                            deny:
                                overwrite.deny.bitfield

                        })
                    )

            });

        return newChannel;

    } catch (err) {

        console.error(
            "[Recovery] Failed to restore channel:",
            err
        );

        return null;

    }

}

module.exports = {
    restoreChannel
};
