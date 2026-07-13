const { loadJSON } = require("./database");

async function logModeration(guild, embed) {

    const config = loadJSON("config.json");

    const channelId = config[guild.id]?.modLogChannel;

    if (!channelId) return;

    const channel = guild.channels.cache.get(channelId);

    if (!channel) return;

    channel.send({
        embeds: [embed]
    }).catch(() => {});
}

module.exports = {
    logModeration
};