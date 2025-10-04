package com.example.memory_keeper.model.enums;
// src/main/java/com/example/memory_keeper/model/enums/EmotionType.java
package com.example.memory_keeper.model.enums;

/**
 * Emotion types detected by AI in stories
 * Based on Hugging Face emotion detection model
 */
public enum EmotionType {

    // Primary Emotions (Ekman's 6 basic emotions)
    JOY("😊", "Happiness, pleasure, contentment"),
    SADNESS("😢", "Sorrow, grief, melancholy"),
    ANGER("😠", "Frustration, irritation, rage"),
    FEAR("😨", "Anxiety, worry, terror"),
    SURPRISE("😲", "Amazement, astonishment, shock"),
    DISGUST("🤢", "Revulsion, distaste, aversion"),

    // Secondary Emotions (Complex emotions)
    LOVE("❤️", "Affection, adoration, romance"),
    NOSTALGIA("🌅", "Longing for the past, wistfulness"),
    PRIDE("🦁", "Satisfaction, achievement, dignity"),
    GRATITUDE("🙏", "Thankfulness, appreciation"),
    SHAME("😳", "Embarrassment, humiliation"),
    GUILT("😔", "Remorse, regret"),

    // Social Emotions
    LONELINESS("😞", "Isolation, solitude"),
    EXCITEMENT("🎉", "Enthusiasm, eagerness"),
    RELIEF("😌", "Comfort, ease, reassurance"),
    HOPE("🌟", "Optimism, expectation"),
    DESPAIR("😰", "Hopelessness, desperation"),

    // Reflective Emotions
    CURIOSITY("🤔", "Interest, inquisitiveness"),
    CONFUSION("😕", "Uncertainty, bewilderment"),
    ADMIRATION("👏", "Respect, appreciation"),
    DISAPPOINTMENT("😞", "Letdown, disillusionment"),

    // Neutral
    NEUTRAL("😐", "No strong emotion detected"),
    MIXED("🎭", "Multiple conflicting emotions");

    private final String emoji;
    private final String description;

    EmotionType(String emoji, String description) {
        this.emoji = emoji;
        this.description = description;
    }

    public String getEmoji() {
        return emoji;
    }

    public String getDescription() {
        return description;
    }

    public String getDisplayName() {
        return name().charAt(0) + name().substring(1).toLowerCase().replace("_", " ");
    }

    /**
     * Get emotion by string (case-insensitive)
     */
    public static EmotionType fromString(String emotion) {
        try {
            return EmotionType.valueOf(emotion.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return NEUTRAL;
        }
    }

    /**
     * Check if emotion is positive
     */
    public boolean isPositive() {
        return this == JOY || this == LOVE || this == PRIDE ||
                this == GRATITUDE || this == EXCITEMENT ||
                this == RELIEF || this == HOPE || this == ADMIRATION;
    }

    /**
     * Check if emotion is negative
     */
    public boolean isNegative() {
        return this == SADNESS || this == ANGER || this == FEAR ||
                this == DISGUST || this == SHAME || this == GUILT ||
                this == LONELINESS || this == DESPAIR || this == DISAPPOINTMENT;
    }

    /**
     * Get intensity level (1-5)
     */
    public int getIntensityLevel() {
        switch (this) {
            case ANGER:
            case DESPAIR:
            case LOVE:
                return 5; // Very intense

            case FEAR:
            case JOY:
            case EXCITEMENT:
                return 4; // High intensity

            case SADNESS:
            case PRIDE:
            case NOSTALGIA:
                return 3; // Moderate intensity

            case HOPE:
            case RELIEF:
            case GRATITUDE:
                return 2; // Low intensity

            default:
                return 1; // Minimal intensity
        }
    }
}