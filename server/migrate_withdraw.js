const { pool } = require('./db/pool');

async function migrate() {
  try {
    console.log('Connecting to DB via pool...');
    await pool.query(`
      ALTER TABLE auction_state ADD COLUMN IF NOT EXISTS prev_bid BIGINT;
      ALTER TABLE auction_state ADD COLUMN IF NOT EXISTS prev_bidder VARCHAR(255);
    `);
    console.log('Migration successful: prev_bid, prev_bidder added.');
  } catch (err) {
    console.error('Migration failed:', err);
  } finally {
    await pool.end();
  }
}

migrate();
