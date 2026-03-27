const { Pool } = require('pg');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function alterRooms() {
  try {
    console.log("Applying column alterations to rooms table...");
    try {
       await pool.query("ALTER TABLE rooms ADD COLUMN privacy VARCHAR(20) DEFAULT 'public'");
       console.log("Added privacy column.");
    } catch(e) { console.log("Privacy column already exists or error: " + e.message); }

    try {
       await pool.query("ALTER TABLE rooms ADD COLUMN mode VARCHAR(50) DEFAULT 'mega'");
       console.log("Added mode column.");
    } catch(e) { console.log("Mode column already exists or error: " + e.message); }

    console.log("Success! Rooms table updated.");
  } catch (err) {
    console.error("Fatal error:", err);
  } finally {
    pool.end();
  }
}

alterRooms();
