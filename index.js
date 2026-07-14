require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping
    ]
});

client.commands = new Collection();
const slashCommands = [];

function loadCommands(dir) {
    const files = fs.readdirSync(dir);

    for (const file of files) {

        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadCommands(filePath);
            continue;
        }

        if (!file.endsWith(".js")) continue;

        try {

            const command = require(filePath);

            if (!command.data || !command.execute) {
                console.warn(`[WARNING] ${filePath} is missing data or execute.`);
                continue;
            }

            client.commands.set(command.data.name, command);
            slashCommands.push(command.data.toJSON());
        } catch (err) {

            console.error(`[ERROR] Failed to load command: ${filePath}`);
            console.error(err);

        }

    }
}

function loadEvents(dir) {

    const files = fs.readdirSync(dir);

    for (const file of files) {

        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadEvents(filePath);
            continue;
        }

        if (!file.endsWith(".js")) continue;

        try {

            const event = require(filePath);

            if (!event.name || !event.execute) {
                console.warn(`[WARNING] ${filePath} is missing name or execute.`);
                continue;
            }

            if (event.once) {
                client.once(event.name, (...args) => event.execute(...args, client));
            } else {
                client.on(event.name, (...args) => event.execute(...args, client));
            }
        } catch (err) {

            console.error(`[ERROR] Failed to load event: ${filePath}`);
            console.error(err);

        }

    }

}

loadCommands(path.join(__dirname, "commands"));
loadEvents(path.join(__dirname, "events"));

async function deployCommands() {

    try {

        console.log(`[/INFO] Registering ${slashCommands.length} command(s)...`);

        const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID,
                process.env.GUILD_ID
            ),
            {
                body: slashCommands
            }
        );

        console.log("[/INFO] Slash commands registered.");

    } catch (err) {

        console.error("[ERROR] Failed to register slash commands.");
        console.error(err);

    }

}

(async () => {

    await deployCommands();
    await client.login(process.env.TOKEN);

})();
