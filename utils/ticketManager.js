const fs = require("fs");
const path = require("path");

const DATA_FOLDER = path.join(
    __dirname,
    "../data/tickets"
);

const TICKET_FILE = path.join(
    DATA_FOLDER,
    "tickets.json"
);

function ensureFile() {

    if (!fs.existsSync(DATA_FOLDER)) {
        fs.mkdirSync(DATA_FOLDER, {
            recursive: true
        });
    }

    if (!fs.existsSync(TICKET_FILE)) {
        fs.writeFileSync(
            TICKET_FILE,
            JSON.stringify({}, null, 4)
        );
    }
}

function loadDB() {

    ensureFile();

    try {

        return JSON.parse(
            fs.readFileSync(
                TICKET_FILE,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "❌ Failed to load ticket database:",
            error
        );

        return {};
    }
}

function saveDB(data) {

    ensureFile();

    fs.writeFileSync(
        TICKET_FILE,
        JSON.stringify(
            data,
            null,
            4
        )
    );
}

function createTicket(
    userId,
    ticketData
) {

    const db = loadDB();

    db[userId] = ticketData;

    saveDB(db);
}

function getTicket(
    userId
) {

    const db = loadDB();

    return db[userId] || null;
}

function updateTicket(
    userId,
    data
) {

    const db = loadDB();

    if (!db[userId]) {
        return false;
    }

    db[userId] = {
        ...db[userId],
        ...data
    };

    saveDB(db);

    return true;
}

function deleteTicket(
    userId
) {

    const db = loadDB();

    if (!db[userId]) {
        return false;
    }

    delete db[userId];

    saveDB(db);

    return true;
}

function getTicketByChannel(channelId) {

    const db = loadDB();

    return Object.entries(db).find(
        ([userId, ticket]) =>
            ticket.channelId === channelId
    ) || null;
}

module.exports = {
    loadDB,
    saveDB,
    createTicket,
    getTicket,
    updateTicket,
    deleteTicket,
    getTicketByChannel
};
