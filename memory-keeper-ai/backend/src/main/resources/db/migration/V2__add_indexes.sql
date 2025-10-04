-- src/main/resources/db/migration/V2__seed_data.sql

-- Seed Prompts
INSERT INTO prompts (content, category, difficulty) VALUES
                                                        ('What was your favorite meal as a child, and who made it?', 'CHILDHOOD', 'EASY'),
                                                        ('Describe your first day at school. What do you remember?', 'CHILDHOOD', 'EASY'),
                                                        ('Tell me about a time you felt extremely proud of yourself.', 'GENERAL', 'MEDIUM'),
                                                        ('What was your wedding day like? Share every detail you remember.', 'LOVE', 'MEDIUM'),
                                                        ('Describe the house you grew up in. Which room was your favorite?', 'CHILDHOOD', 'EASY'),
                                                        ('What was the hardest decision you ever had to make?', 'LIFE_LESSONS', 'HARD'),
                                                        ('Tell me about your first job. How did you get it?', 'CAREER', 'MEDIUM'),
                                                        ('What advice would you give your younger self?', 'WISDOM', 'HARD'),
                                                        ('Describe a tradition your family had. Why was it special?', 'FAMILY', 'MEDIUM'),
                                                        ('What invention or technology surprised you the most in your lifetime?', 'GENERAL', 'MEDIUM');

-- Seed Tags
INSERT INTO tags (name, category) VALUES
                                      ('childhood', 'LIFE_STAGE'),
                                      ('career', 'LIFE_STAGE'),
                                      ('family', 'RELATIONSHIP'),
                                      ('love', 'RELATIONSHIP'),
                                      ('war', 'HISTORICAL'),
                                      ('travel', 'EXPERIENCE'),
                                      ('achievement', 'MILESTONE'),
                                      ('loss', 'EMOTION'),
                                      ('joy', 'EMOTION'),
                                      ('nostalgia', 'EMOTION');