const fs = require("fs");
const path = require("path");

function loadJSON(fileName, defaultData = {}) {
    const dataFolder = path.join(__dirname, "../data");

    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    const filePath = path.join(dataFolder, fileName);

    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(
            filePath,
            JSON.stringify(defaultData, null, 4)
        );
    }

    try {
        return JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch {
        fs.writeFileSync(
            filePath,
            JSON.stringify(defaultData, null, 4)
        );
        return defaultData;
    }
}

function saveJSON(fileName, data) {
    const dataFolder = path.join(__dirname, "../data");

    if (!fs.existsSync(dataFolder)) {
        fs.mkdirSync(dataFolder, { recursive: true });
    }

    const filePath = path.join(dataFolder, fileName);

    fs.writeFileSync(
        filePath,
        JSON.stringify(data, null, 4)
    );
}

module.exports = {
    loadJSON,
    saveJSON
};