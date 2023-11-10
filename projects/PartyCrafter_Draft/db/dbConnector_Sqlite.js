const sqlite3 = require("sqlite3").verbose();
const { open } = require("sqlite");

async function connect() {
    return open({
        filename: "./db/PartyCrafter.db",
        driver: sqlite3.Database,
    });
}

// User Info
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

// Events
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

async function deleteEvent(event_id) {
    const db = await connect();

    await db.run(`DELETE FROM Events WHERE event_id= ${event_id}`);
    await db.close();
}

// Guests
async function getEventGuests(event_id) {
    const db = await connect();
    const guestData = await db.all(`
        SELECT Guests.guest_id, Guests.name, Guests.contact, EventGuests.RSVP_status
        FROM EventGuests
        JOIN Guests USING(guest_id)
        WHERE EventGuests.event_id = ${event_id};
    `);
    await db.close();

    return guestData;
}

async function addNewGuest(eventId, name, contact, status) {
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
        VALUES (?, ?, ?);
    `);
    await addEventGuest.run(lastID, eventId, status);
    await addEventGuest.finalize();

    await db.close();

    return lastID;
}

async function deleteGuest(guestId) {
    const db = await connect();

    await db.run(`DELETE FROM EventGuests WHERE guest_id = ${guestId}`);
    await db.close();
}

async function updateGuest(guestId, eventId, name, contact, RSVP_status) {
    const db = await connect();

    const updateGuestStatement = await db.prepare(`
        UPDATE Guests
        SET name = ?, contact = ?
        WHERE guest_id = ?
    `);
    await updateGuestStatement.run(name, contact, guestId);
    await updateGuestStatement.finalize();

    const updateEventGuest = await db.prepare(`
        UPDATE EventGuests
        SET RSVP_status = ?
        WHERE guest_id = ? AND event_id = ?
    `);
    await updateEventGuest.run(RSVP_status, guestId, eventId);
    await updateEventGuest.finalize();

    await db.close();
}

// To-do items
async function getEventTodo(event_id) {
    const db = await connect();
    const todoData = await db.all(`
        SELECT item_id, item_description, deadline, priority_levels, is_done
        FROM TodoItems
        WHERE event_id = ${event_id}
        ORDER BY priority_levels DESC;
    `);
    await db.close();

    return todoData;
}

async function markDone(itemId) {
    const db = await connect();
    await db.run(`UPDATE TodoItems SET is_done = 1 WHERE item_id = ${itemId};`);
    await db.close();
}

async function addTodo(eventId, description, deadline, priorityLevel) {
    const db = await connect();

    const addTodo = await db.prepare(`
        INSERT INTO TodoItems (event_id, item_description, deadline, priority_levels, is_done)
        VALUES (?, ?, ?, ?, 0);
    `);
    const { lastID } = await addTodo.run(eventId, description, deadline, priorityLevel);
    await addTodo.finalize();

    await db.close();
    return lastID;
}

async function deleteTodo(itemId) {
    const db = await connect();

    await db.run(`DELETE FROM TodoItems WHERE item_id = ${itemId}`);
    await db.close();
}

// Expenses
async function getEventExpense(event_id) {
    const db = await connect();
    const expenseData = await db.all(`
        SELECT expense_id, amount_spent, date_spent, expense_description
        FROM Expenses
        WHERE event_id = ${event_id};
    `);
    await db.close();

    return expenseData;
}

async function addNewExpense(eventId, amount, date, description) {
    const db = await connect();

    const addExpense = await db.prepare(`
        INSERT INTO Expenses (event_id, amount_spent, date_spent, expense_description)
        VALUES (?, ?, ?, ?);
    `);
    const { lastID } = await addExpense.run(eventId, amount, date, description);
    await addExpense.finalize();

    await db.close();
    return lastID;
}

async function deleteExpense(expenseId) {
    const db = await connect();

    await db.run(`DELETE FROM Expenses WHERE expense_id =  ${expenseId}`);
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

module.exports = {
    checkUsername,
    newUser,
    getEventData,
    addEvent,
    getEventDataByEventId,
    getEventGuests,
    deleteGuest,
    updateGuest,
    getEventTodo,
    markDone,
    addTodo,
    deleteTodo,
    getEventExpense,
    addNewExpense,
    deleteExpense,
    updateEventBudget,
    addNewGuest,
    deleteEvent,
}