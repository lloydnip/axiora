const sessions = new Map();

function createSession(userId, data) {
    sessions.set(userId, data);
}

function getSession(userId) {
    const session = sessions.get(userId);

    if (!session) {
        return null;
    } if (
        session.expiresAt &&
        Date.now() > session.expiresAt
    ) {
        sessions.delete(userId);
        return null;
    }
    return session;
}

function deleteSession(userId) {
    sessions.delete(userId);
}

module.exports = {
    createSession,
    getSession,
    deleteSession
};
