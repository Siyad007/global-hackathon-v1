-- V4__update_emotion_reaction_enums.sql

-- Update emotion_type column to use enum values
ALTER TABLE emotions
ALTER COLUMN emotion_type TYPE VARCHAR(50);

COMMENT ON COLUMN emotions.emotion_type IS 'EmotionType enum: JOY, SADNESS, ANGER, FEAR, SURPRISE, LOVE, etc.';

-- Update reaction_type column to use enum values
ALTER TABLE reactions
ALTER COLUMN reaction_type TYPE VARCHAR(50);

COMMENT ON COLUMN reactions.reaction_type IS 'ReactionType enum: HEART, SMILE, CRY, LAUGH, WOW, etc.';

-- Add indexes for better performance
CREATE INDEX idx_emotions_type ON emotions(emotion_type);
CREATE INDEX idx_reactions_type ON reactions(reaction_type);