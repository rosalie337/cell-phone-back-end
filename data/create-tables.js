// load connection string from .env
require('dotenv').config();
// "require" pg (after `npm i pg`)
const pg = require('pg');
// Use the pg Client
const Client = pg.Client;
// **note:** you will need to create the database!
// async/await needs to run in a function
run();
async function run() {
    // make a new pg client to the supplied url
    const client = new Client(process.env.DATABASE_URL);
    try {
        // initiate connecting to db
        await client.connect();
        // run a query to create tables
        await client.query(`

            CREATE TABLE types (
                id SERIAL PRIMARY KEY NOT NULL,
                name VARCHAR (256) NOT NULL
            );

            CREATE TABLE cell_phones (
                name VARCHAR(256) PRIMARY KEY NOT NULL,
                type_id VARCHAR(256) NOT NULL,
                image_url VARCHAR(256) NOT NULL,
                brand VARCHAR(256) NOT NULL,
                year INTEGER NOT NULL,
                color VARCHAR(256) NOT NULL,
                is_touchscreen BOOLEAN NOT NULL
            );
        `);
        console.log('create tables complete');
    }
    catch (err) {
        // problem? let's see the error...
        console.log(err);
    }
    finally {
        // success or failure, need to close the db connection
        client.end();
    }
}