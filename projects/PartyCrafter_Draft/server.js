const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('./build'));
app.use(express.json());

const { getEventData, addEvent, updateEventBudget, deleteEvent } = require('./db/dbConnector_Sqlite');

app.get('/event/:username', async (req, res) => {
    const { username } = req.params;
    try {
        const eventData = await getEventData(username);
        res.json(eventData);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.post('/event/:username', async (req, res) => {
    const { username } = req.params;
    const { name, description, date_time, location, budget, type } = req.body;

    try {
        await addEvent(name, description, date_time, location, budget, type, username);
        res.json({ result: 'Event Added' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.patch('/event/updateBudget/:eventId', async (req, res) => {
    const { eventId } = req.params;
    const { newBudget } = req.body;

    try {
        await updateEventBudget(eventId, newBudget);
        res.json({ result: 'Budget Updated' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
})

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