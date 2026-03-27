CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    username VARCHAR(100) NOT NULL,
    team VARCHAR(20) NOT NULL
);

CREATE TABLE IF NOT EXISTS rooms (
    id VARCHAR(50) PRIMARY KEY,
    host_id VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'waiting',
    privacy VARCHAR(20) DEFAULT 'public',
    mode VARCHAR(50) DEFAULT 'mega'
);

CREATE TABLE IF NOT EXISTS auction_settings (
    room_id VARCHAR(50) PRIMARY KEY,
    purse_money BIGINT DEFAULT 1200000000,
    bid_timer INT DEFAULT 15,
    min_squad INT DEFAULT 18,
    max_squad INT DEFAULT 25,
    max_overseas INT DEFAULT 8
);

CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    role VARCHAR(50),
    country VARCHAR(50),
    base_price BIGINT NOT NULL,
    set_category VARCHAR(50),
    image_url VARCHAR(255),
    auction_mode VARCHAR(50) DEFAULT 'mega'
);

CREATE TABLE IF NOT EXISTS room_participants (
    room_id VARCHAR(50),
    user_id VARCHAR(50),
    is_host BOOLEAN DEFAULT false,
    purse_balance BIGINT DEFAULT 1200000000,
    PRIMARY KEY (room_id, user_id)
);

CREATE TABLE IF NOT EXISTS bids (
    id SERIAL PRIMARY KEY,
    room_id VARCHAR(50),
    player_id INT,
    user_id VARCHAR(50),
    amount BIGINT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS team_squads (
    room_id VARCHAR(50),
    user_id VARCHAR(50),
    player_id INT,
    bought_price BIGINT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (room_id, player_id)
);

CREATE TABLE IF NOT EXISTS auction_state (
    room_id VARCHAR(50),
    player_id INT,
    current_bid BIGINT NOT NULL,
    highest_bidder VARCHAR(50),
    status VARCHAR(20) DEFAULT 'pending',
    order_index INT,
    PRIMARY KEY (room_id, player_id)
);
