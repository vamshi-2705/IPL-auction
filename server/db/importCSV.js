const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function importPlayers() {
  const players = [];
  const csvPath = path.join(__dirname, 'players.csv');

  if (!fs.existsSync(csvPath)) {
    console.error("❌ ERROR: Could not find 'players.csv'. Please make sure the file is inside the server/db/ folder!");
    process.exit(1);
  }

  console.log("📂 Reading players.csv...");

  fs.createReadStream(csvPath)
    .pipe(csv())
    .on('data', (row) => {
       // Gracefully map common CSV header names to our database columns
       const name = row['Player Name'] || row['Name'] || row['Player'] || row['name'];
       const role = row['Role'] || row['role'] || row['Type'] || "Batsman";
       const country = row['Country'] || row['country'] || row['Nation'] || "India";
       
       // Dynamically parse text like "2 Cr", "50 Lakh", or pure numbers into integers
       let priceStr = String(row['Base Price'] || row['BasePrice'] || row['price'] || "20000000").toLowerCase();
       let basePrice = 20000000;
       
       if (priceStr.includes('cr')) {
           basePrice = parseFloat(priceStr) * 10000000;
       } else if (priceStr.includes('lakh') || priceStr.includes('l')) {
           basePrice = parseFloat(priceStr) * 100000;
       } else {
           basePrice = parseInt(priceStr.replace(/[^0-9]/g, '')) || 20000000;
       }

       // You can define whether this is a mega player or legends in the CSV, or it defaults to mega
       const mode = String(row['Mode'] || row['mode'] || row['Auction Mode'] || 'mega').toLowerCase(); 
       
       if (name) {
         players.push({ name, role, country, basePrice, mode });
       }
    })
    .on('end', async () => {
      console.log(`✅ Successfully parsed ${players.length} players from CSV!`);
      console.log("🧹 Clearing old database players...");
      
      try {
         await pool.query('DELETE FROM players');
         
         console.log("⚡ Injecting real players into PostgreSQL...");
         let count = 0;
         for (const p of players) {
            // Auto-generate clean Set categories (e.g. Batsmen 1, Bowlers 2)
            const setCategory = `${p.role}s ${Math.floor(count/15) + 1}`; 
            await pool.query(
               'INSERT INTO players (name, role, country, base_price, set_category, image_url, auction_mode) VALUES ($1, $2, $3, $4, $5, $6, $7)',
               [p.name, p.role, p.country, p.basePrice, setCategory, '', p.mode]
            );
            count++;
         }
         console.log(`🎉 SUCCESS! All ${players.length} players imported into the Database perfectly!`);
      } catch(err) {
         console.error("❌ Database Error:", err);
      } finally {
         pool.end();
      }
    });
}

importPlayers();
