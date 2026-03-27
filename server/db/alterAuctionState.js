const { pool } = require('./pool');
require('dotenv').config();

async function alterAuctionState() {
  try {
    console.log('Adding order_index to auction_state table...');
    await pool.query('ALTER TABLE auction_state ADD COLUMN IF NOT EXISTS order_index INT');
    console.log('Successfully added order_index to auction_state.');
  } catch (err) {
    console.error('Error altering auction_state:', err);
  } finally {
    await pool.end();
  }
}

alterAuctionState();
