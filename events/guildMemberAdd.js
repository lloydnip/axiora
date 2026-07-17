const { Events } = require("discord.js");
const embedManager = require("../utils/embedManager");
const buildWelcomeEmbed = require("../utils/welcomeEmbed");

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {

        const config = embedManager.load("welcome");

        if (!config.channel) return;

        const channel = member.guild.channels.cache.get(config.channel);

        if (!channel) return;

        const message = buildWelcomeEmbed(member);

        await channel.send(message);

    }
};
