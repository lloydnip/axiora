const { Events } = require("discord.js");
const embedManager = require("../utils/embedManager");
const buildWelcomeEmbed = require("../utils/welcomeEmbed");

module.exports = {
    name: Events.GuildMemberAdd,

    async execute(member) {

        const config = embedManager.load("welcome");

        // Welcome message
        if (config.channel) {

            const channel = member.guild.channels.cache.get(
                config.channel
            );

            if (channel) {
                const message = buildWelcomeEmbed(member);

                await channel.send(message);
            }
        }

        // Autorole
        if (config.autorole) {

            const role = member.guild.roles.cache.get(
                config.autorole
            );

            if (!role) {
                console.log(
                    `⚠️ Autorole not found in ${member.guild.name}`
                );

                return;
            }

            try {

                await member.roles.add(role);

            } catch (error) {
            }
        }
    }
};
