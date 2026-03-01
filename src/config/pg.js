const { Pool } = require('pg');

// Using a more robust configuration to handle special characters in passwords
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'ciphersqlsandbox',
    password: '2110@Aditya', // Extracted from user's provided info
    port: 5432,
});

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
});

module.exports = pool;
