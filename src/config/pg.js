const { Pool } = require('pg');

// Using a more robust configuration to handle special characters in passwords
const pool = new Pool({
    connectionString: process.env.PG_URI,
    ssl: {
        rejectUnauthorized: false // Required for Render/Cloud DBs
    }
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;
