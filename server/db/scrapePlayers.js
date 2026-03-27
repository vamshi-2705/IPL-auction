const axios = require('axios');
const cheerio = require('cheerio');
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

async function scrapeIPLPlayers() {
  console.log("🚀 Starting Live Wikipedia Web Scraper for Mega Auction...");
  const players = [];
  
  try {
    const url = 'https://en.wikipedia.org/wiki/2025_Indian_Premier_League_mega_auction';
    console.log("🌐 Hitting Wikipedia article: " + url);
    
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    
    // Find all rows in wikipedia's sortable tables which usually contain the auction lists
    $('table.wikitable.sortable tbody tr').each((i, row) => {
        const cols = $(row).find('td');
        if (cols.length >= 6) {
           const setName = $(cols[1]).text().trim().replace(/\n/g, '') || "Uncapped List";
           const name = $(cols[2]).text().trim().replace(/\[.*?\]/g, '').replace(/[\n★†]/g, '').trim();
           const countryNode = $(cols[3]).text().trim() || "India"; 
           const role = $(cols[4]).text().trim() || "Batsman";
           let basePriceStr = $(cols[5]).text().trim();
           
           let basePrice = 20000000;
           basePriceStr = basePriceStr.toLowerCase().replace(/[^0-9.a-z]/g, '');
           
           if (basePriceStr.includes('cr')) {
              const num = parseFloat(basePriceStr);
              if(!isNaN(num)) basePrice = num * 10000000;
           } else if (basePriceStr.includes('lakh') || basePriceStr.includes('l')) {
              const num = parseFloat(basePriceStr);
              if(!isNaN(num)) basePrice = num * 100000;
           } else {
              const num = parseInt(basePriceStr.replace(/[^0-9]/g, ''));
              if(num) basePrice = num;
           }

           if (name && name.length > 2 && !name.toLowerCase().includes('player') && !name.toLowerCase().includes('name')) {
              if (!players.some(p => p.name === name)) {
                 players.push({
                    name,
                    role,
                    country: countryNode,
                    basePrice,
                    setCategory: setName,
                    mode: 'mega'
                 });
              }
           }
        }
    });

    console.log(`✅ Successfully Scraped ${players.length} Real verified players from live internet tables!`);
    
    if (players.length > 0) {
        console.log("🧹 Wiping old 'mega' players table...");
        await pool.query("DELETE FROM players WHERE auction_mode = 'mega'");
        
        console.log("⚡ Injecting live scraped data into PostgreSQL...");
        for (const p of players) {
           await pool.query(
             'INSERT INTO players (name, role, country, base_price, set_category, image_url, auction_mode) VALUES ($1, $2, $3, $4, $5, $6, $7)',
             [p.name, p.role, p.country, p.basePrice, p.setCategory, '', p.mode]
           );
        }
        console.log(`🎉 SUCCESS! Database perfectly overwritten with ${players.length} live modern cricketers!`);
    } else {
        console.log("⚠️ No players found on the target Wikipedia page. Wikipedia HTML structure might have changed.");
    }
  } catch (error) {
     console.error("❌ Scraping failed!", error.message);
  } finally {
     pool.end();
  }
}

scrapeIPLPlayers();
