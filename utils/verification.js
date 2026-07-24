const { loadJSON, saveJSON } = require("./database");

function getConfig(guildId) {
    const db = loadJSON("verification.json");

    if (!db[guildId]) {
        db[guildId] = {
            enabled: false,
            channel: null,
            role: null,
            logChannel: null
        };

        saveJSON("verification.json", db);
    }

    return db[guildId];
}

function saveConfig(guildId, config) {
    const db = loadJSON("verification.json");
    db[guildId] = config;
    saveJSON("verification.json", db);
}

module.exports = {
    getConfig,
    saveConfig
};
