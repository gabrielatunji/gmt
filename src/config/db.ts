import { Pool } from 'pg'; 
import dotenv from 'dotenv';

dotenv.config();

const pool = new Pool ({
    user: 'postgres',
    host: 'localhost',
    database: 'testdb',
    password: process.env.PG_PASSWORD,
    port: Number(process.env.PG_PORT)
}); 

export default pool; 