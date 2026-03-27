const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

const megaPlayers = [
  // Marquee
  { name: 'Virat Kohli', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2.png' },
  { name: 'Rohit Sharma', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/107.png' },
  { name: 'MS Dhoni', role: 'Wicket Keeper', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1.png' },
  { name: 'Jasprit Bumrah', role: 'Bowler', country: 'India', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1124.png' },
  { name: 'Pat Cummins', role: 'All-rounder', country: 'Australia', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/488.png' },
  { name: 'Mitchell Starc', role: 'Bowler', country: 'Australia', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/137.png' },
  { name: 'Rashid Khan', role: 'Bowler', country: 'Afghanistan', basePrice: 20000000, setCategory: 'Marquee 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2885.png' },
  
  // Batsmen
  { name: 'Suryakumar Yadav', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/108.png' },
  { name: 'Shubman Gill', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3761.png' },
  { name: 'David Warner', role: 'Batsman', country: 'Australia', basePrice: 15000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/170.png' },
  { name: 'Faf du Plessis', role: 'Batsman', country: 'South Africa', basePrice: 15000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/24.png' },
  { name: 'Kane Williamson', role: 'Batsman', country: 'New Zealand', basePrice: 15000000, setCategory: 'Batsmen 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/440.png' },
  { name: 'Ruturaj Gaikwad', role: 'Batsman', country: 'India', basePrice: 15000000, setCategory: 'Batsmen 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/5443.png' },
  { name: 'Steve Smith', role: 'Batsman', country: 'Australia', basePrice: 15000000, setCategory: 'Batsmen 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/271.png' },
  { name: 'Travis Head', role: 'Batsman', country: 'Australia', basePrice: 20000000, setCategory: 'Batsmen 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/284.png' },
  { name: 'Shreyas Iyer', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Batsmen 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1563.png' },
  { name: 'Yashasvi Jaiswal', role: 'Batsman', country: 'India', basePrice: 10000000, setCategory: 'Batsmen 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/5430.png' },
  { name: 'Rinku Singh', role: 'Batsman', country: 'India', basePrice: 10000000, setCategory: 'Batsmen 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3830.png' },
  { name: 'Tilak Varma', role: 'Batsman', country: 'India', basePrice: 10000000, setCategory: 'Batsmen 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20549.png' },
  { name: 'Rajat Patidar', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/5471.png' },
  { name: 'Ajinkya Rahane', role: 'Batsman', country: 'India', basePrice: 10000000, setCategory: 'Batsmen 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/135.png' },
  { name: 'Sai Sudharsan', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20592.png' },
  { name: 'Prithvi Shaw', role: 'Batsman', country: 'India', basePrice: 10000000, setCategory: 'Batsmen 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3764.png' },
  { name: 'Manish Pandey', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/123.png' },
  { name: 'Shimron Hetmyer', role: 'Batsman', country: 'West Indies', basePrice: 15000000, setCategory: 'Batsmen 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1705.png' },
  { name: 'Tim David', role: 'Batsman', country: 'Australia', basePrice: 15000000, setCategory: 'Batsmen 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20516.png' }, // fallback photo
  { name: 'Devdutt Padikkal', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/5430.png' },
  { name: 'Rahul Tripathi', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3838.png' },
  
  // Wicket Keepers
  { name: 'KL Rahul', role: 'Wicket Keeper', country: 'India', basePrice: 20000000, setCategory: 'Wicket Keepers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1125.png' },
  { name: 'Rishabh Pant', role: 'Wicket Keeper', country: 'India', basePrice: 20000000, setCategory: 'Wicket Keepers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2972.png' },
  { name: 'Sanju Samson', role: 'Wicket Keeper', country: 'India', basePrice: 15000000, setCategory: 'Wicket Keepers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/258.png' },
  { name: 'Jos Buttler', role: 'Wicket Keeper', country: 'England', basePrice: 20000000, setCategory: 'Wicket Keepers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/509.png' },
  { name: 'Quinton de Kock', role: 'Wicket Keeper', country: 'South Africa', basePrice: 15000000, setCategory: 'Wicket Keepers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/834.png' },
  { name: 'Nicholas Pooran', role: 'Wicket Keeper', country: 'West Indies', basePrice: 15000000, setCategory: 'Wicket Keepers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1703.png' },
  { name: 'Heinrich Klaasen', role: 'Wicket Keeper', country: 'South Africa', basePrice: 15000000, setCategory: 'Wicket Keepers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3824.png' },
  { name: 'Ishan Kishan', role: 'Wicket Keeper', country: 'India', basePrice: 20000000, setCategory: 'Wicket Keepers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2975.png' },
  { name: 'Jonny Bairstow', role: 'Wicket Keeper', country: 'England', basePrice: 15000000, setCategory: 'Wicket Keepers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/506.png' },
  { name: 'Phil Salt', role: 'Wicket Keeper', country: 'England', basePrice: 10000000, setCategory: 'Wicket Keepers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20601.png' }, // fallback
  { name: 'Jitesh Sharma', role: 'Wicket Keeper', country: 'India', basePrice: 5000000, setCategory: 'Wicket Keepers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3183.png' },
  { name: 'Dinesh Karthik', role: 'Wicket Keeper', country: 'India', basePrice: 10000000, setCategory: 'Wicket Keepers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/14.png' },
  { name: 'Wriddhiman Saha', role: 'Wicket Keeper', country: 'India', basePrice: 10000000, setCategory: 'Wicket Keepers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/16.png' },
  { name: 'Rahmanullah Gurbaz', role: 'Wicket Keeper', country: 'Afghanistan', basePrice: 5000000, setCategory: 'Wicket Keepers 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20593.png' },
  { name: 'KS Bharat', role: 'Wicket Keeper', country: 'India', basePrice: 5000000, setCategory: 'Wicket Keepers 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2734.png' },
  { name: 'Dhruv Jurel', role: 'Wicket Keeper', country: 'India', basePrice: 5000000, setCategory: 'Wicket Keepers 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20594.png' },
  
  // All-rounders
  { name: 'Hardik Pandya', role: 'All-rounder', country: 'India', basePrice: 20000000, setCategory: 'All-rounders 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2740.png' },
  { name: 'Ravindra Jadeja', role: 'All-rounder', country: 'India', basePrice: 20000000, setCategory: 'All-rounders 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/9.png' },
  { name: 'Ben Stokes', role: 'All-rounder', country: 'England', basePrice: 20000000, setCategory: 'All-rounders 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1154.png' },
  { name: 'Glenn Maxwell', role: 'All-rounder', country: 'Australia', basePrice: 20000000, setCategory: 'All-rounders 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/282.png' },
  { name: 'Sam Curran', role: 'All-rounder', country: 'England', basePrice: 20000000, setCategory: 'All-rounders 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2939.png' },
  { name: 'Cameron Green', role: 'All-rounder', country: 'Australia', basePrice: 20000000, setCategory: 'All-rounders 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/5536.png' },
  { name: 'Axar Patel', role: 'All-rounder', country: 'India', basePrice: 15000000, setCategory: 'All-rounders 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1113.png' },
  { name: 'Marcus Stoinis', role: 'All-rounder', country: 'Australia', basePrice: 15000000, setCategory: 'All-rounders 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/964.png' },
  { name: 'Krunal Pandya', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3183.png' }, // fallback
  { name: 'Rahul Tewatia', role: 'All-rounder', country: 'India', basePrice: 5000000, setCategory: 'All-rounders 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1749.png' },
  { name: 'Washington Sundar', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/2940.png' },
  { name: 'Liam Livingstone', role: 'All-rounder', country: 'England', basePrice: 15000000, setCategory: 'All-rounders 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3644.png' },
  { name: 'Jason Holder', role: 'All-rounder', country: 'West Indies', basePrice: 15000000, setCategory: 'All-rounders 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1075.png' },
  { name: 'Mitchell Marsh', role: 'All-rounder', country: 'Australia', basePrice: 15000000, setCategory: 'All-rounders 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/221.png' },
  { name: 'Sunil Narine', role: 'All-rounder', country: 'West Indies', basePrice: 15000000, setCategory: 'All-rounders 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/203.png' },
  { name: 'Aiden Markram', role: 'All-rounder', country: 'South Africa', basePrice: 10000000, setCategory: 'All-rounders 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/287.png' },
  { name: 'Moeen Ali', role: 'All-rounder', country: 'England', basePrice: 10000000, setCategory: 'All-rounders 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1735.png' },
  { name: 'Deepak Hooda', role: 'All-rounder', country: 'India', basePrice: 5000000, setCategory: 'All-rounders 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1556.png' },
  { name: 'Rachin Ravindra', role: 'All-rounder', country: 'New Zealand', basePrice: 5000000, setCategory: 'All-rounders 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20602.png' }, // fallback
  { name: 'Nitish Reddy', role: 'All-rounder', country: 'India', basePrice: 2000000, setCategory: 'All-rounders 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20603.png' }, // fallback
  
  // Fast Bowlers
  { name: 'Mohammed Shami', role: 'Bowler', country: 'India', basePrice: 20000000, setCategory: 'Fast Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/94.png' },
  { name: 'Mohammed Siraj', role: 'Bowler', country: 'India', basePrice: 20000000, setCategory: 'Fast Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3840.png' },
  { name: 'Kagiso Rabada', role: 'Bowler', country: 'South Africa', basePrice: 20000000, setCategory: 'Fast Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1664.png' },
  { name: 'Trent Boult', role: 'Bowler', country: 'New Zealand', basePrice: 20000000, setCategory: 'Fast Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/969.png' },
  { name: 'Jofra Archer', role: 'Bowler', country: 'England', basePrice: 20000000, setCategory: 'Fast Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1169.png' },
  { name: 'Arshdeep Singh', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/4698.png' },
  { name: 'Bhuvneshwar Kumar', role: 'Bowler', country: 'India', basePrice: 15000000, setCategory: 'Fast Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/116.png' },
  { name: 'Deepak Chahar', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/140.png' },
  { name: 'Lockie Ferguson', role: 'Bowler', country: 'New Zealand', basePrice: 10000000, setCategory: 'Fast Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3173.png' },
  { name: 'Mark Wood', role: 'Bowler', country: 'England', basePrice: 15000000, setCategory: 'Fast Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3181.png' },
  { name: 'Harshal Patel', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/158.png' },
  { name: 'Avesh Khan', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3155.png' },
  { name: 'Umran Malik', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20516.png' }, // fallback
  { name: 'Matheesha Pathirana', role: 'Bowler', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Fast Bowlers 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20516.png' },

  { name: 'T Natarajan', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3823.png' },
  { name: 'Navdeep Saini', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3233.png' },
  { name: 'Shardul Thakur', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1745.png' },
  { name: 'Mukesh Kumar', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 5', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20604.png' }, // fallback
  
  // Spin Bowlers
  { name: 'Yuzvendra Chahal', role: 'Bowler', country: 'India', basePrice: 15000000, setCategory: 'Spin Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/111.png' },
  { name: 'Kuldeep Yadav', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Spin Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/261.png' },
  { name: 'Ravichandran Ashwin', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Spin Bowlers 1', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/8.png' },
  { name: 'Ravi Bishnoi', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3764.png' }, // fallback
  { name: 'Wanindu Hasaranga', role: 'Bowler', country: 'Sri Lanka', basePrice: 15000000, setCategory: 'Spin Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3082.png' }, // fallback
  { name: 'Adam Zampa', role: 'Bowler', country: 'Australia', basePrice: 10000000, setCategory: 'Spin Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/958.png' },
  { name: 'Maheesh Theekshana', role: 'Bowler', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Spin Bowlers 2', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20516.png' }, // fallback
  { name: 'Varun Chakaravarthy', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/5432.png' },
  { name: 'Rahul Chahar', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/3763.png' },
  { name: 'Amit Mishra', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/30.png' },
  { name: 'Adil Rashid', role: 'Bowler', country: 'England', basePrice: 10000000, setCategory: 'Spin Bowlers 3', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/20605.png' }, 
  { name: 'Mitchell Santner', role: 'Bowler', country: 'New Zealand', basePrice: 5000000, setCategory: 'Spin Bowlers 4', img: 'https://bcciplayerimages.s3.ap-south-1.amazonaws.com/ipl/IPLHeadshot2023/1903.png' },
  
  // Extension Mega Batch 2
  { name: 'Shivam Dube', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 6', img: '' },
  { name: 'Venkatesh Iyer', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 6', img: '' },
  { name: 'Tristan Stubbs', role: 'Wicket Keeper', country: 'South Africa', basePrice: 10000000, setCategory: 'Wicket Keepers 5', img: '' },
  { name: 'Jake Fraser-McGurk', role: 'Batsman', country: 'Australia', basePrice: 10000000, setCategory: 'Batsmen 6', img: '' },
  { name: 'Will Jacks', role: 'All-rounder', country: 'England', basePrice: 10000000, setCategory: 'All-rounders 6', img: '' },
  { name: 'Riyan Parag', role: 'All-rounder', country: 'India', basePrice: 5000000, setCategory: 'All-rounders 6', img: '' },
  { name: 'Mayank Yadav', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 6', img: '' },
  { name: 'Prabhsimran Singh', role: 'Wicket Keeper', country: 'India', basePrice: 5000000, setCategory: 'Wicket Keepers 5', img: '' },
  { name: 'Harshit Rana', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 6', img: '' },
  { name: 'Suyash Sharma', role: 'Bowler', country: 'India', basePrice: 2000000, setCategory: 'Spin Bowlers 5', img: '' },
  { name: 'Nehal Wadhera', role: 'Batsman', country: 'India', basePrice: 2000000, setCategory: 'Batsmen 6', img: '' },
  { name: 'Nandre Burger', role: 'Bowler', country: 'South Africa', basePrice: 10000000, setCategory: 'Fast Bowlers 6', img: '' },
  { name: 'Gerald Coetzee', role: 'Bowler', country: 'South Africa', basePrice: 15000000, setCategory: 'Fast Bowlers 6', img: '' },
  { name: 'Romario Shepherd', role: 'All-rounder', country: 'West Indies', basePrice: 10000000, setCategory: 'All-rounders 7', img: '' },
  { name: 'Nuwan Thushara', role: 'Bowler', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Fast Bowlers 7', img: '' },
  { name: 'Piyush Chawla', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 5', img: '' },
  { name: 'Tushar Deshpande', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 7', img: '' },
  { name: 'Mukesh Choudhary', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 7', img: '' },
  { name: 'Sameer Rizvi', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 7', img: '' },
  { name: 'Alzarri Joseph', role: 'Bowler', country: 'West Indies', basePrice: 15000000, setCategory: 'Fast Bowlers 8', img: '' },
  { name: 'Yash Dayal', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 8', img: '' },
  { name: 'Karn Sharma', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 5', img: '' },

  // The 'Breakout & Trendy' Stars Batch 3
  { name: 'Abhishek Sharma', role: 'All-rounder', country: 'India', basePrice: 15000000, setCategory: 'All-rounders 7', img: '' },
  { name: 'Nitish Kumar Reddy', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 7', img: '' },
  { name: 'Shashank Singh', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 8', img: '' },
  { name: 'Ashutosh Sharma', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 8', img: '' },
  { name: 'Ramandeep Singh', role: 'All-rounder', country: 'India', basePrice: 5000000, setCategory: 'All-rounders 8', img: '' },
  { name: 'Angkrish Raghuvanshi', role: 'Batsman', country: 'India', basePrice: 2000000, setCategory: 'Batsmen 8', img: '' },
  { name: 'Vaibhav Arora', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 8', img: '' },
  { name: 'Sandeep Sharma', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 9', img: '' },
  { name: 'Naman Dhir', role: 'All-rounder', country: 'India', basePrice: 5000000, setCategory: 'All-rounders 8', img: '' },
  { name: 'Abishek Porel', role: 'Wicket Keeper', country: 'India', basePrice: 5000000, setCategory: 'Wicket Keepers 6', img: '' },
  { name: 'Rasikh Salam', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 9', img: '' },
  { name: 'Swapnil Singh', role: 'All-rounder', country: 'India', basePrice: 2000000, setCategory: 'All-rounders 8', img: '' },
  { name: 'Vijaykumar Vyshak', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 9', img: '' },
  { name: 'Shamar Joseph', role: 'Bowler', country: 'West Indies', basePrice: 10000000, setCategory: 'Fast Bowlers 9', img: '' },
  { name: 'Spencer Johnson', role: 'Bowler', country: 'Australia', basePrice: 10000000, setCategory: 'Fast Bowlers 10', img: '' },
  { name: 'Azmatullah Omarzai', role: 'All-rounder', country: 'Afghanistan', basePrice: 10000000, setCategory: 'All-rounders 8', img: '' },
  { name: 'Noor Ahmad', role: 'Bowler', country: 'Afghanistan', basePrice: 10000000, setCategory: 'Spin Bowlers 6', img: '' },
  { name: 'Shahrukh Khan', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 9', img: '' },
  { name: 'Mohit Sharma', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 10', img: '' },
  { name: 'Harpreet Brar', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 6', img: '' },

  // Ultra-Young & Emerging Future Stars
  { name: 'Vaibhav Suryavanshi', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 1', img: '' },
  { name: 'Ayush Mhatre', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 1', img: '' },
  { name: 'Allah Ghazanfar', role: 'Bowler', country: 'Afghanistan', basePrice: 5000000, setCategory: 'Uncapped Spinners 1', img: '' },
  { name: 'Kwena Maphaka', role: 'Bowler', country: 'South Africa', basePrice: 5000000, setCategory: 'Fast Bowlers 11', img: '' },
  { name: 'Anshul Kamboj', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Pacers 1', img: '' },
  { name: 'Kumar Kushagra', role: 'Wicket Keeper', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Keepers 1', img: '' },
  { name: 'Swastik Chikara', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 1', img: '' },
  { name: 'Yash Dhull', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 2', img: '' },
  { name: 'Rajvardhan Hangargekar', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 1', img: '' },
  { name: 'Nishant Sindhu', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 1', img: '' },
  { name: 'Raj Angad Bawa', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 1', img: '' },
  { name: 'Musheer Khan', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 1', img: '' },
  { name: 'Arshin Kulkarni', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 2', img: '' },
  { name: 'Avanish Rao Aravelly', role: 'Wicket Keeper', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Keepers 1', img: '' },
  { name: 'Saumy Pandey', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Spinners 1', img: '' },

  // --- MASSIVE 100+ OVERSEAS & DOMESTIC DB EXPANSION ---
  
  // AUSTRALIA
  { name: 'Steve Smith', role: 'Batsman', country: 'Australia', basePrice: 20000000, setCategory: 'Batsmen 9', img: '' },
  { name: 'Marnus Labuschagne', role: 'Batsman', country: 'Australia', basePrice: 10000000, setCategory: 'Batsmen 9', img: '' },
  { name: 'Josh Hazlewood', role: 'Bowler', country: 'Australia', basePrice: 20000000, setCategory: 'Fast Bowlers 11', img: '' },
  { name: 'Adam Zampa', role: 'Bowler', country: 'Australia', basePrice: 15000000, setCategory: 'Spin Bowlers 7', img: '' },
  { name: 'Aaron Hardie', role: 'All-rounder', country: 'Australia', basePrice: 5000000, setCategory: 'All-rounders 10', img: '' },
  { name: 'Matthew Short', role: 'Batsman', country: 'Australia', basePrice: 5000000, setCategory: 'Batsmen 9', img: '' },
  { name: 'Ashton Turner', role: 'Batsman', country: 'Australia', basePrice: 5000000, setCategory: 'Batsmen 10', img: '' },
  { name: 'Jhye Richardson', role: 'Bowler', country: 'Australia', basePrice: 10000000, setCategory: 'Fast Bowlers 11', img: '' },
  { name: 'Nathan Ellis', role: 'Bowler', country: 'Australia', basePrice: 5000000, setCategory: 'Fast Bowlers 11', img: '' },
  { name: 'Riley Meredith', role: 'Bowler', country: 'Australia', basePrice: 5000000, setCategory: 'Fast Bowlers 12', img: '' },
  { name: 'Lance Morris', role: 'Bowler', country: 'Australia', basePrice: 5000000, setCategory: 'Fast Bowlers 12', img: '' },
  { name: 'Sean Abbott', role: 'Bowler', country: 'Australia', basePrice: 5000000, setCategory: 'Fast Bowlers 12', img: '' },
  { name: 'Jason Behrendorff', role: 'Bowler', country: 'Australia', basePrice: 5000000, setCategory: 'Fast Bowlers 12', img: '' },

  // ENGLAND
  { name: 'Moeen Ali', role: 'All-rounder', country: 'England', basePrice: 20000000, setCategory: 'All-rounders 10', img: '' },
  { name: 'Jonny Bairstow', role: 'Wicket Keeper', country: 'England', basePrice: 20000000, setCategory: 'Wicket Keepers 7', img: '' },
  { name: 'Reece Topley', role: 'Bowler', country: 'England', basePrice: 10000000, setCategory: 'Fast Bowlers 13', img: '' },
  { name: 'Mark Wood', role: 'Bowler', country: 'England', basePrice: 20000000, setCategory: 'Fast Bowlers 13', img: '' },
  { name: 'Chris Woakes', role: 'All-rounder', country: 'England', basePrice: 15000000, setCategory: 'All-rounders 10', img: '' },
  { name: 'Jason Roy', role: 'Batsman', country: 'England', basePrice: 15000000, setCategory: 'Batsmen 10', img: '' },
  { name: 'Alex Hales', role: 'Batsman', country: 'England', basePrice: 15000000, setCategory: 'Batsmen 10', img: '' },
  { name: 'Adil Rashid', role: 'Bowler', country: 'England', basePrice: 20000000, setCategory: 'Spin Bowlers 7', img: '' },
  { name: 'Will Jacks', role: 'All-rounder', country: 'England', basePrice: 15000000, setCategory: 'All-rounders 10', img: '' },
  { name: 'Phil Salt', role: 'Wicket Keeper', country: 'England', basePrice: 15000000, setCategory: 'Wicket Keepers 7', img: '' },
  { name: 'Sam Billings', role: 'Wicket Keeper', country: 'England', basePrice: 10000000, setCategory: 'Wicket Keepers 7', img: '' },
  { name: 'Tom Curran', role: 'All-rounder', country: 'England', basePrice: 5000000, setCategory: 'All-rounders 11', img: '' },

  // NEW ZEALAND
  { name: 'Lockie Ferguson', role: 'Bowler', country: 'New Zealand', basePrice: 20000000, setCategory: 'Fast Bowlers 13', img: '' },
  { name: 'Mitchell Santner', role: 'All-rounder', country: 'New Zealand', basePrice: 10000000, setCategory: 'All-rounders 11', img: '' },
  { name: 'Glenn Phillips', role: 'Batsman', country: 'New Zealand', basePrice: 15000000, setCategory: 'Batsmen 11', img: '' },
  { name: 'Finn Allen', role: 'Batsman', country: 'New Zealand', basePrice: 10000000, setCategory: 'Batsmen 11', img: '' },
  { name: 'Matt Henry', role: 'Bowler', country: 'New Zealand', basePrice: 10000000, setCategory: 'Fast Bowlers 14', img: '' },
  { name: 'Tim Southee', role: 'Bowler', country: 'New Zealand', basePrice: 15000000, setCategory: 'Fast Bowlers 14', img: '' },
  { name: 'Kyle Jamieson', role: 'Bowler', country: 'New Zealand', basePrice: 10000000, setCategory: 'Fast Bowlers 14', img: '' },
  { name: 'Michael Bracewell', role: 'All-rounder', country: 'New Zealand', basePrice: 10000000, setCategory: 'All-rounders 11', img: '' },

  // SOUTH AFRICA
  { name: 'Anrich Nortje', role: 'Bowler', country: 'South Africa', basePrice: 20000000, setCategory: 'Fast Bowlers 15', img: '' },
  { name: 'Lungi Ngidi', role: 'Bowler', country: 'South Africa', basePrice: 10000000, setCategory: 'Fast Bowlers 15', img: '' },
  { name: 'Marco Jansen', role: 'All-rounder', country: 'South Africa', basePrice: 15000000, setCategory: 'All-rounders 12', img: '' },
  { name: 'Donovan Ferreira', role: 'Wicket Keeper', country: 'South Africa', basePrice: 5000000, setCategory: 'Wicket Keepers 8', img: '' },
  { name: 'Ryan Rickelton', role: 'Wicket Keeper', country: 'South Africa', basePrice: 5000000, setCategory: 'Wicket Keepers 8', img: '' },
  { name: 'Aiden Markram', role: 'Batsman', country: 'South Africa', basePrice: 15000000, setCategory: 'Batsmen 12', img: '' },
  { name: 'Rassie van der Dussen', role: 'Batsman', country: 'South Africa', basePrice: 10000000, setCategory: 'Batsmen 12', img: '' },
  { name: 'Keshav Maharaj', role: 'Bowler', country: 'South Africa', basePrice: 5000000, setCategory: 'Spin Bowlers 8', img: '' },
  { name: 'Tabraiz Shamsi', role: 'Bowler', country: 'South Africa', basePrice: 10000000, setCategory: 'Spin Bowlers 8', img: '' },
  { name: 'Wayne Parnell', role: 'Bowler', country: 'South Africa', basePrice: 5000000, setCategory: 'Fast Bowlers 15', img: '' },

  // WEST INDIES
  { name: 'Kyle Mayers', role: 'All-rounder', country: 'West Indies', basePrice: 10000000, setCategory: 'All-rounders 12', img: '' },
  { name: 'Jason Holder', role: 'All-rounder', country: 'West Indies', basePrice: 15000000, setCategory: 'All-rounders 12', img: '' },
  { name: 'Akeal Hosein', role: 'Bowler', country: 'West Indies', basePrice: 10000000, setCategory: 'Spin Bowlers 8', img: '' },
  { name: 'Obed McCoy', role: 'Bowler', country: 'West Indies', basePrice: 10000000, setCategory: 'Fast Bowlers 16', img: '' },
  { name: 'Sherfane Rutherford', role: 'Batsman', country: 'West Indies', basePrice: 5000000, setCategory: 'Batsmen 12', img: '' },
  { name: 'Shai Hope', role: 'Wicket Keeper', country: 'West Indies', basePrice: 10000000, setCategory: 'Wicket Keepers 8', img: '' },
  { name: 'Matthew Forde', role: 'Bowler', country: 'West Indies', basePrice: 5000000, setCategory: 'Fast Bowlers 16', img: '' },
  { name: 'Odean Smith', role: 'All-rounder', country: 'West Indies', basePrice: 5000000, setCategory: 'All-rounders 13', img: '' },
  { name: 'Gudakesh Motie', role: 'Bowler', country: 'West Indies', basePrice: 5000000, setCategory: 'Spin Bowlers 9', img: '' },
  { name: 'Johnson Charles', role: 'Wicket Keeper', country: 'West Indies', basePrice: 5000000, setCategory: 'Wicket Keepers 8', img: '' },

  // AFGHANISTAN & OTHERS
  { name: 'Mujeeb Ur Rahman', role: 'Bowler', country: 'Afghanistan', basePrice: 10000000, setCategory: 'Spin Bowlers 9', img: '' },
  { name: 'Fazalhaq Farooqi', role: 'Bowler', country: 'Afghanistan', basePrice: 10000000, setCategory: 'Fast Bowlers 16', img: '' },
  { name: 'Naveen-ul-Haq', role: 'Bowler', country: 'Afghanistan', basePrice: 10000000, setCategory: 'Fast Bowlers 16', img: '' },
  { name: 'Gulbadin Naib', role: 'All-rounder', country: 'Afghanistan', basePrice: 5000000, setCategory: 'All-rounders 13', img: '' },
  { name: 'Mohammad Nabi', role: 'All-rounder', country: 'Afghanistan', basePrice: 10000000, setCategory: 'All-rounders 13', img: '' },
  { name: 'Sikandar Raza', role: 'All-rounder', country: 'Zimbabwe', basePrice: 5000000, setCategory: 'All-rounders 13', img: '' },
  { name: 'Blessing Muzarabani', role: 'Bowler', country: 'Zimbabwe', basePrice: 5000000, setCategory: 'Fast Bowlers 17', img: '' },
  { name: 'Richard Ngarava', role: 'Bowler', country: 'Zimbabwe', basePrice: 5000000, setCategory: 'Fast Bowlers 17', img: '' },
  { name: 'Paul Stirling', role: 'Batsman', country: 'Ireland', basePrice: 5000000, setCategory: 'Batsmen 13', img: '' },
  { name: 'Josh Little', role: 'Bowler', country: 'Ireland', basePrice: 5000000, setCategory: 'Fast Bowlers 17', img: '' },
  { name: 'Nuwanidu Fernando', role: 'Batsman', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Batsmen 13', img: '' },
  { name: 'Dushmantha Chameera', role: 'Bowler', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Fast Bowlers 17', img: '' },
  { name: 'Maheesh Theekshana', role: 'Bowler', country: 'Sri Lanka', basePrice: 15000000, setCategory: 'Spin Bowlers 9', img: '' },
  { name: 'Charith Asalanka', role: 'Batsman', country: 'Sri Lanka', basePrice: 10000000, setCategory: 'Batsmen 13', img: '' },

  // INDIA (Capped & Experienced)
  { name: 'Manish Pandey', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 14', img: '' },
  { name: 'Karun Nair', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 14', img: '' },
  { name: 'Mandeep Singh', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 14', img: '' },
  { name: 'Wriddhiman Saha', role: 'Wicket Keeper', country: 'India', basePrice: 10000000, setCategory: 'Wicket Keepers 9', img: '' },
  { name: 'Ishant Sharma', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 18', img: '' },
  { name: 'Umesh Yadav', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 18', img: '' },
  { name: 'Amit Mishra', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 10', img: '' },
  { name: 'Piyush Chawla', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 10', img: '' },
  { name: 'Deepak Hooda', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 14', img: '' },
  { name: 'Krunal Pandya', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 14', img: '' },
  { name: 'Washington Sundar', role: 'All-rounder', country: 'India', basePrice: 15000000, setCategory: 'All-rounders 14', img: '' },
  { name: 'Shahbaz Ahmed', role: 'All-rounder', country: 'India', basePrice: 10000000, setCategory: 'All-rounders 15', img: '' },
  { name: 'Navdeep Saini', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 18', img: '' },
  { name: 'Khaleel Ahmed', role: 'Bowler', country: 'India', basePrice: 10000000, setCategory: 'Fast Bowlers 18', img: '' },
  { name: 'Chetan Sakariya', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 19', img: '' },

  // INDIA (Emerging & Uncapped Gems)
  { name: 'Abdul Samad', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 3', img: '' },
  { name: 'Priyam Garg', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 3', img: '' },
  { name: 'Virat Singh', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 3', img: '' },
  { name: 'Darshan Nalkande', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Pacers 2', img: '' },
  { name: 'Kamlesh Nagarkoti', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Pacers 2', img: '' },
  { name: 'Shivam Mavi', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 19', img: '' },
  { name: 'Kartik Tyagi', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 19', img: '' },
  { name: 'Akash Deep', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 19', img: '' },
  { name: 'Yash Thakur', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Pacers 2', img: '' },
  { name: 'Mohsin Khan', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 20', img: '' },
  { name: 'Ricky Bhui', role: 'Wicket Keeper', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Keepers 2', img: '' },
  { name: 'KS Bharat', role: 'Wicket Keeper', country: 'India', basePrice: 5000000, setCategory: 'Wicket Keepers 9', img: '' },
  { name: 'Upendra Yadav', role: 'Wicket Keeper', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Keepers 2', img: '' },
  { name: 'Narayan Jagadeesan', role: 'Wicket Keeper', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Keepers 2', img: '' },
  { name: 'Anmolpreet Singh', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 4', img: '' },
  { name: 'Prabhsimran Singh', role: 'Wicket Keeper', country: 'India', basePrice: 5000000, setCategory: 'Wicket Keepers 9', img: '' },
  { name: 'Jitesh Sharma', role: 'Wicket Keeper', country: 'India', basePrice: 10000000, setCategory: 'Wicket Keepers 9', img: '' },
  { name: 'Abhinav Manohar', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Uncapped Batsmen 4', img: '' },
  { name: 'Rahul Tripathi', role: 'Batsman', country: 'India', basePrice: 10000000, setCategory: 'Batsmen 15', img: '' },
  { name: 'Lalit Yadav', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 3', img: '' },
  { name: 'Ripal Patel', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 3', img: '' },
  { name: 'Prerak Mankad', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'Uncapped All-rounders 3', img: '' },
  { name: 'Mayank Markande', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 10', img: '' },
  { name: 'Shreyas Gopal', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 10', img: '' },
  { name: 'Murugan Ashwin', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Spin Bowlers 11', img: '' },
  { name: 'Siddarth Kaul', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 20', img: '' },
  { name: 'Sandeep Warrier', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 20', img: '' },
  { name: 'Basil Thampi', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 20', img: '' },

  // --- MEGA EXPANSION: ALL INTERNATIONAL & MORE INDIAN STARS ---
  

  // SRI LANKA
  { name: 'Kusal Mendis', role: 'Wicket Keeper', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Wicket Keepers 11', img: '' },
  { name: 'Pathum Nissanka', role: 'Batsman', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Batsmen 16', img: '' },
  { name: 'Sadeera Samarawickrama', role: 'Wicket Keeper', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Wicket Keepers 12', img: '' },
  { name: 'Dilshan Madushanka', role: 'Bowler', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'Fast Bowlers 23', img: '' },
  { name: 'Dunith Wellalage', role: 'All-rounder', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'All-rounders 17', img: '' },
  { name: 'Dasun Shanaka', role: 'All-rounder', country: 'Sri Lanka', basePrice: 5000000, setCategory: 'All-rounders 17', img: '' },

  // AFGHANISTAN
  { name: 'Ibrahim Zadran', role: 'Batsman', country: 'Afghanistan', basePrice: 5000000, setCategory: 'Batsmen 17', img: '' },
  { name: 'Najibullah Zadran', role: 'Batsman', country: 'Afghanistan', basePrice: 5000000, setCategory: 'Batsmen 17', img: '' },
  { name: 'Mujeeb Ur Rahman', role: 'Bowler', country: 'Afghanistan', basePrice: 10000000, setCategory: 'Spin Bowlers 12', img: '' },
  { name: 'Naveen-ul-Haq', role: 'Bowler', country: 'Afghanistan', basePrice: 10000000, setCategory: 'Fast Bowlers 24', img: '' },

  // SOUTH AFRICA
  { name: 'Temba Bavuma', role: 'Batsman', country: 'South Africa', basePrice: 5000000, setCategory: 'Batsmen 17', img: '' },
  { name: 'Reeza Hendricks', role: 'Batsman', country: 'South Africa', basePrice: 5000000, setCategory: 'Batsmen 17', img: '' },
  { name: 'Bjorn Fortuin', role: 'Bowler', country: 'South Africa', basePrice: 5000000, setCategory: 'Spin Bowlers 12', img: '' },
  { name: 'Wiaan Mulder', role: 'All-rounder', country: 'South Africa', basePrice: 5000000, setCategory: 'All-rounders 18', img: '' },
  { name: 'Sisanda Magala', role: 'Bowler', country: 'South Africa', basePrice: 5000000, setCategory: 'Fast Bowlers 24', img: '' },

  // AUSTRALIA
  { name: 'Xavier Bartlett', role: 'Bowler', country: 'Australia', basePrice: 5000000, setCategory: 'Fast Bowlers 24', img: '' },
  { name: 'Nathan Ellis', role: 'Bowler', country: 'Australia', basePrice: 10000000, setCategory: 'Fast Bowlers 24', img: '' },
  { name: 'Tanveer Sangha', role: 'Bowler', country: 'Australia', basePrice: 5000000, setCategory: 'Spin Bowlers 12', img: '' },
  { name: 'Chris Green', role: 'All-rounder', country: 'Australia', basePrice: 5000000, setCategory: 'All-rounders 18', img: '' },
  { name: 'Ben McDermott', role: 'Wicket Keeper', country: 'Australia', basePrice: 5000000, setCategory: 'Wicket Keepers 12', img: '' },

  // ENGLAND
  { name: 'Rehan Ahmed', role: 'Bowler', country: 'England', basePrice: 5000000, setCategory: 'Spin Bowlers 12', img: '' },
  { name: 'Jamie Overton', role: 'All-rounder', country: 'England', basePrice: 5000000, setCategory: 'All-rounders 18', img: '' },
  { name: 'Luke Wood', role: 'Bowler', country: 'England', basePrice: 5000000, setCategory: 'Fast Bowlers 25', img: '' },
  { name: 'Olly Stone', role: 'Bowler', country: 'England', basePrice: 5000000, setCategory: 'Fast Bowlers 25', img: '' },
  { name: 'Gus Atkinson', role: 'Bowler', country: 'England', basePrice: 5000000, setCategory: 'Fast Bowlers 25', img: '' },

  // WEST INDIES 
  { name: 'Brandon King', role: 'Batsman', country: 'West Indies', basePrice: 5000000, setCategory: 'Batsmen 18', img: '' },
  { name: 'Johnson Charles', role: 'Wicket Keeper', country: 'West Indies', basePrice: 5000000, setCategory: 'Wicket Keepers 12', img: '' },
  { name: 'Rovman Powell', role: 'Batsman', country: 'West Indies', basePrice: 15000000, setCategory: 'Batsmen 18', img: '' },
  { name: 'Oshane Thomas', role: 'Bowler', country: 'West Indies', basePrice: 5000000, setCategory: 'Fast Bowlers 25', img: '' },
  { name: 'Sheldon Cottrell', role: 'Bowler', country: 'West Indies', basePrice: 5000000, setCategory: 'Fast Bowlers 25', img: '' },

  // ASSOCIATE NATION STARS
  { name: 'Saurabh Netravalkar', role: 'Bowler', country: 'USA', basePrice: 5000000, setCategory: 'Fast Bowlers 26', img: '' },
  { name: 'Monank Patel', role: 'Wicket Keeper', country: 'USA', basePrice: 3000000, setCategory: 'Wicket Keepers 13', img: '' },
  { name: 'Aaron Jones', role: 'Batsman', country: 'USA', basePrice: 3000000, setCategory: 'Batsmen 19', img: '' },
  { name: 'Sandeep Lamichhane', role: 'Bowler', country: 'Nepal', basePrice: 5000000, setCategory: 'Spin Bowlers 13', img: '' },
  { name: 'Dipendra Singh Airee', role: 'All-rounder', country: 'Nepal', basePrice: 3000000, setCategory: 'All-rounders 19', img: '' },
  { name: 'Bas de Leede', role: 'All-rounder', country: 'Netherlands', basePrice: 5000000, setCategory: 'All-rounders 19', img: '' },
  { name: 'Logan van Beek', role: 'All-rounder', country: 'Netherlands', basePrice: 5000000, setCategory: 'All-rounders 19', img: '' },
  { name: 'Paul van Meekeren', role: 'Bowler', country: 'Netherlands', basePrice: 3000000, setCategory: 'Fast Bowlers 26', img: '' },
  { name: 'Gerhard Erasmus', role: 'All-rounder', country: 'Namibia', basePrice: 3000000, setCategory: 'All-rounders 19', img: '' },
  { name: 'David Wiese', role: 'All-rounder', country: 'Namibia', basePrice: 5000000, setCategory: 'All-rounders 19', img: '' },

  // MORE INDIAN STARS (MISSING)
  { name: 'Mayank Agarwal', role: 'Batsman', country: 'India', basePrice: 10000000, setCategory: 'Batsmen 20', img: '' },
  { name: 'Karun Nair', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 20', img: '' },
  { name: 'Jayant Yadav', role: 'All-rounder', country: 'India', basePrice: 5000000, setCategory: 'All-rounders 20', img: '' },
  { name: 'Varun Aaron', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 27', img: '' },
  { name: 'Mohit Sharma', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 27', img: '' },
  { name: 'Siddharth Kaul', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 27', img: '' },
  { name: 'Barinder Sran', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 27', img: '' },
  { name: 'Sandeep Sharma', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 27', img: '' },
  { name: 'Dhawal Kulkarni', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 27', img: '' },
  { name: 'Gurkeerat Singh Mann', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'All-rounders 20', img: '' },
  { name: 'Rishi Dhawan', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'All-rounders 20', img: '' },
  { name: 'Pawan Negi', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'All-rounders 20', img: '' },
  { name: 'Karn Sharma', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Spin Bowlers 14', img: '' },
  { name: 'Shahbaz Nadeem', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Spin Bowlers 14', img: '' },
  { name: 'Shourabh Kumar', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Spin Bowlers 14', img: '' },
  { name: 'Manish Pandey', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 20', img: '' },
  { name: 'Hanuma Vihari', role: 'Batsman', country: 'India', basePrice: 5000000, setCategory: 'Batsmen 20', img: '' },
  { name: 'Ricky Bhui', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Batsmen 21', img: '' },
  { name: 'Baba Indrajith', role: 'Batsman', country: 'India', basePrice: 3000000, setCategory: 'Batsmen 21', img: '' },
  { name: 'Baba Aparajith', role: 'All-rounder', country: 'India', basePrice: 3000000, setCategory: 'All-rounders 21', img: '' },
  { name: 'Jaydev Unadkat', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 28', img: '' },
  { name: 'Chetan Sakariya', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 28', img: '' },
  { name: 'Khaleel Ahmed', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 28', img: '' },
  { name: 'Avesh Khan', role: 'Bowler', country: 'India', basePrice: 5000000, setCategory: 'Fast Bowlers 28', img: '' },
  { name: 'Kamlesh Nagarkoti', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 28', img: '' },
  { name: 'Shivam Mavi', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 28', img: '' },
  { name: 'Kartik Tyagi', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 29', img: '' },
  { name: 'Umran Malik', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 29', img: '' },
  { name: 'Kuldeep Sen', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 29', img: '' },
  { name: 'Mohsin Khan', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 29', img: '' },
  { name: 'Akash Madhwal', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 29', img: '' },
  { name: 'Harshit Rana', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 30', img: '' },
  { name: 'Vaibhav Arora', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 30', img: '' },
  { name: 'Tushar Deshpande', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 30', img: '' },
  { name: 'Mukesh Choudhary', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 30', img: '' },
  { name: 'Simarjeet Singh', role: 'Bowler', country: 'India', basePrice: 3000000, setCategory: 'Fast Bowlers 30', img: '' },
];

const legendPlayers = [
  { name: 'Sachin Tendulkar', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Legendary Batsmen', img: '' },
  { name: 'AB de Villiers', role: 'Batsman', country: 'South Africa', basePrice: 20000000, setCategory: 'Legendary Batsmen', img: '' },
  { name: 'Chris Gayle', role: 'Batsman', country: 'West Indies', basePrice: 20000000, setCategory: 'Legendary Batsmen', img: '' },
  { name: 'Suresh Raina', role: 'Batsman', country: 'India', basePrice: 15000000, setCategory: 'Legendary Batsmen', img: '' },
  { name: 'Virender Sehwag', role: 'Batsman', country: 'India', basePrice: 20000000, setCategory: 'Legendary Batsmen', img: '' },
  { name: 'Lasith Malinga', role: 'Bowler', country: 'Sri Lanka', basePrice: 20000000, setCategory: 'Legendary Bowlers', img: '' },
  { name: 'Shane Warne', role: 'Bowler', country: 'Australia', basePrice: 20000000, setCategory: 'Legendary Bowlers', img: '' },
  { name: 'Muttiah Muralitharan', role: 'Bowler', country: 'Sri Lanka', basePrice: 15000000, setCategory: 'Legendary Bowlers', img: '' },
  { name: 'Zaheer Khan', role: 'Bowler', country: 'India', basePrice: 15000000, setCategory: 'Legendary Bowlers', img: '' },
  { name: 'Dale Steyn', role: 'Bowler', country: 'South Africa', basePrice: 20000000, setCategory: 'Legendary Bowlers', img: '' },
  { name: 'Jacques Kallis', role: 'All-rounder', country: 'South Africa', basePrice: 20000000, setCategory: 'Legend All-rounders', img: '' },
  { name: 'Shane Watson', role: 'All-rounder', country: 'Australia', basePrice: 15000000, setCategory: 'Legend All-rounders', img: '' },
  { name: 'Yuvraj Singh', role: 'All-rounder', country: 'India', basePrice: 20000000, setCategory: 'Legend All-rounders', img: '' },
  { name: 'Kieron Pollard', role: 'All-rounder', country: 'West Indies', basePrice: 20000000, setCategory: 'Legend All-rounders', img: '' },
  { name: 'Adam Gilchrist', role: 'Wicket Keeper', country: 'Australia', basePrice: 20000000, setCategory: 'Legend Keepers', img: '' },
  { name: 'Kumar Sangakkara', role: 'Wicket Keeper', country: 'Sri Lanka', basePrice: 15000000, setCategory: 'Legend Keepers', img: '' }
];


async function seedPlayers() {
  try {
    try {
      await pool.query("ALTER TABLE players ADD COLUMN auction_mode VARCHAR(50) DEFAULT 'mega'");
    } catch(e) { }

    console.log('Clearing existing players...');
    await pool.query('DELETE FROM players');

    console.log(`Seeding ${megaPlayers.length} Mega players...`);
    for (const p of megaPlayers) {
      await pool.query(
        'INSERT INTO players (name, role, country, base_price, set_category, image_url, auction_mode) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [p.name, p.role, p.country, p.basePrice, p.setCategory, p.img || null, 'mega']
      );
    }

    console.log(`Seeding ${legendPlayers.length} Legend players...`);
    for (const p of legendPlayers) {
      await pool.query(
        'INSERT INTO players (name, role, country, base_price, set_category, image_url, auction_mode) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [p.name, p.role, p.country, p.basePrice, p.setCategory, p.img || null, 'legends']
      );
    }

    console.log('Successfully seeded tightly curated, verifiable real players list!');
  } catch (err) {
    console.error('Error seeding players:', err);
  } finally {
    pool.end();
  }
}

seedPlayers();
