const fs = require("fs");
const path = require("path");

const buttons = new Map();

function loadButtons(dir = __dirname) {
    const files = fs.readdirSync(dir);

    for (const file of files) {

        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);

        if (stat.isDirectory()) {
            loadButtons(filePath);
            continue;
        }

        if (!file.endsWith(".js") || file === "index.js") continue;

        try {

            const button = require(filePath);

            if (!button.customId || !button.execute) {
                console.log(`[WARNING] Invalid button: ${file}`);
                continue;
            }

            buttons.set(button.customId, button);

        } catch (err) {

            console.error(`[ERROR] Failed to load button: ${filePath}`);
            console.error(err);

        }

    }
}

loadButtons();

module.exports = {
    get(customId) {
        return buttons.get(customId);
    },

    has(customId) {
        return buttons.has(customId);
    },

    values() {
        return buttons.values();
    }
};
