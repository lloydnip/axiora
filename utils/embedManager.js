const fs = require("fs");
const path = require("path");

const EMBED_FOLDER = path.join(__dirname, "../data/embeds");

const DEFAULT_CONFIG = {
    channel: null,

    author: {
        text: "",
        icon: ""
    },

    title: "",
    description: "",
    color: "#5865F2",

    thumbnail: "",
    image: "",

    footer: {
        text: "",
        icon: ""
    },

    timestamp: true
};

function ensureFolder() {
    if (!fs.existsSync(EMBED_FOLDER)) {
        fs.mkdirSync(EMBED_FOLDER, { recursive: true });
    }
}

function ensureFile(type) {
    ensureFolder();

    const file = path.join(EMBED_FOLDER, `${type}.json`);

    if (!fs.existsSync(file)) {
        fs.writeFileSync(
            file,
            JSON.stringify(DEFAULT_CONFIG, null, 4)
        );
    }

    return file;
}

function load(type) {
    const file = ensureFile(type);

    return JSON.parse(fs.readFileSync(file, "utf8"));
}

function save(type, data) {
    const file = ensureFile(type);

    fs.writeFileSync(
        file,
        JSON.stringify(data, null, 4)
    );
}


function reset(type) {
    save(type, structuredClone(DEFAULT_CONFIG));
}


function update(type, key, value) {
    const data = load(type);

    data[key] = value;

    save(type, data);
}

function updateNested(type, section, key, value) {
    const data = load(type);

    if (!data[section]) data[section] = {};

    data[section][key] = value;

    save(type, data);
}

module.exports = {
    load,
    save,
    reset,
    update,
    updateNested
};
