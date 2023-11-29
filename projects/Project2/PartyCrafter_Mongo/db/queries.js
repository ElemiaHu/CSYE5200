const { MongoClient, ObjectId } = require("mongodb");
const client = new MongoClient('mongodb://localhost:27017');

// aggregation
// calculate expenses for one event and compare it with event budget
async function getExpensesBudget(eventId) {
    try {
        await client.connect();

        const database = client.db('PartyCrafter');
        const events = database.collection('Events');

        const result = await events.aggregate([
            { $match: { _id: new ObjectId(eventId) }},
            { $project: {
                _id: 0,
                totalExpenses: { $sum: "$expenses.amount_spent" },
                budget: 1,
            }},
            { $addFields: {
                isBudgetExceeded: { $cmp: ["$totalExpenses", "budget"] },
            }}
        ]).toArray();

        return result;

    } finally {
        await client.close();
    }
}

// complex search criterion
// get all events(both self-owned and cohosted) associated with one specific user
async function getEventData(userId) {
    try {
        await client.connect();

        const database = client.db('PartyCrafter');
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

// counting documents for an specific user
// get # of events associated with one specific user
async function countEventsById(userId) {
    try {
        await client.connect();

        const database = client.db('PartyCrafter');
        const events = database.collection('Events');

        const result = await events.countDocuments({
            "$or": [
                { "type": "self-owned", "host": new ObjectId(userId)},
                { "type": "cohosted", "cohost": { "$in": [ new ObjectId(userId) ]}},
            ]
        });

        return result;

    } finally {
        await client.close();
    }
}

// update a document
// mark a todo item as done
async function markDone(itemId) {
    try {
        await client.connect();

        const database = client.db('PartyCrafter');
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

// add a regular guest from event guests
async function addEventGuestToRegular(userId, guest) {
    try {
        await client.connect();

        const database = client.db('PartyCrafter');
        const users = database.collection('Users');

        const guestExists = await users.findOne({
            _id: new ObjectId(userId),
            regular_guests: { $elemMatch: { guest_id: new ObjectId(guest.guest_id)}}
        });

        if(!guestExists) {
            await users.updateOne(
                { _id: new ObjectId(userId) },
                { $push: { regular_guests: guest }},
            );
        }

    } finally {
        await client.close();
    }
}
