require('dotenv').config();
const pg = require('pg');
const Client = pg.Client;
// import seed data:
const types = require('./types.js');
const cell_phone = require('./cell_phone.js');

run();

async function run() {
    const client = new Client(process.env.DATABASE_URL);

    try {
        await client.connect();
        
        const savedTypes = await Promise.all(
            types.map(async type => {
                const result = await client.query(`
                data.map(cell_phone => {
                INSERT INTO types (type)
                VALUE ($1)
                RETURNING *;
            `,
                [type]);
                
                return result.rows[0];
            
            })
        );
        await Promise.all(
            cell_phone.map(phone => {

                const type = savedTypes.find(type => {
                    return type.name === phone.type;
                });
                
                return client.query(`
                INSERT INTO cell_phones (name, type_id, image_url, brand, year, color, is_touchscreen)
                VALUES ($1, $2, $3, $4, $5, $6, $7);
            `,
                [cell_phone.name, type.id, cell_phone.image_url, cell_phone.brand, cell_phone.year, cell_phone.color, cell_phone.is_touchscreen]);
            })
        );
    }
    catch (err) {
        console.log(err);
    }
    finally {
        client.end();
    }

}