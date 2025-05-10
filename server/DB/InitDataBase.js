import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import fs from 'fs/promises';
dotenv.config({ path: './DB/.env' });

//dotenv.config();

async function initDatabase() {
  try {
    const con = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      multipleStatements: true,
    });

    console.log("Connected to MySQL!");
    const sql = await fs.readFile('./DB/SQLfile.sql', 'utf8');
    //const sql = await fs.readFile('./server/DB/SQLfile.sql', 'utf8');
    await con.query(sql);

    console.log("Database initialized successfully.");

    await con.end();
  } catch (err) {
    console.error("Error during DB initialization:", err.message);
  }
}

initDatabase();
