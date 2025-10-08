-- src/main/resources/db/migration/V1__create_initial_schema.sql

-- This single file creates the entire database schema from scratch.

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'GRANDPARENT',
    avatar_url TEXT,
    bio TEXT,
    date_of_birth DATE,
    location VARCHAR(255),
    family_id BIGINT REFERENCES families(id) ON DELETE SET NULL,
    streak_count INT NOT NULL DEFAULT 0,
    total_stories INT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Families Table
CREATE TABLE IF NOT EXISTS families (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    invite_code VARCHAR(20) UNIQUE,
    created_by BIGINT REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family Members (Join Table)
CREATE TABLE IF NOT EXISTS family_members (
    family_id BIGINT REFERENCES families(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'MEMBER',
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (family_id, user_id)
);

-- Stories Table
CREATE TABLE IF NOT EXISTS stories (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    family_id BIGINT REFERENCES families(id) ON DELETE SET NULL,
    title VARCHAR(500) NOT NULL,
    transcript TEXT NOT NULL,
    enhanced_story TEXT,
    summary TEXT,
    audio_url TEXT,
    image_url TEXT,
    category VARCHAR(50),
    sentiment_score DECIMAL(3,2),
    sentiment_label VARCHAR(50),
    word_count INT,
    duration_seconds INT,
    is_public BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    views_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags Table
CREATE TABLE IF NOT EXISTS tags (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    usage_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Story Tags (Join Table)
CREATE TABLE IF NOT EXISTS story_tags (
    story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
    tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (story_id, tag_id)
);

-- Emotions Table
CREATE TABLE IF NOT EXISTS emotions (
    id BIGSERIAL PRIMARY KEY,
    story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
    emotion_type VARCHAR(50) NOT NULL,
    confidence DECIMAL(3,2),
    timestamp_seconds INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reactions Table
CREATE TABLE IF NOT EXISTS reactions (
    id BIGSERIAL PRIMARY KEY,
    story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    reaction_type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, user_id, reaction_type)
);

-- Comments Table
CREATE TABLE IF NOT EXISTS comments (
    id BIGSERIAL PRIMARY KEY,
    story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_edited BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time Capsules Table
CREATE TABLE IF NOT EXISTS time_capsules (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    recipient_email VARCHAR(255),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    audio_url TEXT,
    video_url TEXT,
    delivery_date DATE NOT NULL,
    event_type VARCHAR(50),
    is_delivered BOOLEAN DEFAULT false,
    delivered_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompts Table
CREATE TABLE IF NOT EXISTS prompts (
    id BIGSERIAL PRIMARY KEY,
    content TEXT NOT NULL,
    category VARCHAR(50),
    difficulty VARCHAR(50),
    is_active BOOLEAN DEFAULT true,
    usage_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Chat Messages Table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    grandparent_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    is_helpful BOOLEAN,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index Creation
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON comments(story_id);
CREATE INDEX IF NOT EXISTS idx_reactions_story_id ON reactions(story_id);
CREATE INDEX IF NOT EXISTS idx_emotions_story_id ON emotions(story_id);
CREATE INDEX IF NOT EXISTS idx_stories_search ON stories USING GIN(to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(transcript, '') || ' ' || COALESCE(enhanced_story, '')));

-- Seed Default Prompts
INSERT INTO prompts (content, category, difficulty) VALUES
('What was your favorite meal as a child?', 'CHILDHOOD', 'EASY'),
('Describe your first day at school.', 'CHILDHOOD', 'EASY'),
('How did you meet your spouse?', 'LOVE', 'MEDIUM'),
('Tell me about your first job.', 'CAREER', 'MEDIUM'),
('What is the most important lesson life has taught you?', 'WISDOM', 'HARD')
ON CONFLICT (id) DO NOTHING;

-- Seed Default Tags
INSERT INTO tags (name, category) VALUES
('childhood', 'LIFE_STAGE'), ('love', 'RELATIONSHIP'), ('career', 'LIFE_STAGE'), ('family', 'THEME'), ('wisdom', 'THEME')
ON CONFLICT (name) DO NOTHING;