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

        if (
            !file.endsWith(".js") ||
            file === "index.js"
        ) continue;

        const button = require(filePath);

        if (!button.customId || !button.execute) {
            console.log(`[WARNING] Invalid button: ${file}`);
            continue;
        }

        buttons.set(button.customId, button);

        console.log(`[BUTTON] ${button.customId}`);

    }

}

loadButtons();

module.exports = buttons;