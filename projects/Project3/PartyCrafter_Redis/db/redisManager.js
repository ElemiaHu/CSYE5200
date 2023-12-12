const { MongoClient, ObjectId } = require('mongodb');
const mongoClient = new MongoClient('mongodb://localhost:27017');

const { createClient } = require('redis');

const uuid = require('uuid').v4;

async function addSession(userId) {
    const sid = uuid();
    const redisClient = createClient({ host: '127.0.0.1', port: 6379 });

    try {
        await redisClient.connect();
        await redisClient.set(sid, userId);
    
        const database = mongoClient.db('PartyCrafter');
        const users = database.collection('Users');
        const user = await users.findOne({ _id: new ObjectId(userId)});
        const userInfo = {
            username: user.username,
            email: user.email,
            mobile: user.mobile,
        }

        await redisClient.hSet(`userInfo:${userId}`, userInfo);

        return sid.toString();
    } catch(error) {
        console.log(error);
    } finally {
        console.log('completed');
        await redisClient.quit();
        await mongoClient.close();
    }
}

async function getSessionUser(sid) {
    const redisClient = createClient({ host: '127.0.0.1', port: 6379 });

    try {
        await redisClient.connect();
        const userId = await redisClient.get(sid.toString()) || '';
        if(sid) {
            const username = await redisClient.hGet(`userInfo:${userId}`, 'username') || '';
            return { userId, username };
        }
    } finally {
        await redisClient.quit();
    }
}

async function deleteSession(sid) {
    const redisClient = createClient({ host: '127.0.0.1', port: 6379 });

    try {
        await redisClient.connect();
        await redisClient.del(sid.toString());
    
        console.log('delete success');
    } finally {
        await redisClient.quit();
    }
}

module.exports = {
    addSession,
    getSessionUser,
    deleteSession,
}
