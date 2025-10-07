-- Создание таблиц для управления серверами, игроками и платежами

-- Таблица игроков
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    nickname VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'normal',
    has_donate BOOLEAN DEFAULT false,
    has_op BOOLEAN DEFAULT false,
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    banned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица тарифов
CREATE TABLE IF NOT EXISTS tariffs (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    disk_space_gb INTEGER NOT NULL,
    ram_gb INTEGER NOT NULL,
    cpu_percent INTEGER NOT NULL,
    max_players INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица платежей
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    transaction_id VARCHAR(255) UNIQUE,
    player_nickname VARCHAR(255),
    tariff_id INTEGER REFERENCES tariffs(id),
    amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Таблица загруженных сборок
CREATE TABLE IF NOT EXISTS server_builds (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(100),
    file_url TEXT,
    uploaded_by VARCHAR(255),
    file_size_mb DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Вставка тестовых игроков
INSERT INTO players (nickname, status, has_donate, has_op, is_banned) 
VALUES 
    ('Steve', 'normal', false, false, false),
    ('Alex', 'normal', true, false, false),
    ('Herobrine', 'normal', false, true, false)
ON CONFLICT (nickname) DO NOTHING;

-- Вставка нового тарифа "ВСЁ или НИЧЕГО"
INSERT INTO tariffs (name, description, price, disk_space_gb, ram_gb, cpu_percent, max_players, is_active)
VALUES 
    ('ВСЁ или НИЧЕГО', 'Максимальный тариф с неограниченными возможностями', 5999.00, 999, 999, 90, 999, true)
ON CONFLICT DO NOTHING;