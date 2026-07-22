const fs = require("fs");
const path = require("path");

const DATA_FOLDER = path.join(
    __dirname,
    "../data/tickets"
);

const CONFIG_FILE = path.join(
    DATA_FOLDER,
    "configs.json"
);

const DEFAULT_CONFIG = {
    supportRoleId: null,
    ticketCategoryId: null,
    transcriptChannelId: null,
    panelChannelId: null,

    categories: {
        general: {
            name: "General Support",
            emoji: "🛠️",
            description: "General questions and assistance"
        },

        report: {
            name: "Report a User",
            emoji: "🚨",
            description: "Report a member or user"
        },

        technical: {
            name: "Technical Support",
            emoji: "💻",
            description: "Technical issues and bugs"
        },

        partnership: {
            name: "Partnership",
            emoji: "🤝",
            description: "Business and partnership requests"
        }
    }
};

function ensureFile() {
    if (!fs.existsSync(DATA_FOLDER)) {
        fs.mkdirSync(DATA_FOLDER, {
            recursive: true
        });
    }

    if (!fs.existsSync(CONFIG_FILE)) {
        fs.writeFileSync(
            CONFIG_FILE,
            JSON.stringify({}, null, 4)
        );
    }
}

function loadAll() {
    ensureFile();

    return JSON.parse(
        fs.readFileSync(
            CONFIG_FILE,
            "utf8"
        )
    );
}

function saveAll(data) {
    ensureFile();

    fs.writeFileSync(
        CONFIG_FILE,
        JSON.stringify(data, null, 4)
    );
}

function get(guildId) {
    const configs = loadAll();

    if (!configs[guildId]) {
        configs[guildId] =
            structuredClone(DEFAULT_CONFIG);

        saveAll(configs);
    }

    return configs[guildId];
}

function update(guildId, key, value) {
    const configs = loadAll();

    if (!configs[guildId]) {
        configs[guildId] =
            structuredClone(DEFAULT_CONFIG);
    }

    configs[guildId][key] = value;

    saveAll(configs);
}

module.exports = {
    get,
    update
};
