<!-- @format -->

# Assignment Instructions, spring 2022

This repository contains the frontend for the student assignment of Advanced Web Front-ends course

## Starting server backend

The backend for the assignment is located inside the directory `assignment/backend`.

1. Setup/install backend

   - **this stage needs to be performed only once**
   - **you can skip this stage if the backend is already installed**
   - change working directory to `backend`
   - inside `backend` directory run `npm install`

2. Starting the backend server

   - change working directory to `backend`
   - inside `backend` directory run `npm start`
   - server listens on http://localhost:3001/

3. Stopping the backend server
   - press <`Ctrl-C`> while the server is running

### Resetting database back to its initial state

1. change working directory to `backend`
2. inside `backend` directory run `npm run reset-db`

## Setup the exercise

- change working directory to `assignment/frontend`
- run `npm install` to install all dependencies
- API documentation can be viewed in [http://localhost:3001/docs](http://localhost:3001/docs)

## Run the assignment

- In the backend directory start the server (`npm start`)
- In another terminal inside the assignment directory run `npm start` to run the app in the development mode. Open [http://localhost:3000](http://localhost:3000)
  to view it in your browser.

**NOTE: Inside _package.json_ there is a proxy setting (`"proxy": "http://localhost:3001"`) which allows you to call the backend directly without the host and port. For example, you can replace `http://localhost:3001/api/users` with `/api/users` omitting the host and port. If this proxy causes issues, refer to the teams-channel.**

## Making the documents

### `npm run docs`

Creates the docs out of the jsdocs into the /docs-folder.

## Testing the exercise

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm test -- NameOfTheFile.test.js`

Launches the test runner in the interactive watch mode on that particular file. Often useful when you want to explicitly work on a single file.
