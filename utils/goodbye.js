const { EmbedBuilder } = require("discord.js");
const { loadJSON } = require("./database");

async function sendGoodbye(member) {

    const db = loadJSON("config.json");

    const channelId = db[member.guild.id]?.goodbyeChannel;

    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return;

    const embed = new EmbedBuilder()
        .setColor("#953beb")
        .setTitle("Goodbye!")
        .setThumbnail(member.user.displayAvatarURL())
        .setDescription(
            `<@${member.user.id}> has left the server.`
        )
        .setFooter({
            text: `Axiora | We now have ${member.guild.memberCount} members.`,
            iconURL: member.guild.iconURL()
        })
        .setTimestamp();

    await channel.send({
        embeds: [embed]
    });

}

module.exports = { sendGoodbye };
