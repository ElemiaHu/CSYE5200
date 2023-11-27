# Party Crafter MongoDB Design

## Collections

### Users
Sample entry for the Users collection:
```
{
    _id,
    username,
    email,
    mobile,
    first_name,
    last_name,
    regular_guests: [
        {
            guest_id,
            name,
            contact,
            category,
        }
    ]
}
```

### Events
Sample entry for the Events collection:
Self-owned Events:
```
{
    _id,
    name,
    is_active,
    description,
    date_time,
    location,
    budget,
    type: "self-owned",
    host: user_id,
    event_guests: [
        {
            guest_id,
            name,
            RSVP_status,
            contact,
        },
    ],
    todo: [
        {
            todo_id,
            description,
            deadline,
            priority_level,
            is_done,
        },
    ],
    expenses: [
        {
            expense_id,
            amount_spent,
            date_spent,
            description,
        },
    ],
    service_providers: [
        {
            provider_id,
            service_type,
            contact,
            location,
            estimated_price,
        },
    ],
}
```

Cohosted Events:
```
{
    ...
    type: "cohosted",
    cohost: [user_id, user_id, ... ],
}
```