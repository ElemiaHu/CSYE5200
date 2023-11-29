# Project 2

This directory contains every document needed for project 2.

## Navigations

1. Business requirements, conceptual design(UML diagram) and ER diagram are in the [PartyCrafter_Database Design](./PartyCrafter_Database%20Design.pdf) document.
2. Definitions of Collections can be found [here](./Collections.md).
3. [5 sample queries](./PartyCrafter_Mongo/db/queries.js) are also included. Try running the 5 functions inside to get a better understanding of the Party Crafter database.
4. Mockup data for this data base are inside the [db](./PartyCrafter_Mongo/db) folder. To make use of this, please refer to the instructions below.
5. The basic Node + Express + React application is located [here](./PartyCrafter_Mongo). For further information about this web application, please refer to the readme document inside this project.

## Instructions on using mockup data with MongoDB
1. Have Mongo Community/Mongo Shell installed on your local machine.
2. Under the PartyCrafter_Mongo directoty, run the following commands
   ```
   mongoimport -h localhost:27017 -d PartyCrafter -c Users --file db/PartyCrafter.Users.json --jsonArray
   mongoimport -h localhost:27017 -d PartyCrafter -c Events --file db/PartyCrafter.Events.json --jsonArray
   ```
3. Data will be added to your local Mongo server and you can run the application with mockup data.
4. If you want to run the application with a new database, make sure to change the databaseName in the [mongoConnector.js](./PartyCrafter_Mongo/db/mongoConnector.js) file.
