// src/main/java/com/example/memory_keeper/model/entity/Tag.java
package com.example.memory_keeper.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tags")
@Getter // Use Getter
@Setter // Use Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 100)
    private String name;

    private String category;

    // --- START OF FIX ---
    @Column(name = "usage_count", nullable = false)
    @Builder.Default // This tells Lombok's builder to use the default value
    private Integer usageCount = 0;
    // --- END OF FIX ---

    @ManyToMany(mappedBy = "tags")
    @Builder.Default
    private Set<Story> stories = new HashSet<>();

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    public void incrementUsage() {
        if (this.usageCount == null) {
            this.usageCount = 0;
        }
        this.usageCount++;
    }
}