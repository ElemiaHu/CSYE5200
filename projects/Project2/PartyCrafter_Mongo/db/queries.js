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

// get event guests
async function getEventGuests(eventId) {
    try {
        await client.connect();

        const database = client.db('PartyCrafter');
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

async function addData(eventId) {
    try {
        await client.connect();

        const database = client.db('PartyCrafter');
        const events = database.collection('Events');

        const todos = [
            {
              description: 'Prepare board games',
              deadline: '2023-12-15T18:00:00.000Z',
              priority_level: 2,
              todo_id: new ObjectId(),
            },
            {
              description: 'Set up gaming area',
              deadline: '2023-12-17T15:00:00.000Z',
              priority_level: 3,
              todo_id: new ObjectId(),
            },
            {
              description: 'Order snacks and drinks',
              deadline: '2023-12-10T12:00:00.000Z',
              priority_level: 1,
              todo_id: new ObjectId(),
            },
            {
              description: 'Create a playlist',
              deadline: '2023-12-18T14:00:00.000Z',
              priority_level: 2,
              todo_id: new ObjectId(),
            },
            {
              description: 'Confirm attendance of guests',
              priority_level: 1,
              todo_id: new ObjectId(),
            }
          ];
          
           
          
        await events.updateOne(
            { _id: new ObjectId(eventId) },
            { $push: { todo: { $each: todos } } }
        );

    } finally {
        await client.close();
    }
}

addData('656283c4ad121ede14fa880d')