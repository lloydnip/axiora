const { EmbedBuilder } = require("discord.js");
const { loadJSON } = require("./database");

async function sendWelcome(member) {

    const db = loadJSON("config.json");

    const channelId = db[member.guild.id]?.welcomeChannel;

    if (!channelId) return;

    const channel = member.guild.channels.cache.get(channelId);

    if (!channel) return;

        const embed = new EmbedBuilder()
            .setColor("#953beb")
            .setAuthor({
                name: member.user.username,
                iconURL: member.user.displayAvatarURL()
            })
            .setThumbnail(
                member.user.displayAvatarURL()
            )
            .setDescription(
                `Hey <@${member.user.id}>, welcome to **${member.guild.name}**! \n \n - Axiora is still in development, so please be patient as we continue to improve the bot. \n \n - If you have any questions or need assistance, feel free to reach out to our support team.`
            )
            .setImage(`https://cdn.discordapp.com/attachments/1524325027611279395/1526590905220468856/Design_1.png?ex=6a579412&is=6a564292&hm=f775495ded4739b2c76c5b603284391c4892afc9ac54454d57a3da12ed1c69c0&animated=true`)
            .setFooter({
                text: `Axiora | We now have ${member.guild.memberCount} members.`,
                iconURL: member.guild.iconURL()
            })
            .setTimestamp();

    await channel.send({
        embeds: [embed],
        content: `Hey <@${member.user.id}>!`
    });

}

module.exports = { sendWelcome };
