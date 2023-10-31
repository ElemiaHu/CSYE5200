# Party Crafter

This is a basic Node + Express + React application simply for CSYE5200 Project 1.

## How to run

Prerequisites: Have Node.js installed on your local machine.

1. run `git clone` to clone this project to your local machine.
2. run `npm install` to install dependencies.
3. For development: run `npm run dev` to start react and `npm run start` to start the server.
(This project uses proxy for development. If you want to change code in this project, please follow instruction 3)
4. For use only: run `npm run build` and run `node server.js` to start the server.
5. Open browser and go to `http://localhost:3000`

## How to test
Due to limited time, this application lacks data validation and error handling.

The best way to test is to follow the steps below.
1. Enter a valid username and click on the Search button. Suggested: facilisis./consectetuer/luctus
2. After step1, you should be able to see a list of events associated with this user.
3. Click on the Edit button to modify "Budget".
4. Click on the Delete button to delete an event.
5. Fill in all the input areas and click on the Add button to add an event associated with the current user.

Again, due to limited time, there are several bugs I did not solve. Including,
1. When you click on 'Edit', "Budget" under every event would turn into an input area.
2. Without sessions and cookies, you must first search for a user, otherwise you can not successfully complete the remaining steps of the test.

I apologize for the inconvenience. I would work on solving these problems and improve the layout if available.
