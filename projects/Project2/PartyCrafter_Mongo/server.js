const express = require('express');
const cookieParser = require('cookie-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cookieParser());
app.use(express.static('./build'));
app.use(express.json());

const {
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
} = require('./db/mongoConnector');

const sessions = require('./sessions');

app.get('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const user = sid ? sessions.getSessionUser(sid): '';
    if(!sid || !user) {
        res.status(401).json({ error: 'auth-missing' });
        return;
    } else {
        const { userId, username } = sessions.getSessionUser(sid);
        res.json({ userId, username });
    }
});

app.post('/api/session', async (req, res) => {
    const { username } = req.body;

    let userId = await checkUsername(username);
    if(userId === -1) {
        userId = await newUser(username);
    }

    const sid = sessions.addSession(userId, username);
    res.cookie('sid', sid);

    res.json({ userId, username });
});

app.delete('/api/session', (req, res) => {
    const sid = req.cookies.sid;
    const user = sid ? sessions.getSessionUser(sid) : '';
  
    if(sid) res.clearCookie('sid');
    if(user) sessions.deleteSession(sid);

    res.json({ result: 'logout-fulfilled' });
});

// get event data
app.get('/api/user/event/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const eventData = await getEventData(userId);
        res.json(eventData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// add a new event
app.post('/api/event/:userId', async (req, res) => {
    const { userId } = req.params;
    const { name, description, date_time, location, budget, type } = req.body;

    try {
        const eventId = await addEvent(name, description, date_time, location, budget, type, userId);
        res.json({ eventId });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// get details for a certain event
app.get('/api/event/:eventId', async (req, res) => {
    const { eventId } = req.params;

    try {
        const eventData = await getEventDataByEventId(eventId);
        res.json(eventData);
    } catch (error) {
        res.status(500).json({ error:'Internal Server Error' });
    }
});

// get all guests for a certain event
// app.get('/api/event/guests/:eventId', async (req, res) => {
//     const {eventId} = req.params;

//     try {
//         const guestData = await getEventGuests(eventId);
//         res.json(guestData);
//     } catch (error) {
//         res.status(500).json({ error:'Internal Server Error' });
//     }
// });

// add a new guest for a certain event
app.post('/api/event/guests/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const { name, contact, RSVP_status } = req.body;

    try {
        const guestId = await addNewGuest(eventId, name, contact, RSVP_status);
        res.json({ guestId });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete a guest for a certain event
app.delete('/api/event/guests/:guestId', async (req, res) => {
    const { guestId } = req.params;

    try {
        await deleteGuest(guestId);
        res.json({ result: 'Guest Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// update a guest information and RSVP status for a certain event
app.patch('/api/event/guest/:guestId', async (req, res) => {
    const { guestId } = req.params;
    const { name, contact, RSVP_status } = req.body;

    try {
        await updateGuest(guestId, name, contact, RSVP_status);
        res.json({ result: 'Guest Updated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// To-do Items
// get all todo items for a certain event
// app.get('/api/event/todo/:eventId', async (req, res) => {
//     const {eventId} = req.params;

//     try {
//         const todoData = await getEventTodo(eventId);
//         res.json(todoData);
//     } catch (error) {
//         res.status(500).json({ error:'Internal Server Error' });
//     }
// });

// add a to-do item
app.post('/api/event/todo/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const { item_description, deadline, priority_levels } = req.body;

    try {
        const itemId = await addTodo(eventId, item_description, deadline, priority_levels);
        res.json({ itemId });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete a to-do item
app.delete('/api/event/todo/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        await deleteTodo(itemId);
        res.json({ result: 'To-do item Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// mark a to-do item as done
app.patch('/api/event/todo/:itemId', async (req, res) => {
    const { itemId } = req.params;

    try {
        await markDone(itemId);
        res.json({ result: 'To-do item Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

// Expenses
// get all expenses for a certain event
// app.get('/api/event/expenses/:eventId', async (req, res) => {
//     const {eventId} = req.params;

//     try {
//         const expenseData = await getEventExpenses(eventId);
//         res.json(expenseData);
//     } catch (error) {
//         res.status(500).json({ error:'Internal Server Error' });
//     }
// });

// add a new expense for a certain event
app.post('/api/event/expenses/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const { amount_spent, date_spent, expense_description } = req.body;

    try {
        const expenseId = await addNewExpense(eventId, amount_spent, date_spent, expense_description);
        res.json({ expenseId });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// delete an expense for a certain event
app.delete('/api/event/expenses/:expenseId', async (req, res) => {
    const { expenseId } = req.params;

    try {
        await deleteExpense(expenseId);
        res.json({ result: 'Expense Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

});

// app.patch('/event/updateBudget/:eventId', async (req, res) => {
//     const { eventId } = req.params;
//     const { newBudget } = req.body;

//     try {
//         await updateEventBudget(eventId, newBudget);
//         res.json({ result: 'Budget Updated' });
//     } catch (error) {
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// })

app.delete('/event/:eventId', async (req, res) => {
    const { eventId } = req.params;

    try {
        await deleteEvent(eventId);
        res.json({ result: 'Event Deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }

})

app.listen(PORT, () => console.log(`http://localhost:${PORT}`));