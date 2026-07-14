const { Events } = require("discord.js");
const { sendGoodbye } = require("../utils/goodbye");

module.exports = {
    name: Events.GuildMemberRemove,

    async execute(member) {
        await sendGoodbye(member);
    }
};
