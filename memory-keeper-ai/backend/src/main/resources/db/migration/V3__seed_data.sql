-- src/main/resources/db/migration/V3__seed_data.sql

-- Seed Default Prompts
INSERT INTO prompts (content, category, difficulty, is_active) VALUES
-- Childhood
('What was your favorite meal as a child, and who made it?', 'CHILDHOOD', 'EASY', true),
('Describe your first day at school. What do you remember?', 'CHILDHOOD', 'EASY', true),
('What games did you play as a child? Who did you play with?', 'CHILDHOOD', 'EASY', true),
('Tell me about the house you grew up in. Which room was your favorite?', 'CHILDHOOD', 'MEDIUM', true),
('What was the best birthday you ever had as a child?', 'CHILDHOOD', 'EASY', true),

-- Family
('Tell me about a family tradition that was special to you.', 'FAMILY', 'MEDIUM', true),
('Describe a typical Sunday with your family growing up.', 'FAMILY', 'EASY', true),
('What values did your parents teach you that you still hold today?', 'FAMILY', 'HARD', true),
('Tell me about your siblings. What were they like?', 'FAMILY', 'MEDIUM', true),
('What is your earliest memory of your grandparents?', 'FAMILY', 'MEDIUM', true),

-- Love
('How did you meet your spouse? Tell me everything.', 'LOVE', 'MEDIUM', true),
('What was your wedding day like? Share every detail you remember.', 'LOVE', 'MEDIUM', true),
('When did you know you were in love?', 'LOVE', 'HARD', true),
('Tell me about your first date.', 'LOVE', 'EASY', true),
('What is the secret to a lasting relationship?', 'LOVE', 'HARD', true),

-- Career
('Tell me about your first job. How did you get it?', 'CAREER', 'MEDIUM', true),
('What was the proudest moment of your career?', 'CAREER', 'MEDIUM', true),
('What advice would you give someone starting their career?', 'CAREER', 'HARD', true),
('Describe a typical day at work. What did you do?', 'CAREER', 'EASY', true),
('Who was the most influential person in your career?', 'CAREER', 'MEDIUM', true),

-- Travel
('What was the most memorable trip you ever took?', 'TRAVEL', 'MEDIUM', true),
('Describe a place you visited that took your breath away.', 'TRAVEL', 'MEDIUM', true),
('What is the farthest place you have ever traveled to?', 'TRAVEL', 'EASY', true),

-- Achievement
('Tell me about a time you overcame a major challenge.', 'ACHIEVEMENT', 'HARD', true),
('What is something you built or created that you are proud of?', 'ACHIEVEMENT', 'MEDIUM', true),
('Describe a moment when you felt extremely proud of yourself.', 'ACHIEVEMENT', 'MEDIUM', true),

-- Wisdom
('What advice would you give your younger self?', 'WISDOM', 'HARD', true),
('What is the most important lesson life has taught you?', 'WISDOM', 'HARD', true),
('If you could tell the next generation one thing, what would it be?', 'WISDOM', 'HARD', true),
('What does success mean to you?', 'WISDOM', 'HARD', true),
('What are you most grateful for in life?', 'WISDOM', 'MEDIUM', true),

-- General
('What invention or technology surprised you the most in your lifetime?', 'GENERAL', 'MEDIUM', true),
('Describe the best day of your life.', 'GENERAL', 'HARD', true),
('What song always makes you think of a special memory?', 'GENERAL', 'EASY', true),
('If you could relive one day, which would it be and why?', 'GENERAL', 'HARD', true),
('What are three words that describe your life?', 'GENERAL', 'MEDIUM', true);

-- Seed Default Tags
INSERT INTO tags (name, category) VALUES
-- Life Stages
('childhood', 'LIFE_STAGE'),
('teenage-years', 'LIFE_STAGE'),
('young-adult', 'LIFE_STAGE'),
('adulthood', 'LIFE_STAGE'),
('parenthood', 'LIFE_STAGE'),
('retirement', 'LIFE_STAGE'),

-- Emotions
('joy', 'EMOTION'),
('love', 'EMOTION'),
('sadness', 'EMOTION'),
('pride', 'EMOTION'),
('nostalgia', 'EMOTION'),
('gratitude', 'EMOTION'),
('fear', 'EMOTION'),
('excitement', 'EMOTION'),

-- Events
('wedding', 'EVENT'),
('birthday', 'EVENT'),
('graduation', 'EVENT'),
('anniversary', 'EVENT'),
('holiday', 'EVENT'),
('funeral', 'EVENT'),

-- Themes
('family', 'THEME'),
('friendship', 'THEME'),
('career', 'THEME'),
('education', 'THEME'),
('travel', 'THEME'),
('home', 'THEME'),
('war', 'THEME'),
('achievement', 'THEME'),

-- Decades
('1930s', 'TIME_PERIOD'),
('1940s', 'TIME_PERIOD'),
('1950s', 'TIME_PERIOD'),
('1960s', 'TIME_PERIOD'),
('1970s', 'TIME_PERIOD'),
('1980s', 'TIME_PERIOD'),
('1990s', 'TIME_PERIOD'),
('2000s', 'TIME_PERIOD');

-- Create Demo User (Optional - for testing)
-- Password: Demo123! (BCrypt hashed)
INSERT INTO users (email, password, name, role, bio, is_active) VALUES
    ('demo@memorykeeper.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'Demo Grandparent', 'GRANDPARENT', 'This is a demo account for testing Memory Keeper', true);