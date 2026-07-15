const {
    EmbedBuilder
} = require("discord.js");

const {
    getConfig
} = require("./antinuke");

async function logAntiNuke({

    guild,
    user,
    action,
    punishment,
    count

}) {

    const config = getConfig(guild.id);

    if (!config.logChannel)
        return;

    const channel =
        guild.channels.cache.get(config.logChannel);

    if (!channel)
        return;

    const embed = new EmbedBuilder()

        .setColor("#ED4245")

        .setAuthor({
            name: "Axiora Anti-Nuke"
        })

        .setTitle("🛡 Security Triggered")

        .addFields(

            {
                name: "User",
                value: `${user.tag}\n${user.id}`,
                inline: true
            },

            {
                name: "Action",
                value: action,
                inline: true
            },

            {
                name: "Punishment",
                value: punishment,
                inline: true
            },

            {
                name: "Triggered Count",
                value: `${count}`,
                inline: true
            },

            {
                name: "Time",
                value: `<t:${Math.floor(Date.now()/1000)}:F>`
            }

        )

        .setThumbnail(user.displayAvatarURL())

        .setTimestamp();

    await channel.send({
        embeds: [embed]
    });

}

module.exports = {
    logAntiNuke
};
