const { Pool } = require('pg');
require('dotenv').config({ path: require('path').resolve(__dirname, '../.env') });

const pool = process.env.DATABASE_URL
  ? new Pool({ 
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false } // Required for most cloud DBs like Render
    })
  : new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'ipl_auction',
      password: process.env.DB_PASSWORD || 'vamshi27',
      port: process.env.DB_PORT || 5432,
    });

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};
