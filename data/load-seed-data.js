require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const data = require('./cell_phone.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();

        // "Promise all" does a parallel execution of async tasks
        await Promise.all(
            // for every cat data, we want a promise to insert into the db
            data.map(cell_phone => {

                // This is the query to insert a cat into the db.
                // First argument is the function is the "parameterized query"
                return client.query(`
                    INSERT INTO cell_phones (name, type, image_url, brand, year, color, is_touchscreen)
                    VALUES ($1, $2, $3, $4, $5, $6, $7);
                `,
                    // Second argument is an array of values for each parameter in the query:
                [cell_phone.name, cell_phone.type, cell_phone.image_url, cell_phone.brand, cell_phone.year, cell_phone.color, cell_phone.is_touchscreen]);

            })
        );


        console.log('seed data load complete');
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}