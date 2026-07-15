const sessions = new Map();

function createSession(userId, data) {
    sessions.set(userId, data);
}

function getSession(userId) {
    return sessions.get(userId);
}

function hasSession(userId) {
    return sessions.has(userId);
}

function deleteSession(userId) {
    sessions.delete(userId);
}

module.exports = {
    createSession,
    getSession,
    hasSession,
    deleteSession
};
