import { Pool } from 'pg';
import { config } from '../../config/config';

const pool: Pool = new Pool({            
    user: config.database.user,
    host: config.database.host,
    database: config.database.dbName,
    password: config.database.password,
    port: config.database.port,
    max: 100
});

console.log("Postgre server connected succesfully.")

pool.on('error', (err, client) => {
    console.error('Postgre pool error: Unexpected error on idle client', err);
    process.exit(-1);
})

// pool.query(`SELECT deleteposts();`)
// .then(res=>{
//     console.log("success");
// })
// .catch(ex=>{
//     console.log("error"+ex);
// });

export default pool;