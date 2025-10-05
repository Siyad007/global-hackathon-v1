-- src/main/resources/db/migration/V4__update_emotion_reaction_enums.sql

-- This script now ONLY alters existing table columns.
-- All index creation has been moved to V2__add_indexes.sql to prevent conflicts.

-- Update emotion_type column to use enum values as strings
ALTER TABLE emotions
ALTER COLUMN emotion_type TYPE VARCHAR(50);

-- Update reaction_type column to use enum values as strings
ALTER TABLE reactions
ALTER COLUMN reaction_type TYPE VARCHAR(50);