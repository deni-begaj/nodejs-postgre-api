const { Pool } = require('pg');
var config = require('../config');

const pool = new Pool({            
    user: config.database.user,
    host: config.database.host,
    database: config.database.dbName,
    password: config.database.password,
    port: config.database.port,
    max: 100
});

pool.on('error', (err, client) => {
    console.error('Postgre pool error: Unexpected error on idle client', err);
    process.exit(-1);
})
   
module.exports = pool;