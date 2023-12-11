# Party Crafter

This is a basic Node + Express + React + MongoDB + Redis application simply for CSYE5200 Project 3.

Compared to the Party Crafter in Project 2, this project utilized Redis for session storage to improve performance.

## Instructions on using databases

Prerequisites: Have MongoDB and Redis installed on your local machine.

1. Under the PartyCrafter_Mongo directoty, run the following commands
```
mongoimport -h localhost:27017 -d PartyCrafter -c Users --file db/PartyCrafter.Users.json --jsonArray
mongoimport -h localhost:27017 -d PartyCrafter -c Events --file db/PartyCrafter.Events.json --jsonArray
```
Data will be added to your local Mongo server.
2. Run `redis-server` in the terminal.
3. Now you can run the application with mockup data.

## How to explore

Prerequisites: Have Node.js installed on your local machine.

1. run `git clone` to clone this project to your local machine.
2. run `npm install` to install dependencies.
3. For development: run `npm run dev` to start react and `npm run start` to start the server.
(This project uses proxy for development. If you want to change code in this project, please follow instruction 3)
4. For use only: run `npm run build` and run `node server.js` to start the server.
5. Open browser and go to `http://localhost:3000`

## Notes
To get a better image of this application, try logging in with "Elaine" first.
