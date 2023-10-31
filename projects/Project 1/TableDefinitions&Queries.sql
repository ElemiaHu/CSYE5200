-- Table Definitions
CREATE TABLE "Users" (
	"user_id"	INTEGER NOT NULL,
	"username"	TEXT NOT NULL,
	"email_address"	TEXT NOT NULL,
	"first_name"	TEXT,
	"last_name"	TEXT,
	"date_of_birth"	TEXT,
	"mobile"	INTEGER,
	PRIMARY KEY("user_id")
);

CREATE TABLE "Events" (
	"event_id"	INTEGER NOT NULL,
	"is_active"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"event_description"	TEXT,
	"date_time"	TEXT,
	"location"	TEXT,
	"budget"	INTEGER,
	"type"	TEXT NOT NULL CHECK("type" IN ('Self-Owned', 'Cohosted')),
	PRIMARY KEY("event_id")
);

CREATE TABLE "Hosts" (
	"event_id"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	FOREIGN KEY("event_id") REFERENCES "Events"("event_id"),
	FOREIGN KEY("user_id") REFERENCES "Users"("user_id")
);

CREATE TABLE "Guests" (
	"guest_id"	INTEGER NOT NULL,
	"name"	TEXT NOT NULL,
	"contact"	TEXT,
	PRIMARY KEY("guest_id")
);

CREATE TABLE "RegularGuests" (
	"guest_id"	INTEGER NOT NULL,
	"user_id"	INTEGER NOT NULL,
	"category"	TEXT,
	FOREIGN KEY("guest_id") REFERENCES "Guests"("guest_id"),
	FOREIGN KEY("user_id") REFERENCES "Users"("user_id")
);

CREATE TABLE "EventGuests" (
	"guest_id"	INTEGER NOT NULL,
	"event_id"	INTEGER NOT NULL,
	"RSVP_status"	TEXT NOT NULL,
	FOREIGN KEY("event_id") REFERENCES "Events"("event_id"),
	FOREIGN KEY("guest_id") REFERENCES "Guests"("guest_id")
);

CREATE TABLE "TodoItems" (
	"item_id"	INTEGER NOT NULL,
	"event_id"	INTEGER NOT NULL,
	"item_description"	TEXT NOT NULL,
	"deadline"	TEXT NOT NULL,
	"priority_levels"	INTEGER,
	FOREIGN KEY("event_id") REFERENCES "Events"("event_id"),
	PRIMARY KEY("item_id")
);

CREATE TABLE "Expenses" (
	"expense_id"	INTEGER NOT NULL,
	"event_id"	INTEGER NOT NULL,
	"amount_spent"	INTEGER NOT NULL,
	"date_spent"	TEXT NOT NULL,
	"expense_description"	TEXT NOT NULL,
	PRIMARY KEY("expense_id"),
	FOREIGN KEY("event_id") REFERENCES "Events"("event_id")
);

CREATE TABLE "ServiceProviders" (
	"provider_id"	INTEGER NOT NULL,
	"event_id"	INTEGER NOT NULL,
	"service_type"	TEXT,
	"contact"	TEXT,
	"location"	TEXT,
	"estimated_price"	INTEGER,
	PRIMARY KEY("provider_id"),
	FOREIGN KEY("event_id") REFERENCES "Events"("event_id")
);

-- Sample queries
-- retrieves a list of active cohosted events with budgets over 1000 dollars
SELECT event_id, name, budget
FROM Events
WHERE is_active = 1 AND budget > 1000 AND type = 'Cohosted';

-- view a list of upcoming events, including event details and RSVP status for a given user.
SELECT Events.event_id, Events.name, Events.location, Events.date_time, Guests.name, EventGuests.RSVP_status
FROM Events
JOIN Hosts USING(event_id)
JOIN EventGuests USING(event_id)
JOIN Guests USING(guest_id)
WHERE user_id = 3

-- view all events with a remaining budget lower than 10% of the total budget
SELECT Events.event_id, Events.name, Events.budget, SUM(Expenses.amount_spent) AS amount_spent,
    (Events.budget - SUM(Expenses.amount_spent)) AS remaining_budget
FROM Events
JOIN Expenses USING(event_id)
GROUP BY Events.event_id
HAVING (Events.budget - SUM(Expenses.amount_spent)) < (0.1 * Events.budget);

-- categorizes the expenses of a certain event as "High," "Medium," or "Low" based on the amount spent
SELECT expense_id, amount_spent,
  CASE
    WHEN amount_spent > 1000 THEN 'High'
    WHEN amount_spent > 500 THEN 'Medium'
    ELSE 'Low'
  END AS expense_category
FROM Expenses
WHERE event_id = 5;

-- find events with expenses exceeding average expense per event
SELECT event_id, sum(amount_spent) as expense FROM Expenses
GROUP BY event_id
HAVING expense > (
	SELECT avg(expense) FROM (
		SELECT event_id, sum(amount_spent) as expense FROM Expenses GROUP BY event_id
	)
);