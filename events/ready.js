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
            status: "dnd",
            activities: [
                {
                    name: "Axiora v0.0.3",
                    type: ActivityType.Listening
                }
            ]
        });



        const statuses = [
            {
                name: `${client.guilds.cache.size} Servers`,
                type: ActivityType.Playing
            },
            {
                name: `${client.users.cache.size} Users`,
                type: ActivityType.Watching
            }
        ];


        let i = 0;


        setInterval(() => {

            client.user.setActivity(
                statuses[i].name,
                {
                    type: statuses[i].type
                }
            );
            
            client.user.setStatus("dnd");


            i++;

            if (i >= statuses.length) {
                i = 0;
            }


        }, 10000);

    }
};
