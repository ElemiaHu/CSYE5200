# Redis Data Design

## Session Management
This functionality generates a unique session identifier (sid) using a UUID when a user logs in. 
The relevant user information, such as `userId`, `username`, `email`, and `mobile`, is stored in Redis using a combination of Strings and Hashes data structures. 
The session is automatically deleted when the user logs out.

#### Data structure details

Session is stored with String.

**Key**: `sid`

**Value**: `userId`

Related User info is stored with Hashes.

**Key**: `userInfo:userId`

e.g. `userInfo:65626777ad121ede14fa87e3`

**Value**:
```
{
    username,
    email,
    mobile,
}
```

Session Management is impemented in PartyCrafter. Please see the implementation [here](./PartyCrafter_Redis/db/redisManager.js).

## Caching Event Data
For users with valid sessions (online users), a list of active events is stored in the Redis. 
The cached information includes basic event details such as name, description, time, and location.

#### Data structure details

The list of active events is stored with List.

**Key**: `events:userId`

e.g. `events:65626777ad121ede14fa87e3`

**Value**: `eventId`

Related Event info is stored with Hashes.

**Key**: `event:eventId`

e.g. `event:65627cd7ad121ede14fa8803`

**Value**:
```
{
    name,
    description,
    time,
    location
}
```
