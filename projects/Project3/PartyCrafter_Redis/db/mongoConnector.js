const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient('mongodb://localhost:27017');
const databaseName = 'PartyCrafter';

// User Info
async function checkUsername(username) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const users = database.collection('Users');

        const user = await users.findOne({ "username": username });

        if (user) return user._id.toString();
        else return -1;

    } finally {
        await client.close();
    }
}

async function newUser(username) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const users = database.collection('Users');

        const result = await users.insertOne({ 
            "username": username,
            "regular_guests": [],
        });

        if (result) return result.insertedId.toString();
        else return -1;

    } finally {
        await client.close();
    }
}

// Events
async function getEventData(userId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.find({ 
            "$or": [
                { "type": "self-owned", "host": new ObjectId(userId)},
                { "type": "cohosted", "cohost": { "$in": [ new ObjectId(userId) ]}},
            ]
        }).toArray();

        return result;

    } finally {
        await client.close();
    }
}

async function addEvent(name, description, date_time, location, budget, type, userId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const eventDoc = {
            "name": name,
            "description": description,
            "date_time": date_time,
            "location": location,
            "budget": budget,
            "type": type
        }

        if (type === "self-owned") {
            eventDoc.host = new ObjectId(userId);
        } else if (type === "cohosted") {
            eventDoc.cohost = [ new ObjectId(userId) ];
        }

        const result = await events.insertOne(eventDoc);
        
        if (result) return result.insertedId.toString();
        else return -1;

    } finally {
        await client.close();
    }
}

async function getEventDataByEventId(eventId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.findOne({ "_id": new ObjectId(eventId) });

        return result;

    } finally {
        await client.close();
    }
}

async function deleteEvent(eventId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.deleteOne({ "_id": new ObjectId(eventId) });

        if (result.deletedCount !== 1) return -1;

    } finally {
        await client.close();
    }
}

// Guests
async function getEventGuests(eventId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.aggregate([
            { $match: { "_id": new ObjectId(eventId) }},
            { $project: {
                _id: 0,
                "guests": 1,
            }}
        ]).toArray();

        const { guests } = result.length > 0 ? result[0] : [];

        return guests;

    } finally {
        await client.close();
    }
}

async function addNewGuest(eventId, name, contact, status) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const newGuest = {
            name: name,
            contact: contact,
            RSVP_status: status,
            guest_id: new ObjectId(),
        }

        await events.updateOne(
            { _id: new ObjectId(eventId) },
            { $push: { guests: newGuest }}
        );

        return newGuest.guest_id.toString();
    } finally {
        await client.close();
    }
}

async function deleteGuest(guestId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        await events.updateOne(
            { "guests.guest_id": new ObjectId(guestId) },
            { $pull: { guests: { guest_id: new ObjectId(guestId) }}}
        );

    } finally {
        await client.close();
    }
}

async function updateGuest(guestId, name, contact, RSVP_status) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        await events.updateOne(
            { "guests.guest_id": new ObjectId(guestId) },
            { $set: {
                "guests.$.name": name,
                "guests.$.contact": contact,
                "guests.$.RSVP_status": RSVP_status
            }}
        );

    } finally {
        await client.close();
    }
}

// To-do items
async function getEventTodo(eventId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.aggregate([
            { $match: { "_id": new ObjectId(eventId) }},
            { $project: {
                _id: 0,
                "todo": 1,
            }}
        ]).toArray();

        const { todo } = result.length > 0 ? result[0] : [];

        return todo;

    } finally {
        await client.close();
    }
}

async function markDone(itemId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        await events.updateOne(
            { "todo.todo_id": new ObjectId(itemId) },
            { $set: {
                "todo.$.is_done": true,
            }}
        );
    } finally {
        await client.close();
    }
}

async function addTodo(eventId, description, deadline, priorityLevel) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const newTodo = {
            description: description,
            deadline: deadline,
            priority_level: priorityLevel,
            todo_id: new ObjectId(),
        }

        await events.updateOne(
            { _id: new ObjectId(eventId) },
            { $push: { todo: newTodo }}
        );

        return newTodo.todo_id.toString();
    } finally {
        await client.close();
    }
}

async function deleteTodo(itemId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.updateOne(
            { "todo.todo_id": new ObjectId(itemId) },
            { $pull: { todo: { todo_id: new ObjectId(itemId) }}}
        );

        return result;

    } finally {
        await client.close();
    }
}

// Expenses
async function getEventExpenses(eventId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.aggregate([
            { $match: { "_id": new ObjectId(eventId) }},
            { $project: {
                _id: 0,
                "expenses": 1,
            }}
        ]).toArray();

        const { expenses } = result.length > 0 ? result[0] : [];

        return expenses;

    } finally {
        await client.close();
    }
}

async function addNewExpense(eventId, amount, date, description) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const newExpense = {
            amount_spent: amount,
            date_spent: date,
            description: description,
            expense_id: new ObjectId(),
        }

        const result = await events.updateOne(
            { _id: new ObjectId(eventId) },
            { $push: { expenses: newExpense }}
        );

        return newExpense.expense_id.toString();

    } finally {
        await client.close();
    }
}

async function deleteExpense(expenseId) {
    try {
        await client.connect();

        const database = client.db(databaseName);
        const events = database.collection('Events');

        const result = await events.updateOne(
            { "expenses.expense_id": new ObjectId(expenseId) },
            { $pull: { expenses: { expense_id: new ObjectId(expenseId) }}}
        );

        return result;
    } finally {
        await client.close();
    }
}

module.exports = {
    checkUsername,
    newUser,
    getEventData,
    addEvent,
    getEventDataByEventId,
    deleteEvent,
    getEventGuests,
    addNewGuest,
    deleteGuest,
    updateGuest,
    getEventTodo,
    markDone,
    addTodo,
    deleteTodo,
    getEventExpenses,
    addNewExpense,
    deleteExpense,
}