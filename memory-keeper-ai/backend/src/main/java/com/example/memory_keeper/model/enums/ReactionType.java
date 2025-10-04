package com.example.memory_keeper.model.enums;
// src/main/java/com/example/memory_keeper/model/enums/ReactionType.java
package com.example.memory_keeper.model.enums;

/**
 * Reaction types for stories
 * Similar to Facebook reactions but family-themed
 */
public enum ReactionType {

    // Primary Reactions
    HEART("❤️", "Love", "Show love and appreciation"),
    SMILE("😊", "Happy", "This made me smile"),
    CRY("😢", "Emotional", "This touched my heart"),
    LAUGH("😂", "Funny", "This made me laugh"),
    WOW("😮", "Amazing", "Wow, incredible!"),

    // Supportive Reactions
    PRAY("🙏", "Grateful", "Thankful for this memory"),
    HUG("🤗", "Hugs", "Sending virtual hugs"),
    CLAP("👏", "Proud", "So proud of you"),
    STRONG("💪", "Inspiring", "You're so strong"),

    // Emotional Reactions
    MISS("💔", "Miss You", "Missing you dearly"),
    REMEMBER("🌟", "Remember", "I remember this!"),
    NOSTALGIC("🌅", "Nostalgic", "Takes me back"),

    // Appreciative Reactions
    WISDOM("🧠", "Wise", "Such wisdom"),
    TREASURE("💎", "Treasure", "A treasured memory"),
    LEGACY("👑", "Legacy", "Beautiful legacy"),

    // Family Reactions
    FAMILY("👨‍👩‍👧‍👦", "Family Love", "Family forever"),
    GENERATIONS("🌳", "Generations", "Across generations"),
    CELEBRATE("🎉", "Celebrate", "Worth celebrating");

    private final String emoji;
    private final String label;
    private final String description;

    ReactionType(String emoji, String label, String description) {
        this.emoji = emoji;
        this.label = label;
        this.description = description;
    }

    public String getEmoji() {
        return emoji;
    }

    public String getLabel() {
        return label;
    }

    public String getDescription() {
        return description;
    }

    public String getDisplayName() {
        return emoji + " " + label;
    }

    /**
     * Get reaction by string (case-insensitive)
     */
    public static ReactionType fromString(String reaction) {
        try {
            return ReactionType.valueOf(reaction.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return HEART; // Default to heart
        }
    }

    /**
     * Get all primary reactions (most commonly used)
     */
    public static ReactionType[] getPrimaryReactions() {
        return new ReactionType[]{HEART, SMILE, CRY, LAUGH, WOW};
    }

    /**
     * Get all family-themed reactions
     */
    public static ReactionType[] getFamilyReactions() {
        return new ReactionType[]{FAMILY, GENERATIONS, HEART, HUG, PRAY};
    }

    /**
     * Get color for UI (CSS-friendly)
     */
    public String getColor() {
        switch (this) {
            case HEART:
            case MISS:
                return "#e74c3c"; // Red

            case SMILE:
            case LAUGH:
            case CELEBRATE:
                return "#f39c12"; // Orange

            case CRY:
            case HUG:
                return "#3498db"; // Blue

            case WOW:
            case WISDOM:
                return "#9b59b6"; // Purple

            case PRAY:
            case TREASURE:
                return "#e67e22"; // Dark Orange

            case CLAP:
            case STRONG:
            case LEGACY:
                return "#2ecc71"; // Green

            case REMEMBER:
            case NOSTALGIC:
                return "#95a5a6"; // Gray

            case FAMILY:
            case GENERATIONS:
                return "#16a085"; // Teal

            default:
                return "#34495e"; // Dark Gray
        }
    }
}