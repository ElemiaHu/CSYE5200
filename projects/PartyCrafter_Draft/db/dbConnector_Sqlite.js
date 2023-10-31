const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function connect() {
    return open({
        filename: "./db/PartyCrafter.db",
        driver: sqlite3.Database,
    });
}

async function checkUsername(username) {
    const db = await connect();
    const data = await db.get(`SELECT user_id FROM Users WHERE username = '${username}'`);

    console.log(data);
}

async function getEventData(username) {
    const db = await connect();
    const { user_id } = await db.get(`SELECT user_id FROM Users WHERE username = '${username}'`);
    const eventData = await db.all(`
        SELECT Events.event_id, Events.name, Events.location, Events.date_time, Events.budget, Events.type
        FROM Events
        JOIN Hosts USING(event_id)
        WHERE user_id = ${user_id}
        ORDER BY Events.event_id
    `);
    await db.close();

    return eventData;
}

async function addEvent(name, description, date_time, location, budget, type, username) {
    const db = await connect();
    const addStatement = await db.prepare(`
        INSERT INTO Events (is_active, name, event_description, date_time, location, budget, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    await addStatement.run(1,name, description,date_time,location,budget,type);
    await addStatement.finalize();

    const { event_id } = await db.get('SELECT event_id FROM Events ORDER BY event_id DESC LIMIT 1');
    const { user_id } = await db.get(`SELECT user_id FROM Users WHERE username = '${username}'`);
    const addHosts = await db.prepare(`
        INSERT INTO Hosts VALUES (?,?)
    `);
    await addHosts.run(event_id, user_id);
    await addHosts.finalize();

    await db.close();
}

async function updateEventBudget(eventId, newBudget) {
    const db = await connect();

    const updateStatement = await db.prepare(`
        UPDATE Events SET budget = ?
        WHERE event_id = ?
    `);

    await updateStatement.run(newBudget, eventId);
    await updateStatement.finalize();

    await db.close();
}

async function deleteEvent(event_id) {
    const db = await connect();

    await db.run(`DELETE FROM Events WHERE event_id= ${event_id}`);
    await db.close();
}

module.exports = {
    checkUsername,
    getEventData,
    addEvent,
    updateEventBudget,
    deleteEvent,
}