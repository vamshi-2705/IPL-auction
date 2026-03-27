const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

async function initDb() {
  const adminPool = new Pool({
    user: process.env.DB_USER || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    password: process.env.DB_PASSWORD || 'postgres',
    port: process.env.DB_PORT || 5432,
    database: 'postgres' // Connect to default DB initially
  });

  try {
    const dbName = process.env.DB_NAME || 'ipl_auction';
    const res = await adminPool.query(`SELECT datname FROM pg_catalog.pg_database WHERE lower(datname) = lower('${dbName}')`);
    if (res.rowCount === 0) {
      console.log(`Creating database ${dbName}...`);
      await adminPool.query(`CREATE DATABASE ${dbName}`);
      console.log('Database created.');
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (err) {
    console.error('Error checking/creating database:', err.message);
  } finally {
    await adminPool.end();
  }

  // Now connect to the target database and execute table creation
  const { pool } = require('./pool');
  try {
    const sqlPath = path.join(__dirname, 'setup.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Running setup.sql...');
    await pool.query(sql);
    console.log('Tables created successfully.');
  } catch (error) {
    console.error('Error initializing tables:', error);
  } finally {
    await pool.end();
  }
}

if (require.main === module) {
  initDb();
}
module.exports = initDb;
