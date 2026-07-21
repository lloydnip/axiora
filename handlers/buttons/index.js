const fs = require("fs");
const path = require("path");
const { Collection } = require("discord.js");

module.exports = function loadButtons(client) {
    client.buttons = new Collection();

    const buttonsPath = __dirname;

    function loadDirectory(directory) {
        const files = fs.readdirSync(directory);

        for (const file of files) {
            const filePath = path.join(directory, file);
            const stat = fs.statSync(filePath);

            if (stat.isDirectory()) {
                loadDirectory(filePath);
                continue;
            }

            if (!file.endsWith(".js") || file === "index.js") {
                continue;
            }

            const button = require(filePath);

            if (!button.customId || !button.execute) {
                console.log(
                    `⚠️ Invalid button file: ${file}`
                );
                continue;
            }

            client.buttons.set(
                button.customId,
                button
            );s
        }
    }

    loadDirectory(buttonsPath);

    return client.buttons;
};
