const uuid = require('uuid').v4;

const sessions = {};

function addSession(userId, username) {
    const sid = uuid();
    sessions[sid] = {
        userId,
        username,
    };
    return sid;
}

function getSessionUser(sid) {
    return sessions[sid] || '';
}

function deleteSession(sid) {
    delete sessions[sid];
}

module.exports = {
    addSession,
    getSessionUser,
    deleteSession,
}