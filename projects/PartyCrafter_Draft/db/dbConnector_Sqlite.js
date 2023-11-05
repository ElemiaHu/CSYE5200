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

    await db.close();

    return data ? data.user_id : -1;
}

async function newUser(username) {
    const db = await connect();
    const newUserStatement = await db.prepare(`
        INSERT INTO Users (username)
        VALUES (?)
    `);
    const data = await newUserStatement.run(username);
    await newUserStatement.finalize();

    await db.close();
    return data.lastID;
}

async function getEventData(userId) {
    const db = await connect();
    const eventData = await db.all(`
        SELECT Events.event_id, Events.name, Events.location, Events.date_time, Events.budget, Events.type
        FROM Events
        JOIN Hosts USING(event_id)
        WHERE user_id = ${userId}
        ORDER BY Events.event_id
    `);
    await db.close();

    return eventData;
}

async function addEvent(name, description, date_time, location, budget, type, userId) {
    const db = await connect();
    const addStatement = await db.prepare(`
        INSERT INTO Events (is_active, name, event_description, date_time, location, budget, type)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    const { lastID } = await addStatement.run(1,name, description,date_time,location,budget,type);
    await addStatement.finalize();

    const addHosts = await db.prepare(`
        INSERT INTO Hosts VALUES (?,?)
    `);
    await addHosts.run(lastID, userId);
    await addHosts.finalize();

    await db.close();

    return lastID;
}

async function getEventDataByEventId(eventId) {
    const db = await connect();
    const eventData = await db.all(`
        SELECT name, event_description, location, date_time, budget, type
        FROM Events
        WHERE event_id = ${eventId};
    `);
    await db.close();

    return eventData;
}

async function getEventGuests(event_id) {
    const db = await connect();
    const guestData = await db.all(`
        SELECT Guests.name, Guests.contact, EventGuests.RSVP_status
        FROM EventGuests
        JOIN Guests USING(guest_id)
        WHERE EventGuests.event_id = ${event_id};
    `);
    await db.close();

    return guestData;
}

async function getEventTodo(event_id) {
    const db = await connect();
    const todoData = await db.all(`
        SELECT item_description, deadline, priority_levels
        FROM TodoItems
        WHERE event_id = ${event_id};
    `);
    await db.close();

    return todoData;
}

async function getEventExpense(event_id) {
    const db = await connect();
    const expenseData = await db.all(`
        SELECT amount_spent, date_spent, expense_description
        FROM Expenses
        WHERE event_id = ${event_id};
    `);
    await db.close();

    return expenseData;
}

async function addNewGuest(eventId, name, contact) {
    const db = await connect();

    // Insert the guest into the Guests table
    const addGuest = await db.prepare(`
        INSERT INTO Guests (name, contact) 
        VALUES (?, ?);
    `);
    const { lastID } = await addGuest.run(name, contact);
    await addGuest.finalize();

    // Insert the guest into the EventGuests table
    const addEventGuest = await db.prepare(`
        INSERT INTO EventGuests (guest_id, event_id, RSVP_status)
        VALUES (?, ?, 'Invited');
    `);
    await addEventGuest.run(lastID, eventId);
    await addEventGuest.finalize();

    await db.close();

    return lastID;
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
    newUser,
    getEventData,
    addEvent,
    getEventDataByEventId,
    getEventGuests,
    getEventTodo,
    getEventExpense,
    updateEventBudget,
    addNewGuest,
    deleteEvent,
}