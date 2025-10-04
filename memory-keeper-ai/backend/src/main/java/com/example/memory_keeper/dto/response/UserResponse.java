package com.example.memory_keeper.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String email;
    private String name;
    private String role;
    private String avatarUrl;
    private String bio;
    private Integer streakCount;
    private Integer totalStories;
    private LocalDateTime createdAt;
}