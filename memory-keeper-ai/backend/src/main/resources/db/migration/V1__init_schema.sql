-- src/main/resources/db/migration/V1__init_schema.sql

-- Users Table
CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       email VARCHAR(255) UNIQUE NOT NULL,
                       password VARCHAR(255) NOT NULL,
                       name VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL DEFAULT 'GRANDPARENT',
                       avatar_url TEXT,
                       bio TEXT,
                       date_of_birth DATE,
                       location VARCHAR(255),
                       streak_count INT DEFAULT 0,
                       total_stories INT DEFAULT 0,
                       is_active BOOLEAN DEFAULT true,
                       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                       updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Families Table
CREATE TABLE families (
                          id BIGSERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          description TEXT,
                          created_by BIGINT REFERENCES users(id),
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Family Members (Join Table)
CREATE TABLE family_members (
                                family_id BIGINT REFERENCES families(id) ON DELETE CASCADE,
                                user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                                role VARCHAR(50) DEFAULT 'MEMBER',
                                joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                PRIMARY KEY (family_id, user_id)
);

-- Stories Table
CREATE TABLE stories (
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
                         sentiment_score DECIMAL(3,2),  -- -1 to 1
                         sentiment_label VARCHAR(50),   -- positive, negative, neutral
                         word_count INT,
                         duration_seconds INT,
                         is_public BOOLEAN DEFAULT false,
                         is_featured BOOLEAN DEFAULT false,
                         views_count INT DEFAULT 0,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                         updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags Table
CREATE TABLE tags (
                      id BIGSERIAL PRIMARY KEY,
                      name VARCHAR(100) UNIQUE NOT NULL,
                      category VARCHAR(50),
                      usage_count INT DEFAULT 0,
                      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Story Tags (Join Table)
CREATE TABLE story_tags (
                            story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
                            tag_id BIGINT REFERENCES tags(id) ON DELETE CASCADE,
                            PRIMARY KEY (story_id, tag_id)
);

-- Emotions Table
CREATE TABLE emotions (
                          id BIGSERIAL PRIMARY KEY,
                          story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
                          emotion_type VARCHAR(50) NOT NULL,
                          confidence DECIMAL(3,2),  -- 0 to 1
                          timestamp_seconds INT,    -- Where in audio this emotion was detected
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reactions Table
CREATE TABLE reactions (
                           id BIGSERIAL PRIMARY KEY,
                           story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
                           user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                           reaction_type VARCHAR(50) NOT NULL,  -- HEART, SMILE, CRY, etc.
                           created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                           UNIQUE(story_id, user_id, reaction_type)
);

-- Comments Table
CREATE TABLE comments (
                          id BIGSERIAL PRIMARY KEY,
                          story_id BIGINT REFERENCES stories(id) ON DELETE CASCADE,
                          user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                          parent_id BIGINT REFERENCES comments(id) ON DELETE CASCADE,  -- For nested comments
                          content TEXT NOT NULL,
                          is_edited BOOLEAN DEFAULT false,
                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Time Capsules Table (Messages for future)
CREATE TABLE time_capsules (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                               recipient_email VARCHAR(255),
                               title VARCHAR(255) NOT NULL,
                               message TEXT NOT NULL,
                               audio_url TEXT,
                               video_url TEXT,
                               delivery_date DATE NOT NULL,
                               event_type VARCHAR(50),  -- WEDDING, BIRTHDAY, GRADUATION, etc.
                               is_delivered BOOLEAN DEFAULT false,
                               delivered_at TIMESTAMP,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Prompts Table (Daily memory prompts)
CREATE TABLE prompts (
                         id BIGSERIAL PRIMARY KEY,
                         content TEXT NOT NULL,
                         category VARCHAR(50),
                         difficulty VARCHAR(50),  -- EASY, MEDIUM, HARD
                         is_active BOOLEAN DEFAULT true,
                         usage_count INT DEFAULT 0,
                         created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User Activity Log
CREATE TABLE activity_logs (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                               activity_type VARCHAR(50) NOT NULL,  -- STORY_CREATED, COMMENT_ADDED, etc.
                               metadata JSONB,
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- AI Chat History (for chatbot)
CREATE TABLE chat_messages (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                               grandparent_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
                               message TEXT NOT NULL,
                               response TEXT NOT NULL,
                               is_helpful BOOLEAN,  -- User feedback
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for Performance
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_family_id ON stories(family_id);
CREATE INDEX idx_stories_category ON stories(category);
CREATE INDEX idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX idx_comments_story_id ON comments(story_id);
CREATE INDEX idx_reactions_story_id ON reactions(story_id);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX idx_activity_logs_created_at ON activity_logs(created_at DESC);

-- Full-Text Search Index
CREATE INDEX idx_stories_search ON stories USING GIN(to_tsvector('english', title || ' ' || transcript || ' ' || COALESCE(enhanced_story, '')));