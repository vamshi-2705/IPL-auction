const { pool } = require('./pool');

const megaPlayers = [
  { name: 'Virat Kohli', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2.png' },
  { name: 'Rohit Sharma', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/107.png' },
  { name: 'MS Dhoni', role: 'Wicket Keeper', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1.png' },
  { name: 'Jasprit Bumrah', role: 'Bowler', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1124.png' },
  { name: 'Pat Cummins', role: 'All-rounder', country: 'Australia', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/488.png' },
  { name: 'Mitchell Starc', role: 'Bowler', country: 'Australia', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/137.png' },
  { name: 'Rashid Khan', role: 'Bowler', country: 'Afghanistan', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2885.png' },
  { name: 'Suryakumar Yadav', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/108.png' },
  { name: 'Shubman Gill', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3761.png' },
  { name: 'David Warner', role: 'Batsman', country: 'Australia', basePrice: 15000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/170.png' },
  { name: 'Faf du Plessis', role: 'Batsman', country: 'South Africa', basePrice: 15000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/24.png' },
  { name: 'KL Rahul', role: 'Wicket Keeper', country: 'India', basePrice: 20000000, setCategory: 'Wicket Keepers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1125.png' },
  { name: 'Rishabh Pant', role: 'Wicket Keeper', country: 'India', basePrice: 20000000, setCategory: 'Wicket Keepers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2972.png' },
  { name: 'Hardik Pandya', role: 'All-rounder', country: 'India', basePrice: 20000000, setCategory: 'All-rounders 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2740.png' },
  { name: 'Ravindra Jadeja', role: 'All-rounder', country: 'India', basePrice: 20000000, setCategory: 'All-rounders 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/9.png' },
  { name: 'Mohammed Shami', role: 'Bowler', country: 'India', basePrice: 20000000, setCategory: 'Fast Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/94.png' },
  { name: 'Mohammed Siraj', role: 'Bowler', country: 'India', basePrice: 20000000, setCategory: 'Fast Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3840.png' },
  { name: 'Abhishek Sharma', role: 'All-rounder', country: 'India', basePrice: 15000000, setCategory: 'All-rounders 7', img: '' },
  { name: 'Nitish Kumar Reddy', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 7', img: '' },
  { name: 'Sachin Tendulkar', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Legendary Batsmen', img: '' },
  { name: 'AB de Villiers', role: 'Batsman', country: 'South Africa', basePrice: 20000000, setCategory: 'Legendary Batsmen', img: '' },
  { name: 'Chris Gayle', role: 'Batsman', country: 'West Indies', basePrice: 20000000, setCategory: 'Legendary Batsmen', img: '' }
];

async function initializeDatabase() {
    const sql = `
        DROP TABLE IF EXISTS room_participants CASCADE;
        CREATE TABLE IF NOT EXISTS users (id VARCHAR(50) PRIMARY KEY, username VARCHAR(100) NOT NULL, team VARCHAR(20) NOT NULL);
        CREATE TABLE IF NOT EXISTS rooms (id VARCHAR(50) PRIMARY KEY, host_id VARCHAR(50) NOT NULL, status VARCHAR(20) DEFAULT 'waiting', privacy VARCHAR(20) DEFAULT 'public', mode VARCHAR(50) DEFAULT 'mega');
        CREATE TABLE IF NOT EXISTS auction_settings (room_id VARCHAR(50) PRIMARY KEY, purse_money BIGINT DEFAULT 1200000000, bid_timer INT DEFAULT 15, min_squad INT DEFAULT 18, max_squad INT DEFAULT 25, max_overseas INT DEFAULT 8);
        CREATE TABLE IF NOT EXISTS players (id SERIAL PRIMARY KEY, name VARCHAR(100) NOT NULL, role VARCHAR(50), country VARCHAR(50), base_price BIGINT NOT NULL, set_category VARCHAR(50), image_url VARCHAR(255), auction_mode VARCHAR(50) DEFAULT 'mega');
        CREATE TABLE IF NOT EXISTS room_participants (room_id VARCHAR(50), user_id VARCHAR(50), username VARCHAR(100), team VARCHAR(20), is_host BOOLEAN DEFAULT false, purse_balance BIGINT DEFAULT 1200000000, PRIMARY KEY (room_id, user_id));
        CREATE TABLE IF NOT EXISTS bids (id SERIAL PRIMARY KEY, room_id VARCHAR(50), player_id INT, user_id VARCHAR(50), amount BIGINT NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP);
        CREATE TABLE IF NOT EXISTS team_squads (room_id VARCHAR(50), user_id VARCHAR(50), player_id INT, bought_price BIGINT NOT NULL, timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP, PRIMARY KEY (room_id, player_id));
        CREATE TABLE IF NOT EXISTS auction_state (room_id VARCHAR(50), player_id INT, current_bid BIGINT NOT NULL, highest_bidder VARCHAR(50), status VARCHAR(20) DEFAULT 'pending', order_index INT, PRIMARY KEY (room_id, player_id));
    `;
    await pool.query(sql);
    return "Database Schema Fixed & Re-initialized Successfully!";
}

async function seedRemote() {
    // Clear first
    await pool.query('DELETE FROM players');
    
    // Seed core players
    for (const p of megaPlayers) {
        await pool.query(
            'INSERT INTO players (name, role, country, base_price, set_category, image_url, auction_mode) VALUES ($1, $2, $3, $4, $5, $6, $7)',
            [p.name, p.role, p.country, p.basePrice, p.setCategory, p.img || null, 'mega']
        );
    }
    return "Database Seeded Successfully with Core Players!";
}

module.exports = { initializeDatabase, seedRemote };
