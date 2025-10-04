package com.example.memory_keeper.model.entity;
// src/main/java/com/memorykeeper/model/entity/Prompt.java
package com.memorykeeper.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "prompts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Prompt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private String category; // CHILDHOOD, CAREER, LOVE, etc.

    private String difficulty; // EASY, MEDIUM, HARD

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "usage_count")
    private Integer usageCount = 0;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public void incrementUsage() {
        this.usageCount++;
    }
}