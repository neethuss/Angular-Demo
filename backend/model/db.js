import pkg from 'pg';
const {Pool}= pkg
import dotenv from 'dotenv'


const pool = new Pool({
  user: process.env.DATABASE_USERNAME  || 'postgres',         
  host: 'localhost',        
  database: process.env.DATABASE_NAME || 'neutrinostask1', 
  password: process.env.DATABASE_PASSWORD || 'neethu12345',
  port: 5432,               
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error acquiring client', err.stack);
  } else {
    console.log('Database connected successfully!');
    release();
  }
});

export default pool;
