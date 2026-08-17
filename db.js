import dotenv from "dotenv";
import mysql from "mysql2/promise";


// Loading variables from env so we could log in to the db
dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    port: process.env.DB_PORT,
    
});

export default db;

