-- src/main/resources/db/migration/V2__add_indexes.sql

-- This file now contains ALL index creation logic.
-- The "IF NOT EXISTS" clause makes it safe to run even if the database is in a partial state.

-- User Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Story Indexes
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_family_id ON stories(family_id);
CREATE INDEX IF NOT EXISTS idx_stories_category ON stories(category);
CREATE INDEX IF NOT EXISTS idx_stories_created_at ON stories(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_is_public ON stories(is_public);
CREATE INDEX IF NOT EXISTS idx_stories_sentiment_label ON stories(sentiment_label);

-- Comment Indexes
CREATE INDEX IF NOT EXISTS idx_comments_story_id ON comments(story_id);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);
CREATE INDEX IF NOT EXISTS idx_comments_parent_id ON comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);

-- Reaction Indexes
CREATE INDEX IF NOT EXISTS idx_reactions_story_id ON reactions(story_id);
CREATE INDEX IF NOT EXISTS idx_reactions_user_id ON reactions(user_id);
CREATE INDEX IF NOT EXISTS idx_reactions_type ON reactions(reaction_type); -- Consolidated from V4

-- Tag Indexes
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);
CREATE INDEX IF NOT EXISTS idx_tags_usage_count ON tags(usage_count DESC);

-- Emotion Indexes
CREATE INDEX IF NOT EXISTS idx_emotions_story_id ON emotions(story_id);
CREATE INDEX IF NOT EXISTS idx_emotions_type ON emotions(emotion_type); -- Consolidated from V4

-- Chat Message Indexes
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_grandparent_id ON chat_messages(grandparent_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);

-- Time Capsule Indexes
CREATE INDEX IF NOT EXISTS idx_time_capsules_user_id ON time_capsules(user_id);
CREATE INDEX IF NOT EXISTS idx_time_capsules_delivery_date ON time_capsules(delivery_date);
CREATE INDEX IF NOT EXISTS idx_time_capsules_is_delivered ON time_capsules(is_delivered);

-- Full-Text Search Index for Stories
CREATE INDEX IF NOT EXISTS idx_stories_search ON stories USING GIN(
    to_tsvector('english',
        COALESCE(title, '') || ' ' ||
        COALESCE(transcript, '') || ' ' ||
        COALESCE(enhanced_story, '')
    )
);

-- Composite Indexes for Common Queries
CREATE INDEX IF NOT EXISTS idx_stories_user_created ON stories(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_stories_public_created ON stories(is_public, created_at DESC) WHERE is_public = true;