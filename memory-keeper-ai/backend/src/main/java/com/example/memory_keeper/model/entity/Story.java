package com.example.memory_keeper.model.entity;


import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "stories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Story {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "family_id")
    private Family family;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String transcript;

    @Column(name = "enhanced_story", columnDefinition = "TEXT")
    private String enhancedStory;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "image_url")
    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private StoryCategory category;

    @Column(name = "sentiment_score", precision = 3, scale = 2)
    private BigDecimal sentimentScore;

    @Column(name = "sentiment_label")
    private String sentimentLabel;

    @Column(name = "word_count")
    private Integer wordCount;

    @Column(name = "duration_seconds")
    private Integer durationSeconds;

    @Column(name = "is_public")
    private Boolean isPublic = false;

    @Column(name = "is_featured")
    private Boolean isFeatured = false;

    @Column(name = "views_count")
    private Integer viewsCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Relationships
    @ManyToMany
    @JoinTable(
            name = "story_tags",
            joinColumns = @JoinColumn(name = "story_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    private Set<Tag> tags = new HashSet<>();

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Emotion> emotions = new HashSet<>();

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Reaction> reactions = new HashSet<>();

    @OneToMany(mappedBy = "story", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<Comment> comments = new HashSet<>();
    // Add this method to Story entity
    public int getReactionCount(ReactionType reactionType) {
        return (int) reactions.stream()
                .filter(r -> r.getReactionType() == reactionType)
                .count();
    }

    public int getReactionCount(String reactionTypeString) {
        try {
            ReactionType type = ReactionType.valueOf(reactionTypeString);
            return getReactionCount(type);
        } catch (IllegalArgumentException e) {
            return 0;
        }
    }

    public void incrementViews() {
        this.viewsCount++;
    }
}