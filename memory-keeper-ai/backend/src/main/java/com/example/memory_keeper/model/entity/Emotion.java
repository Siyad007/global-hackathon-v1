package com.example.memory_keeper.model.entity;
// src/main/java/com/memorykeeper/model/entity/Emotion.java
package com.memorykeeper.model.entity;

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

    @Column(name = "emotion_type", nullable = false)
    private String emotionType;

    @Column(precision = 3, scale = 2)
    private BigDecimal confidence;

    @Column(name = "timestamp_seconds")
    private Integer timestampSeconds;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}