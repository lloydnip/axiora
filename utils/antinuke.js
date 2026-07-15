const {
    loadJSON,
    saveJSON
} = require("./database");

const counters = new Map();

/**
 * Get Anti-Nuke config
 */
function getConfig(guildId) {

    const db = loadJSON("antinuke.json");

    return db[guildId] || {
        enabled: false,
        punishment: "ban",
        limits: {},
        whitelist: []
    };

}

/**
 * Is user whitelisted?
 */
function isWhitelisted(guildId, userId) {

    const config = getConfig(guildId);

    return config.whitelist.includes(userId);

}

/**
 * Increase user's action counter
 */
function increase(guildId, userId, action) {

    const key = `${guildId}-${userId}`;

    if (!counters.has(key)) {

        counters.set(key, {

            channelDelete: 0,
            channelCreate: 0,

            roleDelete: 0,
            roleCreate: 0,

            webhook: 0,

            ban: 0,

            resetAt: Date.now() + 10000

        });

    }

    const data = counters.get(key);

    // Reset after 10 seconds

    if (Date.now() >= data.resetAt) {

        data.channelDelete = 0;
        data.channelCreate = 0;

        data.roleDelete = 0;
        data.roleCreate = 0;

        data.webhook = 0;
        data.ban = 0;

        data.resetAt = Date.now() + 10000;

    }

    if (!(action in data))
        data[action] = 0;

    data[action]++;

    return data[action];

}

/**
 * Check if limit reached
 */
function exceeded(guildId, userId, action) {

    const config = getConfig(guildId);

    const amount =
        increase(guildId, userId, action);

    const limit =
        config.limits[action];

    return {

        exceeded:
            amount >= limit,

        count: amount,

        limit

    };

}

/**
 * Add whitelist
 */
function addWhitelist(guildId, userId) {

    const db = loadJSON("antinuke.json");

    if (!db[guildId])
        return;

    if (!db[guildId].whitelist.includes(userId)) {

        db[guildId].whitelist.push(userId);

        saveJSON("antinuke.json", db);

    }

}

/**
 * Remove whitelist
 */
function removeWhitelist(guildId, userId) {

    const db = loadJSON("antinuke.json");

    if (!db[guildId])
        return;

    db[guildId].whitelist =
        db[guildId].whitelist.filter(
            id => id !== userId
        );

    saveJSON("antinuke.json", db);

}

module.exports = {

    getConfig,

    isWhitelisted,

    exceeded,

    addWhitelist,

    removeWhitelist

};
