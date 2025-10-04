package com.example.memory_keeper.model.entity;

import com.example.memory_keeper.model.enums.EmotionType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "emotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Emotion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "story_id", nullable = false)
    private Story story;

    @Enumerated(EnumType.STRING)
    @Column(name = "emotion_type", nullable = false)
    private EmotionType emotionType;

    @Column(precision = 3, scale = 2)
    private BigDecimal confidence; // 0.00 to 1.00

    @Column(name = "timestamp_seconds")
    private Integer timestampSeconds;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // Helper method
    public String getEmotionDisplay() {
        return emotionType.getEmoji() + " " + emotionType.getDisplayName();
    }
}