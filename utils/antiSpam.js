const spamMap = new Map();
const actionCooldown = new Map();

const {
    loadJSON,
    saveJSON
} = require("./database");


const DEFAULT_CONFIG = {
    enabled: false,
    maxMessages: 5,
    interval: 5,
    punishment: "timeout",
    timeoutDuration: 60000,
    deleteMessages: true,
    logChannel: null,

    ignoredChannels: [],
    ignoredUsers: []
};

/**
 * Get AntiSpam configuration
 */
function getAntiSpamConfig(guildId) {

    const db =
        loadJSON("antispam.json");

    if (!db[guildId]) {

        db[guildId] = {};
    }

    if (!db[guildId].antispam) {

        db[guildId].antispam = {
            ...DEFAULT_CONFIG
        };

        saveJSON(
            "antispam.json",
            db
        );
    }

    return {
        ...DEFAULT_CONFIG,
        ...db[guildId].antispam
    };
}


/**
 * Check if a user is spamming
 */
function checkSpam(message) {

    if (
        !message.guild ||
        message.author.bot
    ) {
        return {
            spam: false
        };
    }


    const config =
        getAntiSpamConfig(
            message.guild.id
        );


    if (
        !config.enabled
    ) {
        return {
            spam: false
        };
    }

    // Ignore configured channel
if (
    config.ignoredChannels.includes(
        message.channel.id
    )
) {
    return {
        spam: false
    };
}


// Ignore configured user
if (
    config.ignoredUsers.includes(
        message.author.id
    )
) {
    return {
        spam: false
    };
}

    const userId =
        message.author.id;

    const guildId =
        message.guild.id;

    const key =
        `${guildId}-${userId}`;


    const now =
        Date.now();


    // Convert seconds to milliseconds
    const intervalMs =
        config.interval * 1000;


    // Prevent repeated punishments
    const cooldown =
        actionCooldown.get(key);


    if (
        cooldown &&
        now - cooldown < intervalMs
    ) {
        return {
            spam: false
        };
    }


    if (
        !spamMap.has(key)
    ) {

        spamMap.set(
            key,
            []
        );
    }


    const messages =
        spamMap.get(key);


    const recentMessages =
        messages.filter(
            timestamp =>
                now - timestamp <
                intervalMs
        );


    recentMessages.push(
        now
    );


    spamMap.set(
        key,
        recentMessages
    );


    if (
        recentMessages.length >=
        config.maxMessages
    ) {

        actionCooldown.set(
            key,
            now
        );


        return {
            spam: true,
            reason: "Rapid messaging",
            config
        };
    }


    return {
        spam: false
    };
}


/**
 * Clear user's spam data
 */
function clearUser(
    guildId,
    userId
) {

    const key =
        `${guildId}-${userId}`;


    spamMap.delete(
        key
    );


    actionCooldown.delete(
        key
    );
}


/**
 * Update AntiSpam settings
 */
function updateAntiSpamConfig(
    guildId,
    settings
) {

    const db =
        loadJSON(
            "antispam.json"
        );


    if (
        !db[guildId]
    ) {

        db[guildId] = {};
    }


    db[guildId].antispam = {

        ...DEFAULT_CONFIG,

        ...(db[guildId].antispam || {}),

        ...settings
    };


    saveJSON(
        "antispam.json",
        db
    );


    return db[
        guildId
    ].antispam;
}


module.exports = {
    checkSpam,
    clearUser,
    getAntiSpamConfig,
    updateAntiSpamConfig,
    DEFAULT_CONFIG
};
