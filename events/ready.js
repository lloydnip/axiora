const {
    Events,
    ActivityType
} = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client) {

        console.log(`[INFO]: ${client.user.tag} is online!`);

        client.user.setPresence({
            status: "dnd", // online, idle, dnd, invisible
            activities: [
                {
                    name: "Patch Updates: v0.0.2",
                    type: ActivityType.Watching
                }
            ]
        });

    }
};

/*
const {
    Events,
    ActivityType
} = require("discord.js");

module.exports = {
    name: Events.ClientReady,
    once: true,

    async execute(client) {

        console.log(`[INFO]: ${client.user.tag} is online!`);

        const statuses = [
            {
                name: "/help",
                type: ActivityType.Watching
            },
            {
                name: `${client.guilds.cache.size} Servers`,
                type: ActivityType.Playing
            },
            {
                name: `${client.users.cache.size} Users`,
                type: ActivityType.Watching
            },
            {
                name: "Axiora v0.0.1",
                type: ActivityType.Listening
            }
        ];

        let i = 0;

        setInterval(() => {

            client.user.setActivity(
                statuses[i].name,
                { type: statuses[i].type }
            );

            i++;
            if (i >= statuses.length) i = 0;

        }, 10000);

    }
};
*/
