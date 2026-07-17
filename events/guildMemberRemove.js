const { Events } = require("discord.js");
const embedManager = require("../utils/embedManager");
const buildGoodbyeEmbed = require("../utils/goodbyeEmbed");

module.exports = {
    name: Events.GuildMemberRemove,

    async execute(member) {

        const config = embedManager.load("goodbye");

        if (!config.channel) return;

        const channel = member.guild.channels.cache.get(config.channel);

        if (!channel) return;

        const embed = buildGoodbyeEmbed(member);

        await channel.send({
            embeds: [embed]
        });

    }
};
