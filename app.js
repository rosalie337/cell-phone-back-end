require('dotenv').config();
// Application Dependencies
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const pg = require('pg');
console.log(process.env);
// Database Client
const Client = pg.Client;
const client = new Client(process.env.DATABASE_URL);
client.connect();
// Application Setup
const app = express();
const PORT = process.env.PORT;
app.use(morgan('dev')); // http logging
app.use(cors()); // enable CORS request
// location route
app.get('/cell_phones', async(req, res) => {
    try {
        const result = await client.query(`
        SELECT 
        c.* 
        t.name as type
        FROM cell_phones c
        JOIN types t
        ON c.type_id = t.id
        ORDER BY c.year;
    `);
        res.json(result.rows);
    }
    catch (err) {
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/cell_phones/:phoneId', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM cell_phones
            WHERE cell_phones.id=$1`, 
            // the second parameter is an array of values to be SANITIZED then inserted into the query
            // i only know this because of the `pg` docs
        [req.params.phoneId]);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
// using .post instead of get
app.post('/api/cell_phones', async(req, res) => {
    // using req.body instead of req.params or req.query (which belong to /GET requests)__
    try {
        console.log(req.body);
        // make a new cat out of the cat that comes in req.body;
        const result = await client.query(`
            DELETE FROM cell_phones where id= ${req.body.id}
        `,
        // pass the values in an array so that pg.Client can sanitize them
        [req.body.name, req.body.type_id, req.body.image_url, req.body.brand, req.body.year, req.body.color, req.body.is_touchscreen]
        );
        res.json(result.rows[0]); // return just the first result of our query
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.put('/api/cell_phones', async(req, res) => {
    // using req.body instead of req.params or req.query (which belong to /GET requests)
    try {
        console.log(req.body);
        // make a new cat out of the cat that comes in req.body;
        const result = await client.query(`
            UPDATE cell_phones
            SET name = '${req.body.name}', 
                is_touchscreen = '${req.body.is_touchscreen}', 
                image_url = '${req.body.image_url}', 
                year = '${req.body.year}', 
                brand = '${req.body.brand}',
                type_id = '${req.body.type_id}'
                color = '${req.body.color}'
            WHERE id = ${req.body.id};
        `,
        );
        res.json(result.rows[0]); // return just the first result of our query
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});
app.delete('/api/cell_phones/:phoneId', async(req, res) => {
    try {
        const result = await client.query(`
        DELETE FROM cell_phones where id = ${req.params.phoneId} 
        `);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

app.get('/api/types', async(req, res) => {
    try {
        const result = await client.query(`
            SELECT *
            FROM types
            ORDER BY name;
        `);
        res.json(result.rows);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err.message || err
        });
    }
});

module.exports = { app, };