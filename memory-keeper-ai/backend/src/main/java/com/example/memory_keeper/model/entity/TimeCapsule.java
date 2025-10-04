package com.example.memory_keeper.model.entity;
// src/main/java/com/memorykeeper/model/entity/TimeCapsule.java
package com.memorykeeper.model.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "time_capsules")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TimeCapsule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "recipient_email")
    private String recipientEmail;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "audio_url")
    private String audioUrl;

    @Column(name = "video_url")
    private String videoUrl;

    @Column(nullable = false)
    private LocalDate deliveryDate;

    @Column(name = "event_type")
    private String eventType; // WEDDING, BIRTHDAY, GRADUATION, etc.

    @Column(name = "is_delivered")
    private Boolean isDelivered = false;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;
}